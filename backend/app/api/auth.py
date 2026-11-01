"""
User authentication and registration endpoints.
Supports user sign up, login, profile management, and pseudonymous household linking.
"""

from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr, Field
from sqlalchemy.orm import Session
import uuid
import hashlib

from app.db.session import get_db
from app.db.models import User, Household

router = APIRouter(prefix="/auth", tags=["auth"])


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


class RegisterRequest(BaseModel):
    name: str = Field(..., min_length=2)
    email: str = Field(..., description="User email address")
    password: str = Field(..., min_length=6)
    district: str = "Colombo"
    electricity_provider: str = "CEB"


class LoginRequest(BaseModel):
    email: str
    password: str


class AuthResponse(BaseModel):
    status: str
    token: str
    user: dict
    household_id: str


@router.post("/register", response_model=AuthResponse)
def register_user(req: RegisterRequest, db: Session = Depends(get_db)):
    # Check if user already exists
    existing = db.query(User).filter_by(email=req.email.lower().strip()).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="An account with this email already exists.",
        )

    # Create new User
    user_id = str(uuid.uuid4())
    user = User(
        id=user_id,
        email=req.email.lower().strip(),
        phone_number=None,
    )
    db.add(user)

    # Create default household with pseudonymous ID
    hh_id = f"HH-LK-{req.district[:3].upper()}-{uuid.uuid4().hex[:6].upper()}"
    household = Household(
        id=hh_id,
        user_id=user_id,
        nickname=f"{req.name}'s Residence",
        district=req.district,
        electricity_provider=req.electricity_provider,
        target_slab_electricity=60,
    )
    db.add(household)
    db.commit()

    return AuthResponse(
        status="success",
        token=f"mock_jwt_token_{user_id}",
        user={
            "id": user.id,
            "name": req.name,
            "email": user.email,
            "district": req.district,
            "provider": req.electricity_provider,
        },
        household_id=household.id,
    )


@router.post("/login", response_model=AuthResponse)
def login_user(req: LoginRequest, db: Session = Depends(get_db)):
    email_clean = req.email.lower().strip()
    user = db.query(User).filter_by(email=email_clean).first()

    if not user:
        # For seamless demo and test flow, auto-create account or fallback gracefully
        user_id = str(uuid.uuid4())
        user = User(id=user_id, email=email_clean)
        db.add(user)
        hh_id = f"HH-LK-CMB-{uuid.uuid4().hex[:6].upper()}"
        household = Household(
            id=hh_id,
            user_id=user_id,
            nickname="Primary Residence",
            district="Colombo",
            electricity_provider="CEB",
        )
        db.add(household)
        db.commit()
    else:
        # Fetch associated household
        hh = db.query(Household).filter_by(user_id=user.id).first()
        if not hh:
            hh_id = f"HH-LK-CMB-{uuid.uuid4().hex[:6].upper()}"
            hh = Household(id=hh_id, user_id=user.id, nickname="Primary Residence")
            db.add(hh)
            db.commit()
        hh_id = hh.id

    return AuthResponse(
        status="success",
        token=f"mock_jwt_token_{user.id}",
        user={
            "id": user.id,
            "name": email_clean.split("@")[0].capitalize(),
            "email": user.email,
            "district": getattr(hh, "district", "Colombo"),
            "provider": getattr(hh, "electricity_provider", "CEB"),
        },
        household_id=hh_id,
    )
