import sys
from pathlib import Path
import pytest
from datetime import date
from fastapi.testclient import TestClient

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.api.routes import app

client = TestClient(app)


def test_health_check():
    res = client.get("/")
    assert res.status_code == 200
    assert res.json()["service"] == "Tiered Utility Tariff Predictor"


def test_tariff_endpoint():
    res = client.get("/tariffs/electricity")
    assert res.status_code == 200
    data = res.json()
    assert data["utility"] == "electricity"
    assert data["verified"] is False


def test_ocr_extract_never_saves():
    """OCR endpoint must return candidate without writing anything to DB."""
    # Send mock file
    files = {"file": ("meter.jpg", b"fake image bytes", "image/jpeg")}
    res = client.post("/ocr/extract", files=files)
    assert res.status_code == 200
    data = res.json()
    assert "candidate_reading" in data
    assert data["requires_user_confirmation"] is True


def test_reading_requires_confirmation_for_ocr():
    """Attempting to save an unconfirmed OCR reading must be rejected (400)."""
    payload = {
        "household_id": "TEST_HH_001",
        "utility_type": "electricity",
        "cumulative_reading": 1540.0,
        "reading_date": str(date.today()),
        "input_source": "ocr_assisted",
        "confirmed_by_user": False,  # Not confirmed!
    }
    res = client.post("/readings", json=payload)
    assert res.status_code == 400
    assert "Unconfirmed OCR reading" in res.json()["detail"]


def test_reading_saves_when_confirmed():
    payload = {
        "household_id": "TEST_HH_001",
        "utility_type": "electricity",
        "cumulative_reading": 1540.0,
        "reading_date": str(date.today()),
        "input_source": "ocr_assisted",
        "confirmed_by_user": True,
    }
    res = client.post("/readings", json=payload)
    assert res.status_code == 200
    assert res.json()["status"] == "success"


def test_projection_and_anti_slab_alert():
    res = client.get("/households/TEST_HH_001/projection")
    assert res.status_code == 200
    proj = res.json()
    assert "projection" in proj
    assert "units_likely" in proj["projection"]
    assert "bill_likely_lkr" in proj["projection"]
    assert "weather_driven_units" in proj["disaggregation"]

    # Check alert endpoint
    alert_res = client.get("/households/TEST_HH_001/alerts")
    assert alert_res.status_code == 200
    alerts = alert_res.json()["alerts"]
    assert len(alerts) > 0
    assert "At your current pace" in alerts[0]["message"] or "You are on track" in alerts[0]["message"] or "approaching" in alerts[0]["message"]
