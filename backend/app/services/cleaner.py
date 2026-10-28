"""
Meter Reading Validation and Cleaning Service.
Rules:
- Validates chronological order.
- Detects decreasing cumulative readings (flags meter reset/replacement instead of silent acceptance).
- Flags implausible jumps (e.g. >100 units/day for domestic).
- Handles variable billing-cycle lengths.
- Never imputes observed consumption silently.
"""

from dataclasses import dataclass
from datetime import date
from typing import List, Optional, Tuple, Dict, Any


class ReadingValidationError(Exception):
    pass


@dataclass
class ValidatedInterval:
    start_date: date
    end_date: date
    days: int
    units_consumed: float
    daily_run_rate: float
    start_reading: float
    end_reading: float
    is_meter_reset: bool = False
    warning: Optional[str] = None


class ReadingValidator:
    def __init__(self, max_daily_units_threshold: float = 60.0):
        self.max_daily_units_threshold = max_daily_units_threshold

    def validate_and_clean_sequence(
        self,
        readings: List[Dict[str, Any]],  # Expects list of {"date": date, "reading": float, "id": optional}
    ) -> Tuple[List[ValidatedInterval], List[str]]:
        """
        Takes raw cumulative meter readings and produces clean consumption intervals.
        Readings must be sorted chronologically.
        """
        if len(readings) < 2:
            return [], ["At least two readings are required to calculate consumption intervals."]

        sorted_readings = sorted(readings, key=lambda r: r["date"])
        warnings: List[str] = []
        intervals: List[ValidatedInterval] = []

        # Check for duplicate dates
        seen_dates = set()
        unique_readings = []
        for r in sorted_readings:
            if r["date"] in seen_dates:
                warnings.append(f"Duplicate reading found for date {r['date']}. Keeping latest entry.")
                continue
            seen_dates.add(r["date"])
            unique_readings.append(r)

        for i in range(len(unique_readings) - 1):
            prev = unique_readings[i]
            curr = unique_readings[i + 1]

            d_days = (curr["date"] - prev["date"]).days
            if d_days <= 0:
                continue

            r_prev = float(prev["reading"])
            r_curr = float(curr["reading"])

            # Check for decreasing reading
            if r_curr < r_prev:
                # Flag meter reset / rollover / replacement
                warning_msg = (
                    f"Meter reset or rollover detected between {prev['date']} ({r_prev}) "
                    f"and {curr['date']} ({r_curr}). Requires verification; not silently imputed."
                )
                warnings.append(warning_msg)
                # We do NOT invent units for reset intervals
                intervals.append(
                    ValidatedInterval(
                        start_date=prev["date"],
                        end_date=curr["date"],
                        days=d_days,
                        units_consumed=0.0,
                        daily_run_rate=0.0,
                        start_reading=r_prev,
                        end_reading=r_curr,
                        is_meter_reset=True,
                        warning=warning_msg,
                    )
                )
                continue

            units = r_curr - r_prev
            daily_rate = units / d_days

            interval_warn = None
            if daily_rate > self.max_daily_units_threshold:
                interval_warn = (
                    f"Implausible jump detected: {daily_rate:.1f} units/day between "
                    f"{prev['date']} and {curr['date']} exceeds threshold ({self.max_daily_units_threshold})."
                )
                warnings.append(interval_warn)

            intervals.append(
                ValidatedInterval(
                    start_date=prev["date"],
                    end_date=curr["date"],
                    days=d_days,
                    units_consumed=units,
                    daily_run_rate=daily_rate,
                    start_reading=r_prev,
                    end_reading=r_curr,
                    is_meter_reset=False,
                    warning=interval_warn,
                )
            )

        return intervals, warnings
