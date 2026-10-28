import os
import sys
from pathlib import Path
import pytest
from datetime import date
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.db.models import Base, User, Household, MeterReading, BillingCycle, TariffVersion, Prediction, Alert


@pytest.fixture
def db_session():
    # In-memory SQLite for testing models
    test_engine = create_engine("sqlite:///:memory:", connect_args={"check_same_thread": False})
    Base.metadata.create_all(bind=test_engine)
    TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=test_engine)
    session = TestingSessionLocal()
    try:
        yield session
    finally:
        session.close()


def test_create_household_and_readings(db_session):
    # Create household with pseudonymous ID
    hh = Household(
        id="HH-LK-CMB-001",
        nickname="Colombo Residence",
        latitude=6.9271,
        longitude=79.8612,
        district="Colombo",
        electricity_provider="CEB",
        target_slab_electricity=60
    )
    db_session.add(hh)
    db_session.commit()

    # Add reading with confirmed_by_user = True
    reading1 = MeterReading(
        household_id=hh.id,
        utility_type="electricity",
        cumulative_reading=1420.5,
        reading_date=date(2023, 10, 1),
        input_source="manual",
        confirmed_by_user=True
    )
    db_session.add(reading1)
    db_session.commit()

    saved_hh = db_session.query(Household).filter_by(id="HH-LK-CMB-001").first()
    assert saved_hh is not None
    assert len(saved_hh.readings) == 1
    assert saved_hh.readings[0].cumulative_reading == 1420.5
    assert saved_hh.readings[0].confirmed_by_user is True


def test_create_prediction_and_alert(db_session):
    hh = Household(id="HH-LK-CMB-002", target_slab_electricity=60)
    db_session.add(hh)
    db_session.commit()

    pred = Prediction(
        household_id=hh.id,
        utility_type="electricity",
        cycle_start_date=date(2023, 10, 1),
        cycle_end_date=date(2023, 10, 31),
        as_of_date=date(2023, 10, 15),
        days_elapsed=15,
        projected_units_low=58.0,
        projected_units_likely=63.5,
        projected_units_high=70.0,
        baseline_units=60.0,
        weather_driven_units=3.5,
        projected_bill_low_lkr=1580.0,
        projected_bill_likely_lkr=3150.0,
        projected_bill_high_lkr=3450.0,
        model_version="ridge_quantile_v1",
        tariff_version_id="ceb_domestic_placeholder",
        tariff_verified=False
    )
    db_session.add(pred)

    alert = Alert(
        household_id=hh.id,
        utility_type="electricity",
        alert_type="ANTI_SLAB_WARNING",
        slab_threshold=60,
        crossing_probability=0.82,
        projected_units=63.5,
        days_remaining=16,
        required_daily_reduction_units=0.22,
        potential_saving_lkr=1422.0,
        state_status="ACTIVE",
        message="You are on track for about 64 units. Using 0.2 fewer units per day for the next 16 days keeps you in the lower block and saves Rs. 1,422."
    )
    db_session.add(alert)
    db_session.commit()

    alerts = db_session.query(Alert).filter_by(household_id=hh.id).all()
    assert len(alerts) == 1
    assert alerts[0].potential_saving_lkr == 1422.0
    assert alerts[0].required_daily_reduction_units == 0.22
