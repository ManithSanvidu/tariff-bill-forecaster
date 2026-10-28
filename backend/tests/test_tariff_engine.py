import os
import sys
from pathlib import Path
import pytest
from datetime import date

# Ensure backend directory is in path
backend_dir = Path(__file__).resolve().parent.parent
if str(backend_dir) not in sys.path:
    sys.path.insert(0, str(backend_dir))

from app.tariff_engine.engine import TariffEngine, TariffNotFoundError


@pytest.fixture
def engine():
    tariffs_dir = backend_dir / "tariffs"
    return TariffEngine(tariffs_dir=tariffs_dir)


def test_tariff_seed_loaded(engine):
    """Ensures CEB and Water seed JSON tariffs are properly discovered."""
    ceb = engine.find_tariff(utility="electricity", provider="CEB", as_of_date=date(2023, 10, 1))
    assert ceb is not None
    assert ceb["utility"] == "electricity"
    assert ceb["verified"] is False
    assert "TODO" in ceb["verification_todo"]

    water = engine.find_tariff(utility="water", provider="NWSDB", as_of_date=date(2023, 10, 1))
    assert water is not None
    assert water["utility"] == "water"
    assert water["verified"] is False


def test_missing_tariff_raises_error(engine):
    """Checks that requesting a non-existent utility or pre-effective date raises TariffNotFoundError."""
    with pytest.raises(TariffNotFoundError):
        engine.find_tariff(utility="space_solar", provider="NASA", as_of_date=date(2023, 1, 1))

    # Before effective date 2023-07-01
    with pytest.raises(TariffNotFoundError):
        engine.find_tariff(utility="electricity", provider="CEB", as_of_date=date(2020, 1, 1))


def test_ceb_boundary_30_units(engine):
    """
    Hand-calculated case for <=60 category:
    Units = 30
    Blocks: 0-30 @ 12.0 LKR/unit = 360 LKR
    Fixed charge: (0-30 units) = 180 LKR
    Expected total = 360 + 180 = 540 LKR
    """
    bill = engine.price(30, as_of_date=date(2023, 10, 1), utility="electricity")
    assert bill.energy_charge == 360.0
    assert bill.fixed_charge == 180.0
    assert bill.total_bill == 540.0
    assert bill.verified is False
    assert bill.verification_warning is not None


def test_ceb_boundary_31_units(engine):
    """
    Hand-calculated case: crossing boundary from 30 to 31 units.
    Units = 31 (Still in <= 60 category)
    Blocks:
      - 0 to 30 (30 units) @ 12.0 = 360 LKR
      - 31st unit (1 unit) @ 30.0 = 30 LKR
      Total energy = 390 LKR
    Fixed charge: (31-60 units tier) = 360 LKR
    Expected total = 390 + 360 = 750 LKR
    Jump from 30 units (540 LKR) to 31 units (750 LKR) is 210 LKR for 1 single unit!
    """
    bill = engine.price(31, as_of_date=date(2023, 10, 1), utility="electricity")
    assert bill.energy_charge == 390.0
    assert bill.fixed_charge == 360.0
    assert bill.total_bill == 750.0


def test_ceb_boundary_60_units(engine):
    """
    Hand-calculated case: 60 units (highest in <=60 tier)
    Units = 60
    Blocks:
      - 0 to 30 (30 units) @ 12 = 360 LKR
      - 31 to 60 (30 units) @ 30 = 900 LKR
      Total energy = 1260 LKR
    Fixed charge = 360 LKR
    Expected total = 1260 + 360 = 1620 LKR
    """
    bill = engine.price(60, as_of_date=date(2023, 10, 1), utility="electricity")
    assert bill.energy_charge == 1260.0
    assert bill.fixed_charge == 360.0
    assert bill.total_bill == 1620.0


def test_ceb_boundary_61_units_major_jump(engine):
    """
    Hand-calculated case: crossing category from <=60 to >60 units!
    Units = 61
    In > 60 units category:
      - First 60 units @ 42.0 = 2520 LKR
      - 61st unit (1 unit) @ 42.0 = 42 LKR
      Total energy = 2562 LKR
    Fixed charge: (61-90 tier) = 480 LKR
    Expected total = 2562 + 480 = 3042 LKR
    Notice: 60 units = 1620 LKR. 61 units = 3042 LKR.
    A single 1-unit difference increases the bill by 1422 LKR!
    This is the exact high-value Arbitrage / Anti-Slab alert case.
    """
    bill = engine.price(61, as_of_date=date(2023, 10, 1), utility="electricity")
    assert bill.energy_charge == 2562.0
    assert bill.fixed_charge == 480.0
    assert bill.total_bill == 3042.0


def test_ceb_boundary_90_units(engine):
    """
    Hand-calculated case: 90 units
    In > 60 units category:
      - First 60 units @ 42 = 2520 LKR
      - Next 30 units (61-90) @ 42 = 1260 LKR
      Total energy = 3780 LKR
    Fixed charge (61-90 tier) = 480 LKR
    Expected total = 3780 + 480 = 4260 LKR
    """
    bill = engine.price(90, as_of_date=date(2023, 10, 1), utility="electricity")
    assert bill.energy_charge == 3780.0
    assert bill.fixed_charge == 480.0
    assert bill.total_bill == 4260.0


def test_ceb_boundary_91_units(engine):
    """
    Hand-calculated case: 91 units
    In > 60 units category:
      - 0-60 (60 units) @ 42 = 2520 LKR
      - 61-90 (30 units) @ 42 = 1260 LKR
      - 91st unit (1 unit) @ 50 = 50 LKR
      Total energy = 3830 LKR
    Fixed charge (91-120 tier) = 1180 LKR (jumps from 480 to 1180 = +700 LKR fixed charge jump)
    Expected total = 3830 + 1180 = 5010 LKR
    """
    bill = engine.price(91, as_of_date=date(2023, 10, 1), utility="electricity")
    assert bill.energy_charge == 3830.0
    assert bill.fixed_charge == 1180.0
    assert bill.total_bill == 5010.0


def test_savings_and_min_reduction_calculation(engine):
    """
    Test arbitrage saving computation:
    Going from 61 units to 60 units saves 3042 - 1620 = 1422 LKR.
    """
    saving = engine.saving(units_now=61, units_reduced=1, as_of_date=date(2023, 10, 1))
    assert saving == 1422.0

    # Minimum reduction to stay below 60 slab when projected is 64 units
    reduction = engine.min_reduction_to_stay_below(projected_units=64.0, slab_threshold=60.0)
    assert reduction == 4.0

    # Already below slab
    reduction_none = engine.min_reduction_to_stay_below(projected_units=58.0, slab_threshold=60.0)
    assert reduction_none == 0.0


def test_water_domestic_calculation(engine):
    """
    Hand-calculated water schedule:
    Units: 12 m3
    Blocks:
      - 0 to 5 (5 units) @ 60 = 300 LKR
      - 6 to 10 (5 units) @ 80 = 400 LKR
      - 11 to 12 (2 units) @ 100 = 200 LKR
      Total volumetric = 900 LKR
    Fixed charge (11-15 tier): 340 LKR
    Expected total = 900 + 340 = 1240 LKR
    """
    bill = engine.price(12, as_of_date=date(2023, 10, 1), utility="water", provider="NWSDB")
    assert bill.energy_charge == 900.0
    assert bill.fixed_charge == 340.0
    assert bill.total_bill == 1240.0
    assert bill.verified is False
