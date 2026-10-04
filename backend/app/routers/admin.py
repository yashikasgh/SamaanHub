from fastapi import APIRouter, BackgroundTasks, HTTPException
from sqlalchemy import text
from ..db import engine
from ..services.sync_engine import start_run, execute_run

router = APIRouter(tags=["admin"])
# Stub for Phase 4: No JWT yet. We will add JWT auth in Phase 5.

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
def import_source(source: str, bg: BackgroundTasks):
    return _start(source, "import", bg, "admin@samaanhub.com")

@router.post("/sync/{source}")
def sync_source(source: str, bg: BackgroundTasks):
    return _start(source, "sync", bg, "admin@samaanhub.com")

@router.get("/sync/runs")
def runs():
    with engine.connect() as c:
        rows = c.execute(text("""select r.id::text as id, s.type as source, r.kind, r.status, r.started_at, r.finished_at,
                                 r.fetched_count, r.created_count, r.updated_count, r.unchanged_count, r.failed_count, r.removed_count, r.error_summary
                                 from sync_runs r join sources s on s.id = r.source_id order by r.started_at desc limit 50""")).mappings().all()
    return {"items": [dict(r) for r in rows]}
