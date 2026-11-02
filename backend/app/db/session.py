"""
Database session and connection management configured for Supabase PostgreSQL & SQLite fallback.
"""

import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from dotenv import load_dotenv
from app.db.models import Base

load_dotenv()

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
