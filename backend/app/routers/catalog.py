import base64
import json
from fastapi import APIRouter, Depends, HTTPException, Query, Response
from pydantic import BaseModel
from sqlalchemy import text
from ..db import get_conn
from ..services.images import base_url

router = APIRouter(tags=["catalog"])

VISIBLE = "p.is_published and p.remote_deleted_at is null"
LIST_COLS = "p.id::text as id, p.slug, p.name, p.price, p.currency, p.availability, p.thumb_url, p.created_at"

def enc(d: dict) -> str:
    return base64.urlsafe_b64encode(json.dumps(d).encode()).decode()

def dec(s: str) -> dict:
    try:
        return json.loads(base64.urlsafe_b64decode(s.encode()))
    except Exception:
        raise HTTPException(400, "Invalid cursor")

def cache(resp: Response, seconds: int):
    resp.headers["Cache-Control"] = f"public, max-age={seconds}, stale-while-revalidate={seconds * 5}"

def clean_url(url: str | None) -> str | None:
    if url and ("https://localhost" in url or "https://127.0.0.1" in url):
        return url.replace("https://", "http://")
    return url

def card(r) -> dict:
    return {"id": r["id"], "slug": r["slug"], "name": r["name"],
            "price": float(r["price"]) if r["price"] is not None else None,
            "currency": r["currency"], "availability": r["availability"], "thumb": clean_url(r["thumb_url"])}

@router.get("/config")
def get_config(resp: Response, conn=Depends(get_conn)):
    rows = conn.execute(text("select key, value from settings")).all()
    s = {k: v for k, v in rows}
    cache(resp, 10)  # short, so a design switch shows up quickly
    return {"active_design": s.get("active_design", "design_a"), "whatsapp_number": s.get("whatsapp_number", ""),
            "store_name": s.get("store_name", "Catalog"), "currency": s.get("currency", "INR")}

@router.get("/categories")
def categories(resp: Response, conn=Depends(get_conn)):
    rows = conn.execute(text(f"""
        select c.id::text as id, c.parent_id::text as parent_id, c.slug, c.name, c.position,
               (select count(*) from product_categories pc join products p on p.id = pc.product_id
                where pc.category_id = c.id and {VISIBLE}) as product_count
        from categories c where c.is_visible order by c.position, c.name""")).mappings().all()
    cache(resp, 30)
    return {"items": [dict(r) for r in rows]}

@router.get("/products")
def list_products(resp: Response, category: str | None = None, q: str | None = None,
                  min_price: float | None = None, max_price: float | None = None,
                  in_stock: bool = False, sort: str = "new", cursor: str | None = None,
                  limit: int = Query(24, ge=1, le=48), conn=Depends(get_conn)):
    where = [VISIBLE]
    params: dict = {"lim": limit + 1}
    
    if category:
        where.append("""exists (select 1 from product_categories pc join categories c on c.id = pc.category_id
                                where pc.product_id = p.id and c.is_visible and
                                (c.slug = :cat or c.parent_id in (select id from categories where slug = :cat)))""")
        params["cat"] = category
        
    if q:
        where.append("(p.name ilike :q or p.sku ilike :q)")
        params["q"] = f"%{q.strip()}%"
        
    if min_price is not None:
        where.append("p.price >= :minp"); params["minp"] = min_price
    if max_price is not None:
        where.append("p.price <= :maxp"); params["maxp"] = max_price
    if in_stock:
        where.append("p.availability = 'in_stock'")

    if sort == "new": # keyset pagination
        order = "p.created_at desc, p.id desc"
        offset_sql = ""
        if cursor:
            c = dec(cursor)
            where.append("(p.created_at, p.id) < (cast(:cc as timestamptz), cast(:ci as uuid))")
            params["cc"], params["ci"] = c["c"], c["i"]
    elif sort in ("price_asc", "price_desc"): # offset pagination
        order = f"p.price {'asc' if sort == 'price_asc' else 'desc'} nulls last, p.id"
        off = dec(cursor).get("o", 0) if cursor else 0
        offset_sql = " offset :off"
        params["off"] = off
    else:
        raise HTTPException(400, "Invalid sort")

    sql = f"select {LIST_COLS} from products p where {' and '.join(where)} order by {order} limit :lim{offset_sql}"
    rows = conn.execute(text(sql), params).mappings().all()
    has_more = len(rows) > limit
    rows = rows[:limit]
    
    next_cursor = None
    if has_more:
        last = rows[-1]
        next_cursor = enc({"c": last["created_at"].isoformat(), "i": last["id"]}) if sort == "new" \
                      else enc({"o": params["off"] + limit})
                      
    cache(resp, 30)
    return {"items": [card(r) for r in rows], "next_cursor": next_cursor, "has_more": has_more}

