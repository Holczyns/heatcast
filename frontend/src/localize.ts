const en = {
  "p.comfort_temp": "House temperature",
  "p.eco_offset": "Eco setback",
  "p.kp": "Proportional gain",
  "p.ti_min": "Integral time",
  "p.integral": "Integral",
  "p.damping_tau_h": "Building time constant",
  "p.outdoor_damped": "Damped outdoor temperature",
  "p.forecast_horizon_h": "Forecast horizon",
  "p.forecast_weight": "Forecast weight",
  "p.k_solar": "Sun gain",
  "p.k_wind": "Wind loss",
  "p.wind_ref": "Wind threshold",
  "p.room_rate_max": "Maximum rate of change",
  "p.sensor_hold_min": "Sensor dropout hold",
  "p.design_temp": "Design flow temperature",
  "p.outdoor_min": "Design outdoor temperature",
  "p.curve_exponent": "Curvature",
  "p.curve_offset": "Shift",
  "p.flow_min": "Minimum flow temperature",
  "p.flow_max": "Maximum flow temperature",
  "p.summer_temp": "Heating off above",
  "p.test_flow": "Test flow temperature",
  "history.raw": "Every change as recorded",
  "history.daily": "Daily averages",
  "stats.average": "average {h} h/day",
  "s.setpoint": "Setpoint",
  "s.measured": "Measured",
  "s.curve": "Curve",
  "s.outdoor": "Sensor",
  "s.damped": "Damped",
  "s.effective": "Effective",
  "s.house": "House",
  "s.house_target": "House setpoint",
  "s.correction": "Total",
  "s.forecast": "Forecast",
  "s.solar": "Sun",
  "s.wind": "Wind",
  "s.demand": "Demand",
  "s.control": "Boiler control",
  "s.flame": "Burner",
  "s.dhw": "Hot water",
  "tab.history": "History",
  "tab.guide": "Guide",
  "tab.home": "Home",
  "tab.settings": "Settings",
  "loading": "Loading…",
  "no_entry": "HeatCast is not set up yet. Add it under Settings → Devices & services.",
  "house": "House",
  "inside": "Inside",
  "target": "Target",
  "heating": "Heating",
  "heating_off": "Off",
  "control_on": "HeatCast controls the boiler",
  "control_off": "Shadow mode – nothing is sent to the boiler",
  "demand": "Heating demand",
  "no_demand": "No heating demand",
  "flame": "Burner on",
  "dhw": "Hot water",
  "sync": "Sync",
  "sync_hint": "All rooms follow the house",
  "individual_hint": "Each room keeps its own temperature",
  "boiler": "Boiler",
  "flow_setpoint": "Flow setpoint",
  "flow_measured": "Measured",
  "why_flow": "Where the flow temperature comes from",
  "outdoor_damped": "Damped outdoor",
  "forecast_effect": "Forecast",
  "solar": "Sun",
  "wind": "Wind",
  "outdoor_effective": "Effective outdoor",
  "curve_at": "Curve at {t}",
  "p_term": "Room correction (P)",
  "integral": "Integral (I)",
  "limited_min": "Raised to minimum",
  "limited_max": "Lowered to maximum",
  "result": "Flow setpoint",
  "summer": "Above the summer threshold – no heating",
  "weather": "Weather",
  "outdoor_now": "Outdoor now",
  "forecast": "Forecast",
  "forecast_stale": "Forecast out of date",
  "next_hours": "next {h} h",
  "cloud": "Clouds",
  "forecast_change": "Temperature change",
  "daylight": "Daylight",
  "rooms": "Rooms",
  "filtered": "Filtered",
  "weight": "Weight",
  "too_cold": "{d} K below target",
  "too_warm": "{d} K above target",
  "on_target": "On target",
  "sensor_missing": "No reading",
  "range": "Range",
  "chart.flow": "Flow temperature",
  "chart.outdoor": "Outdoor temperature",
  "chart.rooms": "Rooms",
  "chart.correction": "Room correction",
  "chart.weather": "Weather effects",
  "chart.states": "States",
  "stats.burner": "Burner hours per day",
  "stats.demand": "Hours with heating demand",
  "stats.no_flame": "Burner hours need a burner sensor in the boiler settings.",
  "stats.days": "Last {n} days",
  "stats.total": "Total {h} h",
  "settings.temperatures": "Temperatures",
  "settings.curve": "Heating curve",
  "settings.curve_hint": "Flow temperature over outdoor temperature at the current house setpoint. The dot is where the controller is now.",
  "settings.controller": "Room controller",
  "settings.weather": "Weather and forecast",
  "settings.filter": "Room sensor filter",
  "settings.rooms": "Room weights",
  "settings.features": "Features",
  "settings.individual": "Individual room temperatures",
  "settings.individual_hint": "Adds a thermostat to every room and the sync switch. With one heating circuit and no radiator valves the rooms share one compromise.",
  "settings.boiler": "Boiler",
  "settings.control": "Boiler control",
  "settings.control_hint": "While off, HeatCast only calculates. Turn off any other automation writing the boiler first.",
  "settings.control_confirm": "Send the flow setpoint to the boiler from now on?",
  "settings.confirm": "Turn on",
  "settings.cancel": "Cancel",
  "settings.test_mode": "Boiler test mode",
  "settings.test_mode_hint": "Sends the test flow temperature for up to an hour, regardless of the model.",
  "settings.entities": "Entities and devices",
  "settings.admin_only": "Only administrators can change settings.",
};


export type TranslationKey = keyof typeof en;
export type Localize = (key: TranslationKey, values?: Record<string, string | number>) => string;

/** The panel is English only; numbers are formatted the same way everywhere. */
export const LANGUAGE = "en";

export function localizer(): Localize {
  return (key, values) => {
    let text: string = en[key] ?? key;
    for (const [name, value] of Object.entries(values ?? {})) {
      text = text.replace(`{${name}}`, String(value));
    }
    return text;
  };
}

export function formatNumber(language: string, value: number | undefined, digits = 1): string {
  if (value === undefined) return "–";
  return value.toLocaleString(language, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

export function formatSigned(language: string, value: number, digits = 1): string {
  const text = formatNumber(language, Math.abs(value), digits);
  if (Math.abs(value) < 0.5 * 10 ** -digits) return text;
  return value > 0 ? `+${text}` : `−${text}`;
}
