import dataclasses
import hashlib
import json
import re
from sqlalchemy import text
from ..db import engine
from ..adapters import get_adapter
from ..adapters.base import NProduct
from . import images as img

def slugify(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-") or "item"

def unique_slug(c, table: str, base: str) -> str:
    slug, n = base, 2
    while c.execute(text(f"select 1 from {table} where slug = :s"), {"s": slug}).first():
        slug, n = f"{base}-{n}", n + 1
    return slug

def np_hash(p: NProduct) -> str:
    return hashlib.sha256(json.dumps(dataclasses.asdict(p), sort_keys=True, default=str).encode()).hexdigest()

def strip_tags(html: str) -> str:
    return re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", html or "")).strip()

def start_run(source_type: str, kind: str, by: str):
    with engine.begin() as c:
        sid = c.execute(text("select id from sources where type = :t order by created_at limit 1"), {"t": source_type}).scalar_one()
        rid = c.execute(text("insert into sync_runs(source_id, kind, triggered_by) values (:s, :k, :b) returning id"),
                        {"s": sid, "k": kind, "b": by}).scalar_one()
        return str(rid), str(sid)

def log_error(rid, ext, stage, msg):
    with engine.begin() as c:
        c.execute(text("insert into sync_errors(sync_run_id, external_id, stage, message) values (:r, :e, :s, :m)"),
                  {"r": rid, "e": ext, "s": stage, "m": str(msg)[:1000]})

def finish(rid, sid, status, counts, summary=None):
    with engine.begin() as c:
        c.execute(text("""update sync_runs set status = :st, finished_at = now(), fetched_count = :f, created_count = :c,
                          updated_count = :u, unchanged_count = :n, failed_count = :x, removed_count = :r, error_summary = :e where id = :id"""),
                  {"st": status, "f": counts["f"], "c": counts["c"], "u": counts["u"], "n": counts["n"],
                   "x": counts["x"], "r": counts["r"], "e": summary, "id": rid})
        c.execute(text("update sources set last_sync_at = now(), last_sync_status = :st where id = :s"), {"st": status, "s": sid})

def upsert_categories(c, sid, cats):
    ids = {}
    for cat in cats:
        row = c.execute(text("select id from categories where source_id = :s and external_id = :e"),
                        {"s": sid, "e": cat.external_id}).first()
        if row:
            ids[cat.external_id] = row[0]
            continue
        parent = ids.get(cat.parent_external_id) if cat.parent_external_id else None
        slug = unique_slug(c, "categories", slugify(cat.name))
        pos = c.execute(text("select coalesce(max(position), 0) + 1 from categories")).scalar()
        ids[cat.external_id] = c.execute(text("""insert into categories(source_id, external_id, name, slug, parent_id, position)
                                                 values (:s, :e, :n, :sl, :p, :pos) returning id"""),
                                         {"s": sid, "e": cat.external_id, "n": cat.name, "sl": slug, "p": parent, "pos": pos}).scalar_one()
    return list(ids.values())

def sync_images(c, pid, images):
    errs, seen = [], set()
    existing = {r["original_url"]: r["id"] for r in c.execute(
        text("select id, original_url from product_images where product_id = :p"), {"p": pid}).mappings()}
    wanted = [i for i in images if not (i.url in seen or seen.add(i.url))]
    for url, iid in existing.items():
        if url not in {i.url for i in wanted}:
            c.execute(text("delete from product_images where id = :i"), {"i": iid})
    for pos, i in enumerate(wanted):
        if i.url in existing:
            c.execute(text("update product_images set position = :pos where id = :i"), {"pos": pos, "i": existing[i.url]})
            continue
        public_id, status = None, "ok"
        try:
            public_id = img.upload(i.url)
        except Exception as e:
            status = "failed"
            errs.append(f"image upload failed ({i.url}): {e}")
        c.execute(text("""insert into product_images(product_id, position, original_url, cdn_public_id, alt, status)
                          values (:p, :pos, :u, :cid, :alt, :st)"""), {"p": pid, "pos": pos, "u": i.url, "cid": public_id, "alt": i.alt, "st": status})
    first = c.execute(text("select original_url, cdn_public_id from product_images where product_id = :p order by position limit 1"), {"p": pid}).first()
    thumb = (img.base_url(first[1]) if first and first[1] else (first[0] if first else None))
    c.execute(text("update products set thumb_url = :t where id = :p"), {"t": thumb, "p": pid})
    return errs

def process_product(sid, np: NProduct):
    h = np_hash(np)
    with engine.begin() as c:
        row = c.execute(text("select id, content_hash, remote_deleted_at, locked_fields from products where source_id = :s and external_id = :e"),
                        {"s": sid, "e": np.external_id}).mappings().first()
        if row and row["content_hash"] == h and row["remote_deleted_at"] is None:
            c.execute(text("update products set last_synced_at = now() where id = :i"), {"i": row["id"]})
            return "unchanged", []
        
        fields = dict(sku=np.sku, name=np.name, description_html=np.description_html,
                      description_text=strip_tags(np.description_html),
                      price=np.price, compare_at_price=np.compare_at_price, currency=np.currency, availability=np.availability,
                      stock_quantity=np.stock_quantity, source_url=np.source_url)
        meta = json.dumps(np.metadata, default=str)
        if row:
            pid, result = row["id"], "updated"
            locked = set(row["locked_fields"] or [])
            upd = {k: v for k, v in fields.items() if k not in locked}
            sets = ", ".join(f"{k} = :{k}" for k in upd)
            c.execute(text(f"""update products set {sets}{', ' if sets else ''}metadata = cast(:meta as jsonb), content_hash = :h,
                               remote_deleted_at = null, last_synced_at = now(), updated_at = now() where id = :id"""),
                      {**upd, "meta": meta, "h": h, "id": pid})
        else:
            result = "created"
            pid = c.execute(text("""insert into products(source_id, external_id, slug, sku, name, description_html,
                                    description_text, price, compare_at_price, currency, availability, stock_quantity, source_url, metadata, content_hash, last_synced_at)
                                    values (:source_id, :external_id, :slug, :sku, :name, :description_html, :description_text, :price,
                                    :compare_at_price, :currency, :availability, :stock_quantity, :source_url, cast(:meta as jsonb), :h, now()) returning id"""),
                            {**fields, "source_id": sid, "external_id": np.external_id,
                             "slug": unique_slug(c, "products", slugify(np.name)), "meta": meta, "h": h}).scalar_one()
                             
        c.execute(text("""delete from product_categories pc using categories ct
                          where pc.category_id = ct.id and pc.product_id = :p and ct.source_id = :s"""), {"p": pid, "s": sid})
        for cid in upsert_categories(c, sid, np.categories):
            c.execute(text("insert into product_categories(product_id, category_id) values (:p, :c) on conflict do nothing"),
                      {"p": pid, "c": cid})
                      
        c.execute(text("delete from product_variants where product_id = :p"), {"p": pid})
        for v in np.variants:
            c.execute(text("""insert into product_variants(product_id, external_id, sku, title, price, stock_quantity, availability, options)
                              values (:p, :e, :sku, :t, :pr, :st, :av, cast(:o as jsonb))"""),
                      {"p": pid, "e": v.external_id, "sku": v.sku, "t": v.title, "pr": v.price, "st": v.stock,
                       "av": v.availability, "o": json.dumps(v.options)})
        errs = sync_images(c, pid, np.images)
        return result, errs

def execute_run(rid: str, sid: str, source_type: str):
    counts = dict(f=0, c=0, u=0, n=0, x=0, r=0)
    try:
        adapter = get_adapter(source_type)
        try:
            adapter.test_connection()
        except Exception as e:
            log_error(rid, None, "fetch", e)
            finish(rid, sid, "failed", counts, str(e)[:500])
            return
            
        seen, fetch_ok = [], True
        try:
            for np in adapter.iter_products():
                counts["f"] += 1
                seen.append(np.external_id)
                try:
                    result, errs = process_product(sid, np)
                    counts[{"created": "c", "updated": "u", "unchanged": "n"}[result]] += 1
                    for m in errs:
                        log_error(rid, np.external_id, "image", m)
                except Exception as e:
                    counts["x"] += 1
                    log_error(rid, np.external_id, "upsert", e)
        except Exception as e:
            fetch_ok = False
            log_error(rid, None, "fetch", e)
            
        if fetch_ok and seen:
            with engine.begin() as c:
                counts["r"] = c.execute(text("""update products set remote_deleted_at = now()
                                                where source_id = :s and remote_deleted_at is null and external_id <> all(cast(:seen as text[]))"""),
                                        {"s": sid, "seen": seen}).rowcount
        status = "success" if fetch_ok and counts["x"] == 0 else ("failed" if counts["f"] == 0 else "partial")
        finish(rid, sid, status, counts, None if status == "success" else "See sync errors")
    except Exception as e:
        log_error(rid, None, "fetch", e)
        finish(rid, sid, "failed", counts, str(e)[:500])
