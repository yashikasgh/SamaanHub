from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from sqlalchemy import text
from .config import settings
from .db import engine
from .routers import catalog, admin

app = FastAPI(title="SamaanHub API")
app.add_middleware(GZipMiddleware, minimum_size=500)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in settings.cors_origins.split(",") if o.strip()],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.exception_handler(Exception)
async def unhandled(request: Request, exc: Exception):
    print("UNHANDLED:", repr(exc))  # visible in Render logs, never sent to the customer
    return JSONResponse(status_code=500, content={"error": {"code": "server_error", "message": "Something went wrong. Please try again."}})

@app.get("/api/health")
def health():
    with engine.connect() as c:
        c.execute(text("select 1"))
    return {"status": "ok"}

app.include_router(catalog.router, prefix="/api/catalog")
app.include_router(admin.router, prefix="/api/admin")
