"""Setup wizard, entities and boiler writes inside a running Home Assistant."""

from datetime import timedelta

import pytest
from homeassistant import config_entries
from homeassistant.core import HomeAssistant
from homeassistant.data_entry_flow import FlowResultType
from homeassistant.helpers import entity_registry as er
from homeassistant.setup import async_setup_component
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import async_fire_time_changed, async_mock_service

from custom_components.heatcast.const import DOMAIN

FLOW = "input_number.boiler_flow"
BLOCK = "input_boolean.boiler_heating_off"
OUTDOOR = "sensor.outdoor"


@pytest.fixture
async def boiler(hass: HomeAssistant):
    """Stand-ins for the boiler entities and sensors."""
    await async_setup_component(
        hass,
        "input_number",
        {"input_number": {"boiler_flow": {"min": 0, "max": 90, "step": 1, "initial": 0}}},
    )
    await async_setup_component(hass, "input_boolean", {"input_boolean": {"boiler_heating_off": {"initial": False}}})
    hass.states.async_set(OUTDOOR, "5.0", {"device_class": "temperature", "unit_of_measurement": "°C"})
    hass.states.async_set("sensor.living", "21.0", {"device_class": "temperature", "unit_of_measurement": "°C"})
    hass.states.async_set("sensor.bedroom", "19.5", {"device_class": "temperature", "unit_of_measurement": "°C"})
    await hass.async_block_till_done()


async def run_wizard(hass: HomeAssistant) -> config_entries.ConfigEntry:
    result = await hass.config_entries.flow.async_init(DOMAIN, context={"source": config_entries.SOURCE_USER})
    assert result["type"] is FlowResultType.FORM
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "HeatCast", "heating_type": "mixed"}
    )
    assert result["step_id"] == "boiler"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"flow_entity": FLOW, "block_entity": BLOCK, "idle_flow": 0}
    )
    assert result["step_id"] == "climate"
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"outdoor_sensor": OUTDOOR})
    assert result["step_id"] == "curve"
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {
            "design_temp": 45,
            "outdoor_min": -25,
            "curve_exponent": 1.1,
            "curve_offset": -1.5,
            "flow_min": 22,
            "flow_max": 45,
            "summer_temp": 12,
        },
    )
    assert result["type"] is FlowResultType.MENU
    assert "| 0 |" in result["description_placeholders"]["preview"]
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "room"})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Living room", "sensor": "sensor.living", "weight": 0.5}
    )
    assert result["type"] is FlowResultType.MENU
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "room"})
    result = await hass.config_entries.flow.async_configure(
        result["flow_id"], {"name": "Bedroom", "sensor": "sensor.bedroom", "weight": 0.5}
    )
    result = await hass.config_entries.flow.async_configure(result["flow_id"], {"next_step_id": "finish"})
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    return hass.config_entries.async_entries(DOMAIN)[0]


def entity_id(hass: HomeAssistant, platform: str, unique_suffix: str) -> str:
    registry = er.async_get(hass)
    for entry in registry.entities.values():
        if (entry.platform == DOMAIN) and (entry.domain == platform) and entry.unique_id.endswith(unique_suffix):
            return entry.entity_id
    raise AssertionError(f"no {platform} entity ending with {unique_suffix}")


async def test_wizard_creates_entry_with_rooms(hass: HomeAssistant, boiler) -> None:
    entry = await run_wizard(hass)
    assert entry.title == "HeatCast"
    assert sorted(subentry.title for subentry in entry.subentries.values()) == ["Bedroom", "Living room"]
    assert entry.data["params"]["curve_offset"] == -1.5


async def test_entities_reflect_model(hass: HomeAssistant, boiler) -> None:
    await run_wizard(hass)
    climate = hass.states.get(entity_id(hass, "climate", "_thermostat"))
    # living 21.0 and bedroom 19.5 with equal weights
    assert climate.attributes["current_temperature"] == 20.2
    assert climate.attributes["temperature"] == 20.0
    curve = hass.states.get(entity_id(hass, "sensor", "_curve_flow"))
    # 20 + 25 * (15/45)^(1/1.1) - 1.5
    assert float(curve.state) == pytest.approx(27.71, abs=0.01)


