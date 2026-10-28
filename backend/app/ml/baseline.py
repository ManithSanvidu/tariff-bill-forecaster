"""
Baseline Forecaster Models
Implements three deterministic reference baselines:
1. Run-Rate Baseline: projected_units = (units_to_date / days_elapsed) * cycle_days
2. Previous Cycle Baseline: projected_units = last_cycle_billed_units
3. Same Month Last Year Baseline: projected_units = year_ago_billed_units (or fallback)
"""

from typing import Dict, Any, Optional


class BaselineForecaster:
    @staticmethod
    def run_rate_projection(
        units_to_date: float,
        days_elapsed: int,
        cycle_total_days: int = 30,
    ) -> float:
        """
        Extrapolates linear daily run-rate across the remaining days of the cycle.
        """
        if days_elapsed <= 0:
            return 0.0
        daily_rate = units_to_date / float(days_elapsed)
        return round(daily_rate * float(cycle_total_days), 2)

    @staticmethod
    def previous_cycle_projection(previous_cycle_units: Optional[float]) -> Optional[float]:
        if previous_cycle_units is not None and previous_cycle_units > 0:
            return round(previous_cycle_units, 2)
        return None

    @staticmethod
    def same_month_last_year_projection(year_ago_units: Optional[float]) -> Optional[float]:
        if year_ago_units is not None and year_ago_units > 0:
            return round(year_ago_units, 2)
        return None

    @classmethod
    def get_all_baselines(
        cls,
        units_to_date: float,
        days_elapsed: int,
        cycle_total_days: int = 30,
        previous_cycle_units: Optional[float] = None,
        year_ago_units: Optional[float] = None,
    ) -> Dict[str, Any]:
        rr = cls.run_rate_projection(units_to_date, days_elapsed, cycle_total_days)
        prev = cls.previous_cycle_projection(previous_cycle_units)
        yago = cls.same_month_last_year_projection(year_ago_units)

        return {
            "run_rate": rr,
            "previous_cycle": prev,
            "same_month_last_year": yago,
            "recommended_baseline": rr,
        }
