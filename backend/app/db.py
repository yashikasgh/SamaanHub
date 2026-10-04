from sqlalchemy import create_engine
from .config import settings

engine = create_engine(settings.database_url, pool_pre_ping=True, pool_size=5, max_overflow=5)

def get_conn():
    with engine.connect() as conn:
        yield conn
