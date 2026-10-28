"""
Deterministic Tariff Engine (Pure Python - No ML dependencies)
Calculates utility bill breakdown, marginal costs, potential savings,
and minimum reduction needed to avoid crossing slab boundaries.
"""

from dataclasses import dataclass, field
from datetime import date, datetime
import json
from pathlib import Path
from typing import Any, Dict, List, Optional, Tuple


@dataclass(frozen=True)
class BlockBreakdown:
    from_unit: int
    to_unit: Optional[int]
    units_in_block: float
    rate_per_unit: float
    cost: float


@dataclass(frozen=True)
class BillBreakdown:
    units: float
    energy_charge: float
    fixed_charge: float
    total_bill: float
    tariff_version_id: str
    tariff_name: str
    effective_from: str
    effective_to: Optional[str]
    utility: str
    provider: str
    verified: bool
    verification_warning: Optional[str]
    blocks_breakdown: List[BlockBreakdown] = field(default_factory=list)
    marginal_rate_next_unit: float = 0.0

    def to_dict(self) -> Dict[str, Any]:
        return {
            "units": self.units,
            "energy_charge": round(self.energy_charge, 2),
            "fixed_charge": round(self.fixed_charge, 2),
            "total_bill": round(self.total_bill, 2),
            "tariff_version_id": self.tariff_version_id,
            "tariff_name": self.tariff_name,
            "effective_from": self.effective_from,
            "effective_to": self.effective_to,
            "utility": self.utility,
            "provider": self.provider,
            "verified": self.verified,
            "verification_warning": self.verification_warning,
            "marginal_rate_next_unit": round(self.marginal_rate_next_unit, 2),
            "blocks_breakdown": [
                {
                    "from_unit": b.from_unit,
                    "to_unit": b.to_unit,
                    "units_in_block": round(b.units_in_block, 2),
                    "rate_per_unit": round(b.rate_per_unit, 2),
                    "cost": round(b.cost, 2),
                }
                for b in self.blocks_breakdown
            ],
        }


class TariffNotFoundError(Exception):
    """Raised when no applicable tariff schedule is found for the given utility and date."""
    pass


