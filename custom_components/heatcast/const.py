"""Constants of the HeatCast integration."""

from __future__ import annotations

from typing import Final

DOMAIN: Final = "heatcast"

# Main entry: boiler outputs
CONF_FLOW_ENTITY: Final = "flow_entity"
CONF_BLOCK_ENTITY: Final = "block_entity"
CONF_IDLE_FLOW: Final = "idle_flow"
CONF_FLOW_SENSOR: Final = "flow_sensor"
CONF_FLAME_SENSOR: Final = "flame_sensor"
CONF_DHW_SENSOR: Final = "dhw_sensor"

# Main entry: weather and schedule
CONF_OUTDOOR_SENSOR: Final = "outdoor_sensor"
CONF_WEATHER: Final = "weather"
CONF_SCHEDULE: Final = "schedule"

CONF_HEATING_TYPE: Final = "heating_type"
# Option: rooms get their own thermostats and can leave the house setpoint.
CONF_INDIVIDUAL_ROOMS: Final = "individual_rooms"
CONF_PARAMS: Final = "params"

# Room subentry
SUBENTRY_ROOM: Final = "room"
CONF_SENSOR: Final = "sensor"
CONF_WEIGHT: Final = "weight"
CONF_TARGET: Final = "target"
CONF_VALVE: Final = "valve"
CONF_VALVE_TEMPERATURE: Final = "valve_temperature"

HEATING_UNDERFLOOR: Final = "underfloor"
HEATING_RADIATORS: Final = "radiators"
HEATING_MIXED: Final = "mixed"

# Curve presets offered by the setup wizard; everything stays editable later.
CURVE_PRESETS: Final[dict[str, dict[str, float]]] = {
    HEATING_UNDERFLOOR: {
        "design_temp": 35.0,
        "outdoor_min": -20.0,
        "curve_exponent": 1.1,
        "curve_offset": 0.0,
        "flow_min": 22.0,
        "flow_max": 40.0,
        "summer_temp": 15.0,
    },
    HEATING_MIXED: {
        "design_temp": 45.0,
        "outdoor_min": -20.0,
        "curve_exponent": 1.2,
        "curve_offset": 0.0,
        "flow_min": 22.0,
        "flow_max": 50.0,
        "summer_temp": 15.0,
    },
    HEATING_RADIATORS: {
        "design_temp": 55.0,
        "outdoor_min": -20.0,
        "curve_exponent": 1.3,
        "curve_offset": 0.0,
        "flow_min": 25.0,
        "flow_max": 65.0,
        "summer_temp": 15.0,
    },
}

CURVE_KEYS: Final = (
    "design_temp",
    "outdoor_min",
    "curve_exponent",
    "curve_offset",
    "flow_min",
    "flow_max",
    "summer_temp",
)

DEFAULT_NAME: Final = "HeatCast"
DEFAULT_WEIGHT: Final = 1.0
DEFAULT_TEST_FLOW: Final = 30.0

# The boiler falls back to its own control a few minutes after the last
# write, so the setpoint is refreshed on every scan.
SCAN_SECONDS: Final = (0, 30)
STEP_MINUTES: Final = 5
FORECAST_MINUTES: Final = 30
TEST_MODE_MINUTES: Final = 60

STORAGE_VERSION: Final = 1