async def test_shadow_mode_writes_nothing(hass: HomeAssistant, boiler) -> None:
    await run_wizard(hass)
    async_fire_time_changed(hass, dt_util.utcnow().replace(second=0) + timedelta(minutes=1))
    await hass.async_block_till_done()
    assert hass.states.get(FLOW).state == "0.0"


async def test_control_writes_flow_and_release_lifts_block(hass: HomeAssistant, boiler) -> None:
    await run_wizard(hass)
    control = entity_id(hass, "switch", "_control")
    await hass.services.async_call("switch", "turn_on", {"entity_id": control}, blocking=True)
    async_fire_time_changed(hass, dt_util.utcnow().replace(second=30) + timedelta(minutes=1))
    await hass.async_block_till_done()
    flow = float(hass.states.get(FLOW).state)
    assert 22 <= flow <= 45
    assert hass.states.get(BLOCK).state == "off"

    climate = entity_id(hass, "climate", "_thermostat")
    await hass.services.async_call(
        "climate", "set_hvac_mode", {"entity_id": climate, "hvac_mode": "off"}, blocking=True
    )
    # Demand switches off only after its 30-minute delay.
    async_fire_time_changed(hass, dt_util.utcnow() + timedelta(minutes=40))
    await hass.async_block_till_done()
    async_fire_time_changed(hass, dt_util.utcnow().replace(second=30) + timedelta(minutes=41))
    await hass.async_block_till_done()
    assert hass.states.get(BLOCK).state == "on"

    await hass.services.async_call("switch", "turn_off", {"entity_id": control}, blocking=True)
    await hass.async_block_till_done()
    assert hass.states.get(BLOCK).state == "off"


async def test_room_tuning_survives_reload(hass: HomeAssistant, boiler) -> None:
    entry = await run_wizard(hass)
    weight = entity_id(hass, "number", "_weight")
    await hass.services.async_call("number", "set_value", {"entity_id": weight, "value": 0.25}, blocking=True)
    await hass.config_entries.async_reload(entry.entry_id)
    await hass.async_block_till_done()
    assert float(hass.states.get(weight).state) == 0.25


async def test_add_room_later(hass: HomeAssistant, boiler) -> None:
    entry = await run_wizard(hass)
    hass.states.async_set("sensor.kids", "20.0", {"device_class": "temperature", "unit_of_measurement": "°C"})
    result = await hass.config_entries.subentries.async_init(
        (entry.entry_id, "room"), context={"source": config_entries.SOURCE_USER}
    )
    result = await hass.config_entries.subentries.async_configure(
        result["flow_id"], {"name": "Kids room", "sensor": "sensor.kids", "weight": 1.0}
    )
    assert result["type"] is FlowResultType.CREATE_ENTRY
    await hass.async_block_till_done()
    assert len(hass.config_entries.async_entries(DOMAIN)[0].subentries) == 3
    entity_id(hass, "sensor", "_filtered")


async def test_valve_follows_room_target_on_step(hass: HomeAssistant, boiler) -> None:
    entry = await run_wizard(hass)
    calls = async_mock_service(hass, "climate", "set_temperature")
    hass.states.async_set("climate.kids_valve", "heat", {"temperature": 17.0})
    hass.states.async_set("sensor.kids", "20.0", {"device_class": "temperature", "unit_of_measurement": "°C"})
    result = await hass.config_entries.subentries.async_init(
        (entry.entry_id, "room"), context={"source": config_entries.SOURCE_USER}
    )
    await hass.config_entries.subentries.async_configure(
        result["flow_id"],
        {"name": "Kids room", "sensor": "sensor.kids", "weight": 0.0, "valve": "climate.kids_valve"},
    )
    await hass.async_block_till_done()
    control = entity_id(hass, "switch", "_control")
    await hass.services.async_call("switch", "turn_on", {"entity_id": control}, blocking=True)

    # A 30-second scan does not touch valves, the 5-minute step does.
    base = dt_util.now().replace(second=0, microsecond=0)
    base += timedelta(minutes=5 - base.minute % 5)
    async_fire_time_changed(hass, base + timedelta(seconds=30))
    await hass.async_block_till_done()
    assert not calls

    async_fire_time_changed(hass, base + timedelta(minutes=5))
    await hass.async_block_till_done()
    assert calls[-1].data == {"entity_id": "climate.kids_valve", "temperature": 20.0}