@router.get("/products/{slug}")
def product_detail(slug: str, resp: Response, conn=Depends(get_conn)):
    p = conn.execute(text(f"""select p.id::text as id, p.slug, p.name, p.sku, p.description_html, p.price,
                                     p.compare_at_price, p.currency, p.availability, p.stock_quantity, p.source_url
                              from products p where p.slug = :s and {VISIBLE}"""), {"s": slug}).mappings().first()
    if not p:
        raise HTTPException(404, "Product not found")
        
    imgs = conn.execute(text("select original_url, cdn_public_id, alt from product_images where product_id = cast(:i as uuid) order by position"), 
                        {"i": p["id"]}).mappings().all()
    variants = conn.execute(text("select title, sku, price, availability, stock_quantity, options from product_variants where product_id = cast(:i as uuid) order by title"), 
                            {"i": p["id"]}).mappings().all()
    cats = conn.execute(text("select c.slug, c.name from product_categories pc join categories c on c.id = pc.category_id where pc.product_id = cast(:i as uuid) and c.is_visible"), 
                        {"i": p["id"]}).mappings().all()
                        
    cache(resp, 30)
    return {
        "id": p["id"], "slug": p["slug"], "name": p["name"], "sku": p["sku"], "description_html": p["description_html"],
        "price": float(p["price"]) if p["price"] is not None else None,
        "compare_at_price": float(p["compare_at_price"]) if p["compare_at_price"] is not None else None,
        "currency": p["currency"], "availability": p["availability"], "stock_quantity": p["stock_quantity"],
        "source_url": p["source_url"],
        "images": [{"url": clean_url(base_url(i["cdn_public_id"]) if i["cdn_public_id"] else i["original_url"]), "alt": i["alt"]} for i in imgs],
        "variants": [{**dict(v), "price": float(v["price"]) if v["price"] is not None else None} for v in variants],
        "categories": [dict(c) for c in cats],
    }

@router.get("/products/{slug}/related")
def related(slug: str, resp: Response, conn=Depends(get_conn)):
    rows = conn.execute(text(f"""select distinct on (p.id) {LIST_COLS} from products p
                                 join product_categories pc on pc.product_id = p.id
                                 where {VISIBLE} and p.slug <> :s and pc.category_id in
                                 (select pc2.category_id from product_categories pc2 join products x on x.id = pc2.product_id where x.slug = :s)
                                 order by p.id limit 8"""), {"s": slug}).mappings().all()
    cache(resp, 60)
    return {"items": [card(r) for r in rows]}

class ByIds(BaseModel):
    ids: list[str]

@router.post("/products/by-ids")
def by_ids(body: ByIds, conn=Depends(get_conn)):
    ids = body.ids[:50]
    try:
        rows = conn.execute(text(f"select {LIST_COLS} from products p where p.id = any(cast(:ids as uuid[])) and {VISIBLE}"),
                            {"ids": ids}).mappings().all()
    except Exception:
        raise HTTPException(400, "Invalid ids")
    return {"items": [card(r) for r in rows]}
