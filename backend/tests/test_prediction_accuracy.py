import sys
from pathlib import Path
from datetime import date, timedelta
import pytest

backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.ml.forecaster import MLConsumptionForecaster
from app.tariff_engine.engine import TariffEngine
from app.services.cleaner import ReadingValidator


@pytest.fixture
def forecaster():
    return MLConsumptionForecaster()


@pytest.fixture
def engine():
    return TariffEngine(tariffs_dir=backend_dir / "tariffs")


def test_prediction_cycle_completion_invariant(forecaster):
    """When remaining_days is 0, projection must equal units_so_far with 0 uncertainty."""
    res = forecaster.predict_units(
        days_elapsed=30,
        units_so_far=75.4,
        remaining_days=0,
        remaining_forecast_cdd=5.0,
    )
    assert res["projected_units_likely"] == 75.4
    assert res["projected_units_low"] == 75.4
    assert res["projected_units_high"] == 75.4
    assert res["weather_driven_units"] == 0.0


def test_prediction_never_less_than_units_so_far(forecaster):
    """Monotonicity: projected units can never drop below observed cumulative consumption."""
    res = forecaster.predict_units(
        days_elapsed=20,
        units_so_far=65.0,
        remaining_days=10,
        remaining_forecast_cdd=0.0,
    )
    assert res["projected_units_likely"] >= 65.0
    assert res["projected_units_low"] >= 65.0


def test_zero_cdd_means_zero_weather_units(forecaster):
    """When weather CDD is 0, weather-driven units must be 0.0."""
    res = forecaster.predict_units(
        days_elapsed=15,
        units_so_far=45.0,
        remaining_days=15,
        remaining_forecast_cdd=0.0,
    )
    assert res["weather_driven_units"] == 0.0
    assert res["projected_units_likely"] == res["baseline_units"]


def test_early_cycle_shrinkage_stabilizes_noisy_reading(forecaster):
    """
    On day 2, if consumption is unusually high (e.g. 10 units = 5 units/day),
    having previous cycle history (e.g. 60 units = 2 units/day) dampens extreme projection.
    """
    # Without history
    res_raw = forecaster.predict_units(
        days_elapsed=2,
        units_so_far=10.0,
        remaining_days=28,
        remaining_forecast_cdd=0.0,
        previous_cycle_units=None,
    )
    # With historical anchor of 60 units
    res_anchored = forecaster.predict_units(
        days_elapsed=2,
        units_so_far=10.0,
        remaining_days=28,
        remaining_forecast_cdd=0.0,
        previous_cycle_units=60.0,
    )
    # The anchored prediction must be more conservative than raw linear extrapolation
    assert res_anchored["projected_units_likely"] < res_raw["projected_units_likely"]
    assert res_anchored["projected_units_likely"] > 60.0


def test_ceb_fractional_units_fixed_charge(engine):
    """
    Verifies that fractional consumption crossing 60 units (e.g. 60.5 kWh)
    receives the category 2 fixed charge (480 LKR) and not 0 LKR.
    """
    bill = engine.price(60.5, as_of_date=date(2023, 10, 1), utility="electricity")
    assert bill.fixed_charge == 480.0
    # First 60 units @ 42 = 2520, remaining 0.5 unit @ 42 = 21. Total energy = 2541.
    assert bill.energy_charge == 2541.0
    assert bill.total_bill == 3021.0


def test_water_domestic_18_units_calculation(engine):
    """
    Verifies water calculation across blocks:
    0-5 (5 units @ 60 = 300)
    6-10 (5 units @ 80 = 400)
    11-15 (5 units @ 100 = 500)
    16-18 (3 units @ 110 = 330)
    Energy = 1530. Fixed charge (16-20 tier) = 400. Total = 1930 LKR.
    """
    bill = engine.price(18, as_of_date=date(2023, 10, 1), utility="water", provider="NWSDB")
    assert bill.energy_charge == 1530.0
    assert bill.fixed_charge == 400.0
    assert bill.total_bill == 1930.0


def test_reading_validator_catches_meter_resets():
    """Decreasing readings must be flagged as resets and not produce negative units."""
    validator = ReadingValidator()
    seq = [
        {"date": date(2023, 10, 1), "reading": 1500.0},
        {"date": date(2023, 10, 10), "reading": 1550.0},
        {"date": date(2023, 10, 20), "reading": 1200.0},  # Meter reset/replaced
    ]
    intervals, warnings = validator.validate_and_clean_sequence(seq)
    assert len(intervals) == 2
    assert intervals[0].units_consumed == 50.0
    assert intervals[1].is_meter_reset is True
    assert intervals[1].units_consumed == 0.0
    assert len(warnings) > 0

