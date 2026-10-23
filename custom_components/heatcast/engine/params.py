"""Tunable parameters and fixed limits of the control model."""

from __future__ import annotations

from dataclasses import dataclass

# Room reading is plausible only inside this range (deg C).
ROOM_TEMP_MIN = 10.0
ROOM_TEMP_MAX = 35.0
# A reading not refreshed for this long is treated as stale.
ROOM_READING_MAX_AGE_S = 3600.0
# Weighted average needs at least this share of the total weight.
ROOM_COVERAGE_MIN = 0.5

FORECAST_MAX_AGE_S = 3 * 3600.0

PROPORTIONAL_LIMIT = 3.0
INTEGRAL_LIMIT = 3.0

DEMAND_DELAY_S = 30 * 60.0

# Filter, damping and integral advance in fixed steps of this length.
STATE_STEP_MIN = 5.0


@dataclass(frozen=True, slots=True)
class Params:
    """User-tunable parameters, defaults match an underfloor system."""

    comfort_temp: float = 20.0
    eco_temp: float = 20.0

    room_rate_max: float = 0.4
    """Fastest change of a room reading passed through the filter (K/h)."""
    sensor_hold_min: float = 30.0
    """A sensor that drops out for less than this keeps its last value."""

    damping_tau_h: float = 4.0
    forecast_horizon_h: int = 4
    forecast_weight: float = 0.5
    """0 ignores the forecast, 1 uses only the forecast."""
    k_solar: float = 0.0
    """Rise of the effective outdoor temperature under full sun (K)."""
    k_wind: float = 0.0
    """Drop of the effective outdoor temperature per km/h above wind_ref (K)."""
    wind_ref: float = 15.0

    kp: float = 3.0
    ti_min: float = 250.0

    design_temp: float = 45.0
    """Flow temperature at outdoor_min."""
    outdoor_min: float = -25.0
    curve_exponent: float = 1.1
    curve_offset: float = -1.5

    summer_temp: float = 12.0
    flow_min: float = 22.0
    flow_max: float = 45.0