class TariffEngine:
    def __init__(self, tariffs_dir: Optional[Path] = None):
        if tariffs_dir is None:
            # Check multiple potential locations (app/tariffs, backend/tariffs, or ./backend/tariffs)
            candidates = [
                Path(__file__).resolve().parent.parent / "tariffs",
                Path(__file__).resolve().parent.parent.parent / "tariffs",
                Path.cwd() / "backend" / "tariffs",
                Path.cwd() / "tariffs",
            ]
            self.tariffs_dir = next((p for p in candidates if p.exists()), candidates[0])
        else:
            self.tariffs_dir = Path(tariffs_dir)
        self._schedules: List[Dict[str, Any]] = []
        self.reload_tariffs()

    def reload_tariffs(self) -> None:
        """Loads all JSON tariff definitions from the tariffs directory."""
        self._schedules.clear()
        if not self.tariffs_dir.exists():
            return

        for filepath in self.tariffs_dir.glob("*.json"):
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    data = json.load(f)
                    self._schedules.append(data)
            except Exception as e:
                # Log or handle invalid tariff files gracefully
                print(f"Warning: Failed to load tariff file {filepath}: {e}")

    def find_tariff(
        self,
        utility: str,
        provider: Optional[str] = None,
        as_of_date: Optional[date] = None,
    ) -> Dict[str, Any]:
        """
        Picks the valid tariff version by effective date.
        Never assumes latest applies to historical cycles.
        """
        if as_of_date is None:
            as_of_date = date.today()
        elif isinstance(as_of_date, str):
            as_of_date = datetime.strptime(as_of_date, "%Y-%m-%d").date()

        candidates = []
        for t in self._schedules:
            if t.get("utility", "").lower() != utility.lower():
                continue
            if provider and t.get("provider", "").upper() != provider.upper():
                continue

            eff_from = datetime.strptime(t["effective_from"], "%Y-%m-%d").date()
            eff_to = (
                datetime.strptime(t["effective_to"], "%Y-%m-%d").date()
                if t.get("effective_to")
                else None
            )

            if eff_from <= as_of_date:
                if eff_to is None or eff_to >= as_of_date:
                    candidates.append((eff_from, t))

        if not candidates:
            raise TariffNotFoundError(
                f"No tariff schedule found for utility '{utility}' "
                f"(provider: {provider}) effective on date {as_of_date}."
            )

        # Sort by effective_from descending to pick the most specific active one
        candidates.sort(key=lambda x: x[0], reverse=True)
        return candidates[0][1]

    def _select_category_rule(
        self, tariff: Dict[str, Any], units: float
    ) -> Dict[str, Any]:
        """
        Handles systems like CEB domestic where different rules apply based on
        total consumption threshold (e.g. <= 60 units vs > 60 units).
        """
        rules = tariff.get("category_rules", [])
        if not rules:
            raise ValueError(f"Tariff {tariff.get('tariff_id')} has no category rules defined.")

        for rule in rules:
            max_units = rule.get("max_units")
            if max_units is not None and units <= max_units:
                return rule

        # Default to the rule without max_units (or highest max_units)
        return rules[-1]

    def price(
        self,
        units: float,
        as_of_date: Optional[date] = None,
        utility: str = "electricity",
        provider: Optional[str] = "CEB",
    ) -> BillBreakdown:
        """
        Computes exact bill breakdown for a given unit consumption.
        """
        if units < 0:
            units = 0.0

        tariff = self.find_tariff(utility, provider, as_of_date)
        verified = tariff.get("verified", False)
        verification_warning = (
            None
            if verified
            else tariff.get(
                "verification_todo",
                "Tariff not verified! Rates are placeholders. See https://www.pucsl.gov.lk/electricity/tariff/domestic/",
            )
        )

        rule = self._select_category_rule(tariff, units)
        blocks = rule.get("blocks", [])
        fixed_charges = rule.get("fixed_charge_by_block", [])

        # 1. Calculate Energy Charge across blocks
        energy_charge = 0.0
        breakdowns: List[BlockBreakdown] = []
        remaining_units = units

        for b in blocks:
            from_u = b["from_unit"]
            to_u = b["to_unit"]
            rate = float(b["rate"])

            # Determine the span of this block
            if to_u is not None:
                block_capacity = float(to_u - from_u + (1 if from_u > 0 else 0))
                # For 0-30: from 0 to 30 is 30 units (0 to 30 inclusive in billing terms is 30 units)
                # When from_u is 0 and to_u is 30: capacity = 30.
                if from_u == 0:
                    block_capacity = float(to_u)
                else:
                    block_capacity = float(to_u - from_u + 1)
            else:
                block_capacity = float("inf")

            if remaining_units > 0:
                units_in_this_block = min(remaining_units, block_capacity)
                block_cost = units_in_this_block * rate
                energy_charge += block_cost
                remaining_units -= units_in_this_block
                breakdowns.append(
                    BlockBreakdown(
                        from_unit=from_u,
                        to_unit=to_u,
                        units_in_block=units_in_this_block,
                        rate_per_unit=rate,
                        cost=block_cost,
                    )
                )
            else:
                breakdowns.append(
                    BlockBreakdown(
                        from_unit=from_u,
                        to_unit=to_u,
                        units_in_block=0.0,
                        rate_per_unit=rate,
                        cost=0.0,
                    )
                )

        # 2. Determine Fixed Charge based on total consumption tier
        fixed_charge = 0.0
        for fc in fixed_charges:
            fc_from = fc["from_unit"]
            fc_to = fc["to_unit"]
            if fc_to is not None:
                if fc_from <= units <= fc_to:
                    fixed_charge = float(fc["fixed_charge"])
                    break
            else:
                if units >= fc_from:
                    fixed_charge = float(fc["fixed_charge"])
                    break

        total_bill = energy_charge + fixed_charge

        # 3. Calculate Marginal Rate for the next unit (useful for arbitrage alert)
        bill_plus_one = None
        try:
            # Quick check price at units + 1
            rule_next = self._select_category_rule(tariff, units + 1.0)
            # Find which block units + 1 falls into
            marginal_rate = 0.0
            for b in rule_next.get("blocks", []):
                from_u = b["from_unit"]
                to_u = b["to_unit"]
                if to_u is not None:
                    if from_u <= units + 1.0 <= to_u:
                        marginal_rate = float(b["rate"])
                        break
                else:
                    if units + 1.0 >= from_u:
                        marginal_rate = float(b["rate"])
                        break
        except Exception:
            marginal_rate = 0.0

        return BillBreakdown(
            units=units,
            energy_charge=energy_charge,
            fixed_charge=fixed_charge,
            total_bill=total_bill,
            tariff_version_id=tariff["tariff_id"],
            tariff_name=tariff["name"],
            effective_from=tariff["effective_from"],
            effective_to=tariff.get("effective_to"),
            utility=tariff["utility"],
            provider=tariff["provider"],
            verified=verified,
            verification_warning=verification_warning,
            blocks_breakdown=breakdowns,
            marginal_rate_next_unit=marginal_rate,
        )

    def saving(
        self,
        units_now: float,
        units_reduced: float,
        as_of_date: Optional[date] = None,
        utility: str = "electricity",
        provider: Optional[str] = "CEB",
    ) -> float:
        """
        Computes the rupee saving achieved by reducing consumption by `units_reduced`.
        saving = price(units_now) - price(units_now - units_reduced)
        """
        if units_reduced <= 0:
            return 0.0
        target_units = max(0.0, units_now - units_reduced)
        bill_current = self.price(units_now, as_of_date, utility, provider).total_bill
        bill_reduced = self.price(target_units, as_of_date, utility, provider).total_bill
        return max(0.0, bill_current - bill_reduced)

    def min_reduction_to_stay_below(
        self,
        projected_units: float,
        slab_threshold: float,
    ) -> float:
        """
        Returns minimum units to cut to stay at or below the slab threshold.
        """
        if projected_units <= slab_threshold:
            return 0.0
        return projected_units - slab_threshold
