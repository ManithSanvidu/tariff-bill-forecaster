"""
Database session and connection management configured for Supabase PostgreSQL & SQLite fallback.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from app.db.models import Base

load_dotenv()
# Also search project root for .env if backend is executed from root or subfolder
root_env = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "..", ".env"))
if os.path.exists(root_env):
    load_dotenv(root_env)

# Supabase or standard PostgreSQL connection string (falls back to local SQLite if not configured)
DATABASE_URL = os.getenv("DATABASE_URL")

if not DATABASE_URL:
    # If running in a serverless environment like Vercel or AWS Lambda, the root is read-only.
    # Fallback SQLite must be located in /tmp to allow write access.
    if os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME"):
        DATABASE_URL = "sqlite:////tmp/tariff_forecaster.db"
    else:
        DATABASE_URL = "sqlite:///./tariff_forecaster.db"

# Fix SQLAlchemy URL scheme if provided as postgres:// (Supabase / Heroku legacy URL format)
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Handle special characters in password (such as '@') if unencoded in DATABASE_URL
if DATABASE_URL.startswith("postgresql://") or DATABASE_URL.startswith("postgresql+psycopg2://"):
    import re
    import urllib.parse
    # Match postgresql://user:password@host...
    match = re.match(r"^(postgresql(?:\+[a-zA-Z0-9_]+)?:\/\/)([^:]+):(.*)@([^@]+)$", DATABASE_URL)
    if match:
        prefix, user, raw_password, host_part = match.groups()
        # If password contains unencoded special chars (like @), re-encode safely
        if "%" not in raw_password:
            encoded_password = urllib.parse.quote(raw_password, safe="")
            DATABASE_URL = f"{prefix}{user}:{encoded_password}@{host_part}"

connect_args = {}
engine_kwargs = {}

if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}
else:
    # Production PostgreSQL (Supabase pooler / serverless recommendations)
    engine_kwargs = {
        "pool_pre_ping": True,
        "pool_recycle": 300,
    }

try:
    if DATABASE_URL.startswith("postgresql"):
        import psycopg2  # noqa: F401
    engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)
except Exception as e:
    import logging
    logging.getLogger(__name__).warning(
        f"Database connection setup failed ({e}). Falling back to SQLite."
    )
    fallback_path = "/tmp/tariff_forecaster.db" if (os.getenv("VERCEL") or os.getenv("AWS_LAMBDA_FUNCTION_NAME")) else "./tariff_forecaster.db"
    DATABASE_URL = f"sqlite:///{fallback_path}"
    connect_args = {"check_same_thread": False}
    engine_kwargs = {}
    engine = create_engine(DATABASE_URL, connect_args=connect_args, **engine_kwargs)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Initializes tables in database."""
    try:
        Base.metadata.create_all(bind=engine)
    except Exception as e:
        print(f"Warning: init_db failed: {e}")


def get_db():
    """FastAPI dependency for DB session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
