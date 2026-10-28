"""
SQLAlchemy DB models for Tiered Utility Tariff Arbitrage & Disaggregation Predictor.
Supports pseudonymous household IDs, billing cycles, sparse meter readings,
predictions, alerts, and tariff versions.
"""

from datetime import datetime, date
import uuid
from typing import Optional, List
from sqlalchemy import (
    Column,
    String,
    Float,
    Integer,
    Boolean,
    DateTime,
    Date,
    ForeignKey,
    Text,
    Numeric,
    Enum,
)
from sqlalchemy.orm import declarative_base, relationship

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    email = Column(String(255), unique=True, nullable=True, index=True)
    phone_number = Column(String(50), nullable=True)  # Stored separately from telemetry
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    households = relationship("Household", back_populates="user", cascade="all, delete-orphan")


class Household(Base):
    __tablename__ = "households"

    # Pseudonymous identifier (e.g. HH-LK-XXXXX or UUID)
    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True, index=True)
    nickname = Column(String(100), default="Primary Residence")
    
    # Locality lat/lon for Open-Meteo weather matching (approximate for privacy)
    latitude = Column(Float, nullable=False, default=6.9271)  # Default: Colombo, Sri Lanka
    longitude = Column(Float, nullable=False, default=79.8612)
    district = Column(String(100), default="Colombo")
    
    electricity_provider = Column(String(50), default="CEB")  # CEB or LECO
    water_provider = Column(String(50), default="NWSDB")
    
    # Target slab warning threshold (e.g., 60, 90, 120 units)
    target_slab_electricity = Column(Integer, default=60)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    # Relationships
    user = relationship("User", back_populates="households")
    readings = relationship("MeterReading", back_populates="household", cascade="all, delete-orphan")
    billing_cycles = relationship("BillingCycle", back_populates="household", cascade="all, delete-orphan")
    predictions = relationship("Prediction", back_populates="household", cascade="all, delete-orphan")
    alerts = relationship("Alert", back_populates="household", cascade="all, delete-orphan")


class MeterReading(Base):
    __tablename__ = "meter_readings"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    household_id = Column(String(36), ForeignKey("households.id"), nullable=False, index=True)
    utility_type = Column(String(20), default="electricity", nullable=False) # electricity or water
    
    cumulative_reading = Column(Float, nullable=False)  # Raw meter number dial
    reading_date = Column(Date, nullable=False, index=True)
    
    # OCR input assist tracking
    input_source = Column(String(20), default="manual")  # manual, ocr_assisted
    ocr_confidence = Column(Float, nullable=True)
    confirmed_by_user = Column(Boolean, default=True, nullable=False) # Enforced confirmation
    
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    household = relationship("Household", back_populates="readings")


class BillingCycle(Base):
    __tablename__ = "billing_cycles"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    household_id = Column(String(36), ForeignKey("households.id"), nullable=False, index=True)
    utility_type = Column(String(20), default="electricity", nullable=False)
    
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    
    start_cumulative_reading = Column(Float, nullable=True)
    end_cumulative_reading = Column(Float, nullable=True)
    
    billed_units = Column(Float, nullable=True)  # Actual billed consumption
    billed_amount_lkr = Column(Float, nullable=True)  # Actual utility bill in LKR
    
    tariff_version_id = Column(String(100), nullable=True)
    is_settled = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    household = relationship("Household", back_populates="billing_cycles")


class TariffVersion(Base):
    __tablename__ = "tariff_versions"

    id = Column(String(100), primary_key=True)  # e.g., "ceb_domestic_2023_07"
    utility = Column(String(20), nullable=False)  # electricity or water
    provider = Column(String(50), nullable=False)  # CEB, LECO, NWSDB
    name = Column(String(255), nullable=False)
    
    effective_from = Column(Date, nullable=False)
    effective_to = Column(Date, nullable=True)
    
    verified = Column(Boolean, default=False, nullable=False)
    verification_source = Column(String(500), nullable=True)
    
    # Stored structure or raw json definition
    raw_schedule_json = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Prediction(Base):
    __tablename__ = "predictions"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    household_id = Column(String(36), ForeignKey("households.id"), nullable=False, index=True)
    utility_type = Column(String(20), default="electricity", nullable=False)
    
    cycle_start_date = Column(Date, nullable=False)
    cycle_end_date = Column(Date, nullable=False)
    as_of_date = Column(Date, nullable=False)
    days_elapsed = Column(Integer, nullable=False)
    
    # 80% Quantile interval of consumption (Units only!)
    projected_units_low = Column(Float, nullable=False)
    projected_units_likely = Column(Float, nullable=False)
    projected_units_high = Column(Float, nullable=False)
    
    # Disaggregation
    baseline_units = Column(Float, nullable=False)
    weather_driven_units = Column(Float, default=0.0)
    
    # Deterministic price conversion using Tariff Engine
    projected_bill_low_lkr = Column(Float, nullable=False)
    projected_bill_likely_lkr = Column(Float, nullable=False)
    projected_bill_high_lkr = Column(Float, nullable=False)
    
    model_version = Column(String(100), nullable=False)
    tariff_version_id = Column(String(100), nullable=False)
    tariff_verified = Column(Boolean, default=False)
    
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    household = relationship("Household", back_populates="predictions")


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    household_id = Column(String(36), ForeignKey("households.id"), nullable=False, index=True)
    utility_type = Column(String(20), default="electricity", nullable=False)
    
    alert_type = Column(String(50), default="ANTI_SLAB_WARNING")  # ANTI_SLAB_WARNING, ABNORMAL_SPIKE, METER_RESET
    slab_threshold = Column(Integer, nullable=False) # e.g. 60, 90, 120
    crossing_probability = Column(Float, nullable=False) # e.g. 0.85
    
    projected_units = Column(Float, nullable=False)
    days_remaining = Column(Integer, nullable=False)
    required_daily_reduction_units = Column(Float, nullable=False)
    potential_saving_lkr = Column(Float, nullable=False)
    
    state_status = Column(String(20), default="ACTIVE")  # ACTIVE, DISMISSED, RESOLVED
    message = Column(Text, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    household = relationship("Household", back_populates="alerts")
