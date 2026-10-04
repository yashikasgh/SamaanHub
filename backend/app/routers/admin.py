from fastapi import APIRouter, BackgroundTasks, HTTPException, Depends
from pydantic import BaseModel
from sqlalchemy import text
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
    # First check if the email exists in DB
    admin = conn.execute(
        text("SELECT id, email, password_hash FROM admin_users WHERE email = :email"),
        {"email": req.email}
    ).mappings().first()
    
    # If the user doesn't exist but matches the .env config, we insert it on the fly (seed on first login)
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

