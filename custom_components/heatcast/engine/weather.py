"""Outdoor temperature: damping, forecast summary and effective temperature."""

from __future__ import annotations

from dataclasses import dataclass
from datetime import datetime, timedelta

from .params import FORECAST_MAX_AGE_S, Params


@dataclass(frozen=True, slots=True)
class ForecastHour:
    start: datetime
    temperature: float | None = None
    cloud_coverage: float | None = None
    wind_speed: float | None = None


@dataclass(frozen=True, slots=True)
class ForecastSummary:
    """Averages over the forecast horizon."""

    delta: float
    """Mean temperature over the horizon minus the current hour (K)."""
    cloud: float
    """Mean cloud coverage (%)."""
    wind: float
    """Mean wind speed (km/h)."""
    daylight: float
    """Share of horizon hours whose middle falls between sunrise and sunset."""
    updated: datetime


@dataclass(frozen=True, slots=True)
class OutdoorSummary:
    switch: float
    """Damped temperature blended with the forecast, used for the summer cut-off."""
    solar: float
    wind: float
    effective: float
    """Temperature the heating curve is evaluated at."""
    forecast_effect: float


def damp(damped: float | None, outdoor: float | None, step_min: float, tau_h: float) -> float | None:
    """First-order lag of the outdoor temperature; holds while the sensor is missing."""
    if outdoor is None:
        return damped
    if damped is None:
        return round(outdoor, 2)
    return round(damped + (outdoor - damped) * step_min / (tau_h * 60.0), 2)


def summarize_forecast(
    hours: list[ForecastHour],
    now: datetime,
    horizon_h: int,
    next_rising: datetime,
    next_setting: datetime,
) -> ForecastSummary | None:
    """Average the first horizon_h hours starting with the current one."""
    hour_start = now.replace(minute=0, second=0, microsecond=0)
    window = [hour for hour in hours if hour.start >= hour_start][:horizon_h]
    if not window:
        return None

    count = len(window)
    temps = [hour.temperature if hour.temperature is not None else 0.0 for hour in window]
    clouds = [hour.cloud_coverage if hour.cloud_coverage is not None else 100.0 for hour in window]
    winds = [hour.wind_speed if hour.wind_speed is not None else 0.0 for hour in window]

    # Sun is up now when it sets before it next rises.
    sun_up_now = next_setting < next_rising
    day_hours = 0
    for hour in window:
        middle = hour.start + timedelta(minutes=30)
        is_day = next_rising <= middle < next_setting
        if sun_up_now:
            is_day = (middle < next_setting) or (middle >= next_rising)
        if is_day:
            day_hours += 1

    return ForecastSummary(
        delta=round(sum(temps) / count - temps[0], 1),
        cloud=round(sum(clouds) / count, 0),
        wind=round(sum(winds) / count, 1),
        daylight=round(day_hours / count, 2),
        updated=now,
    )


def forecast_is_valid(forecast: ForecastSummary | None, now: datetime) -> bool:
    if forecast is None:
        return False
    return (now - forecast.updated).total_seconds() < FORECAST_MAX_AGE_S


def summarize_outdoor(
    damped: float | None,
    outdoor: float | None,
    forecast: ForecastSummary | None,
    now: datetime,
    params: Params,
) -> OutdoorSummary | None:
    """Blend damped temperature with the forecast and add sun and wind corrections."""
    if damped is None:
        return None

    outdoor_now = outdoor if outdoor is not None else damped
    switch = damped
    solar = 0.0
    wind = 0.0
    if forecast_is_valid(forecast, now):
        alpha = params.forecast_weight
        switch = (1 - alpha) * damped + alpha * (outdoor_now + forecast.delta)
        solar_potential = (1 - forecast.cloud / 100) * forecast.daylight
        solar = params.k_solar * solar_potential
        wind = params.k_wind * max(forecast.wind - params.wind_ref, 0.0)

    switch = round(switch, 2)
    solar = round(solar, 2)
    wind = round(wind, 2)
    return OutdoorSummary(
        switch=switch,
        solar=solar,
        wind=wind,
        effective=round(switch + solar - wind, 2),
        forecast_effect=round(switch - damped, 2),
    )
