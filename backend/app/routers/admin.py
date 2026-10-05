from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends, Query
from pydantic import BaseModel
from sqlalchemy import text
from typing import Any
import json
from ..db import engine, get_conn
from ..services.sync_engine import start_run, execute_run
from ..auth import verify_password, create_access_token, get_current_admin
from ..config import settings

router = APIRouter(tags=["admin"])

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login")
def login(req: LoginRequest, conn = Depends(get_conn)):
    admin = conn.execute(
        text("SELECT id, email, password_hash FROM admin_users WHERE email = :email"),
        {"email": req.email}
    ).mappings().first()
    
    if not admin:
        if req.email == settings.admin_email and req.password == settings.admin_password:
            from ..auth import get_password_hash
            hashed = get_password_hash(settings.admin_password)
            try:
                admin_id = conn.execute(
                    text("INSERT INTO admin_users (email, password_hash) VALUES (:email, :hash) RETURNING id"),
                    {"email": settings.admin_email, "hash": hashed}
                ).scalar()
                conn.commit()
                admin = {"id": admin_id, "email": settings.admin_email, "password_hash": hashed}
            except Exception:
                raise HTTPException(status_code=500, detail="Could not seed admin user")
        else:
            raise HTTPException(status_code=401, detail="Invalid email or password")
            
    if not verify_password(req.password, admin["password_hash"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")
        
    access_token = create_access_token(data={"sub": admin["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

def _start(source: str, kind: str, bg: BackgroundTasks, admin: str):
    if source not in ("shopify", "woocommerce"):
        raise HTTPException(404, "Unknown source")
    with engine.connect() as c:
        running = c.execute(text("""select 1 from sync_runs r join sources s on s.id = r.source_id 
                                    where s.type = :t and r.status = 'running' and r.started_at > now() - interval '30 minutes'"""), {"t": source}).first()
        if running:
            raise HTTPException(409, "A run for this source is already in progress")
    rid, sid = start_run(source, kind, admin)
    bg.add_task(execute_run, rid, sid, source)
    return {"run_id": rid}

@router.post("/import/{source}")
def import_source(source: str, bg: BackgroundTasks, admin: dict = Depends(get_current_admin)):
    return _start(source, "import", bg, admin["email"])

@router.post("/sync/{source}")
def sync_source(source: str, bg: BackgroundTasks, admin: dict = Depends(get_current_admin)):
    return _start(source, "sync", bg, admin["email"])

@router.get("/sync/runs")
def runs(admin: dict = Depends(get_current_admin)):
    with engine.connect() as c:
        rows = c.execute(text("""select r.id::text as id, s.type as source, r.kind, r.status, r.started_at, r.finished_at,
                                 r.fetched_count, r.created_count, r.updated_count, r.unchanged_count, r.failed_count, r.removed_count, r.error_summary
                                 from sync_runs r join sources s on s.id = r.source_id order by r.started_at desc limit 50""")).mappings().all()
    return {"items": [dict(r) for r in rows]}

@router.get("/stats")
def get_stats(conn = Depends(get_conn), admin: dict = Depends(get_current_admin)):
    products = conn.execute(text("select count(*) from products")).scalar()
    categories = conn.execute(text("select count(*) from categories")).scalar()
    sources = conn.execute(text("select id::text, type, name, last_sync_at, last_sync_status from sources")).mappings().all()
    return {
        "products": products,
        "categories": categories,
        "sources": [dict(s) for s in sources]
    }

@router.get("/settings")
def get_settings(conn = Depends(get_conn), admin: dict = Depends(get_current_admin)):
    rows = conn.execute(text("select key, value from settings")).all()
    return {k: v for k, v in rows}

class SettingsUpdate(BaseModel):
    # JSONB settings can legitimately contain strings, booleans, numbers, and
    # objects.  Keep their Python values intact until serializing for Postgres.
    settings: dict[str, Any]

@router.post("/settings")
def update_settings(req: SettingsUpdate, conn = Depends(get_conn), admin: dict = Depends(get_current_admin)):
    for k, v in req.settings.items():
        conn.execute(
            text("""insert into settings (key, value) values (:k, cast(:v as jsonb))
                    on conflict (key) do update set value = cast(:v as jsonb), updated_at = now()"""),
            {"k": k, "v": json.dumps(v)}
        )
    conn.commit()
    return {"status": "ok"}

@router.get("/products")
def get_products(q: str = "", page: int = 1, limit: int = Query(50, le=100), conn = Depends(get_conn), admin: dict = Depends(get_current_admin)):
    where = []
    params = {"lim": limit, "off": (page - 1) * limit}
    if q:
        where.append("(p.name ilike :q or p.sku ilike :q)")
        params["q"] = f"%{q.strip()}%"
    
    where_clause = f"where {' and '.join(where)}" if where else ""
    
    total = conn.execute(text(f"select count(*) from products p {where_clause}"), params).scalar()
    rows = conn.execute(text(f"""
        select p.id::text, p.name, p.sku, p.price, p.availability, p.is_published, s.type as source_type, p.thumb_url
        from products p join sources s on s.id = p.source_id
        {where_clause} order by p.created_at desc limit :lim offset :off
    """), params).mappings().all()
    
    return {"items": [dict(r) for r in rows], "total": total, "page": page, "limit": limit}

@router.get("/products/{id}")
def get_product(id: str, conn = Depends(get_conn), admin: dict = Depends(get_current_admin)):
    p = conn.execute(text("""select p.id::text, p.name, p.sku, p.price, p.compare_at_price, p.availability, 
                             p.is_published, p.description_html, p.locked_fields, s.type as source_type
                             from products p join sources s on s.id = p.source_id where p.id = cast(:i as uuid)"""), 
                     {"i": id}).mappings().first()
    if not p:
        raise HTTPException(404, "Product not found")
    return dict(p)

class ProductUpdate(BaseModel):
    name: str | None = None
    price: float | None = None
    compare_at_price: float | None = None
    availability: str | None = None
    description_html: str | None = None
    is_published: bool | None = None

@router.put("/products/{id}")
def update_product(id: str, req: ProductUpdate, conn = Depends(get_conn), admin: dict = Depends(get_current_admin)):
    row = conn.execute(text("select locked_fields from products where id = cast(:i as uuid)"), {"i": id}).mappings().first()
    if not row:
        raise HTTPException(404, "Product not found")
        
    locked = set(row["locked_fields"] or [])
    upd = req.model_dump(exclude_unset=True)
    if not upd:
        return {"status": "ok"}
        
    for k in upd.keys():
        locked.add(k)
        
    sets = ", ".join(f"{k} = :{k}" for k in upd)
    conn.execute(text(f"update products set {sets}, locked_fields = cast(:lk as text[]), updated_at = now() where id = cast(:i as uuid)"),
                 {**upd, "lk": list(locked), "i": id})
    conn.commit()
    return {"status": "ok"}

@router.get("/categories")
def get_categories(conn = Depends(get_conn), admin: dict = Depends(get_current_admin)):
    rows = conn.execute(text("""
        select c.id::text, c.name, c.slug, c.position, c.is_visible, s.type as source_type
        from categories c left join sources s on s.id = c.source_id order by c.position, c.name
    """)).mappings().all()
    return {"items": [dict(r) for r in rows]}

class CategoryUpdate(BaseModel):
    is_visible: bool | None = None
    position: int | None = None

@router.put("/categories/{id}")
def update_category(id: str, req: CategoryUpdate, conn = Depends(get_conn), admin: dict = Depends(get_current_admin)):
    upd = req.model_dump(exclude_unset=True)
    if upd:
        sets = ", ".join(f"{k} = :{k}" for k in upd)
        conn.execute(text(f"update categories set {sets} where id = cast(:i as uuid)"), {**upd, "i": id})
        conn.commit()
    return {"status": "ok"}
