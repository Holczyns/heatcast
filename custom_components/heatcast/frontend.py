"""Serve the dashboard card bundled with the integration."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import DOMAIN

CARD_FILE = Path(__file__).parent / "www" / "heatcast-card.js"
CARD_URL = f"/{DOMAIN}/heatcast-card.js"


async def async_register_card(hass: HomeAssistant) -> None:
    """Make the card available on every dashboard without a manual resource entry."""
    frontend_loaded = ("frontend" in hass.config.components) and ("http" in hass.config.components)
    if not frontend_loaded:
        return
    card_exists = await hass.async_add_executor_job(CARD_FILE.is_file)
    if not card_exists:
        return
    integration = await async_get_integration(hass, DOMAIN)
    await hass.http.async_register_static_paths([StaticPathConfig(CARD_URL, str(CARD_FILE), cache_headers=True)])
    # The version in the query string makes browsers fetch the card again after an update.
    add_extra_js_url(hass, f"{CARD_URL}?v={integration.version}")
