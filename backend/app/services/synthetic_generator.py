"""
Synthetic Data Generator
Produces clearly labeled synthetic data (40 households x 6+ billing cycles with weekly sparse readings)
with realistic weather sensitivity (air conditioning cooling degree day correlation),
keeping it strictly separate from real user data.
"""

from datetime import date, timedelta
import json
from pathlib import Path
import random
from typing import List, Dict, Any

OUTPUT_DIR = Path(__file__).resolve().parent.parent.parent.parent / "data" / "synthetic"
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def generate_synthetic_dataset(
    num_households: int = 40,
    cycles_per_household: int = 7,
    seed: int = 42,
) -> Dict[str, Any]:
    """
    Generates synthetic electricity consumption data for Sri Lankan households.
    Clearly tags every entity with SYNTHETIC_DATA_FLAG = True.
    """
    random.seed(seed)
    districts = [
        {"district": "Colombo", "lat": 6.9271, "lon": 79.8612, "ac_penetration": 0.55},
        {"district": "Gampaha", "lat": 7.0840, "lon": 79.9942, "ac_penetration": 0.40},
        {"district": "Kandy", "lat": 7.2906, "lon": 80.6337, "ac_penetration": 0.15},
        {"district": "Galle", "lat": 6.0535, "lon": 80.2210, "ac_penetration": 0.30},
        {"district": "Jaffna", "lat": 9.6615, "lon": 80.0255, "ac_penetration": 0.45},
    ]

    households = []
    readings = []
    billing_cycles = []

    # Start date approx 7 months back
    start_anchor = date(2023, 4, 1)

    for h_idx in range(1, num_households + 1):
        loc = random.choice(districts)
        has_ac = random.random() < loc["ac_penetration"]
        # Base daily consumption without AC: 1.5 - 4.5 units/day (typical for 45-120 units/month)
        base_daily_units = random.uniform(1.6, 4.0)
        # Weather sensitivity: additional units per Cooling Degree Day above base
        weather_sensitivity = random.uniform(0.3, 0.8) if has_ac else random.uniform(0.02, 0.08)

        hh_id = f"SYNTHETIC_HH_{h_idx:03d}"
        households.append({
            "id": hh_id,
            "synthetic_flag": "SYNTHETIC_DATA_NOT_REAL",
            "district": loc["district"],
            "latitude": loc["lat"],
            "longitude": loc["lon"],
            "has_ac": has_ac,
            "base_daily_rate": round(base_daily_units, 2),
            "weather_sensitivity": round(weather_sensitivity, 2),
            "electricity_provider": "CEB",
        })

        cumulative_meter = random.uniform(1000.0, 5000.0)

        for c_idx in range(cycles_per_household):
            cycle_start = start_anchor + timedelta(days=c_idx * 30)
            cycle_end = cycle_start + timedelta(days=30)

            # Record cycle start reading
            readings.append({
                "household_id": hh_id,
                "reading_date": cycle_start.isoformat(),
                "cumulative_reading": round(cumulative_meter, 2),
                "is_synthetic": True,
                "source": "SYNTHETIC_SIMULATOR",
            })

            # Simulate 3 weekly sparse readings per cycle (day 7, day 14, day 21)
            cycle_accumulated_units = 0.0
            prev_meter = cumulative_meter

            for day_offset in [7, 14, 21, 30]:
                r_date = cycle_start + timedelta(days=day_offset)
                interval_days = 7 if day_offset < 30 else 9

                # Simulate daily weather (Sri Lanka temperature fluctuations 28-33 C)
                # Seasonal warmth peak in April-June
                month = r_date.month
                temp_boost = 2.0 if month in [4, 5, 6] else 0.5
                cdd = max(0.0, (28.0 + temp_boost + random.uniform(-1.0, 2.0)) - 24.0)

                interval_units = 0.0
                for _ in range(interval_days):
                    daily_noise = random.uniform(-0.3, 0.3)
                    day_u = max(0.5, base_daily_units + (cdd * weather_sensitivity) + daily_noise)
                    interval_units += day_u

                cumulative_meter += interval_units
                cycle_accumulated_units += interval_units

                if day_offset < 30:
                    readings.append({
                        "household_id": hh_id,
                        "reading_date": r_date.isoformat(),
                        "cumulative_reading": round(cumulative_meter, 2),
                        "is_synthetic": True,
                        "source": "SYNTHETIC_SIMULATOR",
                    })

            # Final billed reading for cycle end
            readings.append({
                "household_id": hh_id,
                "reading_date": cycle_end.isoformat(),
                "cumulative_reading": round(cumulative_meter, 2),
                "is_synthetic": True,
                "source": "SYNTHETIC_SIMULATOR",
            })

            billing_cycles.append({
                "household_id": hh_id,
                "cycle_index": c_idx + 1,
                "start_date": cycle_start.isoformat(),
                "end_date": cycle_end.isoformat(),
                "start_reading": round(prev_meter, 2),
                "end_reading": round(cumulative_meter, 2),
                "billed_units": round(cycle_accumulated_units, 2),
                "is_synthetic": True,
            })

    dataset = {
        "dataset_name": "SYNTHETIC_SRI_LANKA_HOUSEHOLDS_BENCHMARK",
        "description": "Clearly labeled synthetic electricity dataset for offline model development",
        "verified_real_data": False,
        "total_households": len(households),
        "total_readings": len(readings),
        "total_cycles": len(billing_cycles),
        "households": households,
        "readings": readings,
        "billing_cycles": billing_cycles,
    }

    out_file = OUTPUT_DIR / "synthetic_households_dataset.json"
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump(dataset, f, indent=2)

    return dataset


if __name__ == "__main__":
    data = generate_synthetic_dataset()
    print(f"Generated synthetic dataset with {data['total_households']} households and {data['total_readings']} readings.")
