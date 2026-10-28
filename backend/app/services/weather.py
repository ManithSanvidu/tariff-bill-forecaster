"""
Open-Meteo API Client
Fetches historical and forecast weather variables:
- Daily mean and max temperature (Celsius)
- Daily precipitation sum (mm)
- Cooling Degree Days (CDD, base 24°C standard for tropical cooling / AC usage)
Includes SQLite/in-memory disk caching and graceful fallback.
"""

from datetime import date, datetime, timedelta
import json
import logging
import sqlite3
from pathlib import Path
from typing import Dict, List, Optional, Tuple, Any
import requests

logger = logging.getLogger(__name__)

CACHE_DB_PATH = Path(__file__).resolve().parent.parent.parent.parent / "data" / "weather_cache.sqlite"
CACHE_DB_PATH.parent.mkdir(parents=True, exist_ok=True)


def init_weather_cache():
    conn = sqlite3.connect(str(CACHE_DB_PATH))
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS daily_weather (
            lat REAL,
            lon REAL,
            date TEXT,
            temp_mean REAL,
            temp_max REAL,
            precip_sum REAL,
            cdd REAL,
            is_forecast INTEGER,
            updated_at TEXT,
            PRIMARY KEY (lat, lon, date)
        )
    """)
    conn.commit()
    conn.close()


init_weather_cache()


class OpenMeteoClient:
    def __init__(
        self,
        archive_url: str = "https://archive-api.open-meteo.com/v1/archive",
        forecast_url: str = "https://api.open-meteo.com/v1/forecast",
        timeout: int = 10,
        cdd_base_temp: float = 24.0,  # Base threshold for cooling degree days
    ):
        self.archive_url = archive_url
        self.forecast_url = forecast_url
        self.timeout = timeout
        self.cdd_base_temp = cdd_base_temp

    def _get_cached_days(
        self, lat: float, lon: float, start_date: str, end_date: str
    ) -> Dict[str, Dict[str, Any]]:
        conn = sqlite3.connect(str(CACHE_DB_PATH))
        cursor = conn.cursor()
        cursor.execute(
            """
            SELECT date, temp_mean, temp_max, precip_sum, cdd, is_forecast
            FROM daily_weather
            WHERE round(lat, 2) = round(?, 2) AND round(lon, 2) = round(?, 2)
            AND date >= ? AND date <= ?
            """,
            (lat, lon, start_date, end_date),
        )
        rows = cursor.fetchall()
        conn.close()
        return {
            row[0]: {
                "date": row[0],
                "temp_mean": row[1],
                "temp_max": row[2],
                "precip_sum": row[3],
                "cdd": row[4],
                "is_forecast": bool(row[5]),
            }
            for row in rows
        }

    def _save_cache_days(self, lat: float, lon: float, records: List[Dict[str, Any]]) -> None:
        if not records:
            return
        conn = sqlite3.connect(str(CACHE_DB_PATH))
        cursor = conn.cursor()
        now_str = datetime.utcnow().isoformat()
        cursor.executemany(
            """
            INSERT OR REPLACE INTO daily_weather
            (lat, lon, date, temp_mean, temp_max, precip_sum, cdd, is_forecast, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            """,
            [
                (
                    lat,
                    lon,
                    r["date"],
                    r["temp_mean"],
                    r["temp_max"],
                    r["precip_sum"],
                    r["cdd"],
                    1 if r.get("is_forecast") else 0,
                    now_str,
                )
                for r in records
            ],
        )
        conn.commit()
        conn.close()

    def get_weather_for_range(
        self,
        lat: float,
        lon: float,
        start_date: date,
        end_date: date,
    ) -> List[Dict[str, Any]]:
        """
        Retrieves daily weather for a given date range. Uses cached data where possible,
        and queries Open-Meteo Archive (for past dates) and Forecast (for current/future dates).
        Returns gracefully with synthetic/seasonal defaults if the network fails.
        """
        start_str = start_date.isoformat()
        end_str = end_date.isoformat()
        cached = self._get_cached_days(lat, lon, start_str, end_str)

        all_dates = []
        curr = start_date
        while curr <= end_date:
            all_dates.append(curr)
            curr += timedelta(days=1)

        missing_dates = [d for d in all_dates if d.isoformat() not in cached]
        today = date.today()

        if missing_dates:
            try:
                # Query historical archive for dates older than today
                hist_dates = [d for d in missing_dates if d < today]
                forecast_dates = [d for d in missing_dates if d >= today]
                new_records = []

                if hist_dates:
                    h_start = min(hist_dates).isoformat()
                    h_end = min(max(hist_dates), today - timedelta(days=1)).isoformat()
                    params = {
                        "latitude": lat,
                        "longitude": lon,
                        "start_date": h_start,
                        "end_date": h_end,
                        "daily": ["temperature_2m_mean", "temperature_2m_max", "precipitation_sum"],
                        "timezone": "auto",
                    }
                    res = requests.get(self.archive_url, params=params, timeout=self.timeout)
                    if res.status_code == 200:
                        data = res.json().get("daily", {})
                        dates = data.get("time", [])
                        t_means = data.get("temperature_2m_mean", [])
                        t_maxs = data.get("temperature_2m_max", [])
                        precips = data.get("precipitation_sum", [])
                        for i, d_str in enumerate(dates):
                            tm = t_means[i] if i < len(t_means) and t_means[i] is not None else 28.0
                            tx = t_maxs[i] if i < len(t_maxs) and t_maxs[i] is not None else 31.0
                            pr = precips[i] if i < len(precips) and precips[i] is not None else 0.0
                            cdd = max(0.0, tm - self.cdd_base_temp)
                            rec = {
                                "date": d_str,
                                "temp_mean": tm,
                                "temp_max": tx,
                                "precip_sum": pr,
                                "cdd": cdd,
                                "is_forecast": False,
                            }
                            new_records.append(rec)
                            cached[d_str] = rec

                if forecast_dates:
                    # Query forecast API
                    params = {
                        "latitude": lat,
                        "longitude": lon,
                        "daily": ["temperature_2m_mean", "temperature_2m_max", "precipitation_sum"],
                        "timezone": "auto",
                        "forecast_days": 14,
                    }
                    res = requests.get(self.forecast_url, params=params, timeout=self.timeout)
                    if res.status_code == 200:
                        data = res.json().get("daily", {})
                        dates = data.get("time", [])
                        t_means = data.get("temperature_2m_mean", [])
                        t_maxs = data.get("temperature_2m_max", [])
                        precips = data.get("precipitation_sum", [])
                        for i, d_str in enumerate(dates):
                            if d_str in [d.isoformat() for d in forecast_dates]:
                                tm = t_means[i] if i < len(t_means) and t_means[i] is not None else 28.5
                                tx = t_maxs[i] if i < len(t_maxs) and t_maxs[i] is not None else 31.5
                                pr = precips[i] if i < len(precips) and precips[i] is not None else 1.0
                                cdd = max(0.0, tm - self.cdd_base_temp)
                                rec = {
                                    "date": d_str,
                                    "temp_mean": tm,
                                    "temp_max": tx,
                                    "precip_sum": pr,
                                    "cdd": cdd,
                                    "is_forecast": True,
                                }
                                new_records.append(rec)
                                cached[d_str] = rec

                if new_records:
                    self._save_cache_days(lat, lon, new_records)

            except Exception as e:
                logger.warning(f"Weather API request failed, falling back to seasonal estimates: {e}")

        # Assemble complete list with fallback for any remaining missing dates
        results = []
        for d in all_dates:
            d_str = d.isoformat()
            if d_str in cached:
                results.append(cached[d_str])
            else:
                # Typical tropical Sri Lankan weather default: 28.5 C mean, 31.5 C max, 1.5mm rain
                tm = 28.5
                cdd = max(0.0, tm - self.cdd_base_temp)
                results.append({
                    "date": d_str,
                    "temp_mean": tm,
                    "temp_max": 31.5,
                    "precip_sum": 1.5,
                    "cdd": cdd,
                    "is_forecast": d >= today,
                })

        return results