async def enable_individual_rooms(hass: HomeAssistant, entry: config_entries.ConfigEntry) -> None:
    result = await hass.config_entries.options.async_init(entry.entry_id)
    await hass.config_entries.options.async_configure(result["flow_id"], {"individual_rooms": True})
    await hass.async_block_till_done()


async def test_room_thermostats_only_with_option(hass: HomeAssistant, boiler) -> None:
    entry = await run_wizard(hass)
    registry = er.async_get(hass)
    climates = [e for e in registry.entities.values() if (e.platform == DOMAIN) and (e.domain == "climate")]
    assert len(climates) == 1
    assert hass.states.get("climate.living_room") is None

    await enable_individual_rooms(hass, entry)
    assert hass.states.get("climate.living_room") is not None
    entity_id(hass, "switch", "_room_sync")

    result = await hass.config_entries.options.async_init(entry.entry_id)
    await hass.config_entries.options.async_configure(result["flow_id"], {"individual_rooms": False})
    await hass.async_block_till_done()
    assert hass.states.get("climate.living_room") is None


async def test_room_target_leaves_sync(hass: HomeAssistant, boiler) -> None:
    entry = await run_wizard(hass)
    await enable_individual_rooms(hass, entry)
    rooms = {subentry.title: subentry.subentry_id for subentry in entry.subentries.values()}
    living = entity_id(hass, "climate", f"{rooms['Living room']}_thermostat")
    bedroom = entity_id(hass, "climate", f"{rooms['Bedroom']}_thermostat")
    sync = entity_id(hass, "switch", "_room_sync")
    assert hass.states.get(sync).state == "on"

    await hass.services.async_call(
        "climate", "set_temperature", {"entity_id": living, "temperature": 21.5}, blocking=True
    )
    await hass.async_block_till_done()
    assert hass.states.get(sync).state == "off"
    assert hass.states.get(living).attributes["temperature"] == 21.5
    assert hass.states.get(bedroom).attributes["temperature"] == 20.0

    house = entity_id(hass, "climate", "_thermostat")
    await hass.services.async_call(
        "climate", "set_temperature", {"entity_id": house, "temperature": 19.0}, blocking=True
    )
    await hass.services.async_call("switch", "turn_on", {"entity_id": sync}, blocking=True)
    await hass.async_block_till_done()
    assert hass.states.get(living).attributes["temperature"] == 19.0


async def test_panel_api_lists_entities(hass: HomeAssistant, boiler, hass_ws_client) -> None:
    entry = await run_wizard(hass)
    client = await hass_ws_client(hass)
    await client.send_json({"id": 1, "type": "heatcast/entries"})
    response = await client.receive_json()
    assert response["success"]
    [info] = response["result"]
    assert info["entry_id"] == entry.entry_id
    assert info["entities"]["flow_setpoint"].startswith("sensor.")
    assert info["sources"]["flow_entity"] == FLOW
    assert {room["name"] for room in info["rooms"]} == {"Living room", "Bedroom"}
    assert all("weight" in room["entities"] for room in info["rooms"])

    await client.send_json(
        {"id": 2, "type": "heatcast/set_options", "entry_id": entry.entry_id, "individual_rooms": True}
    )
    assert (await client.receive_json())["success"]
    await hass.async_block_till_done()
    assert hass.states.get("climate.living_room") is not None
