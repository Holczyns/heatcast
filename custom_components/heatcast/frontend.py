"""Serve the sidebar panel and the dashboard card bundled with the integration."""

from __future__ import annotations

from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.components.panel_custom import async_register_panel
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from .const import DOMAIN

WWW = Path(__file__).parent / "www"
PANEL_FILE = WWW / "heatcast-panel.js"
CARD_FILE = WWW / "heatcast-card.js"
# Must differ from the panel path, or reloading the panel page hits the folder.
URL_BASE = f"/{DOMAIN}_files"


async def async_register_frontend(hass: HomeAssistant) -> None:
    """Sidebar panel plus a card available on every dashboard without a resource entry."""
    frontend_loaded = ("frontend" in hass.config.components) and ("http" in hass.config.components)
    if not frontend_loaded:
        return
    www_exists = await hass.async_add_executor_job(WWW.is_dir)
    if not www_exists:
        return
    integration = await async_get_integration(hass, DOMAIN)
    # The version in the query string makes browsers fetch the files again after an update.
    version = f"?v={integration.version}"
    await hass.http.async_register_static_paths([StaticPathConfig(URL_BASE, str(WWW), cache_headers=True)])

    panel_exists = await hass.async_add_executor_job(PANEL_FILE.is_file)
    if panel_exists:
        await async_register_panel(
            hass,
            frontend_url_path=DOMAIN,
            webcomponent_name="heatcast-panel",
            sidebar_title="HeatCast",
            sidebar_icon="mdi:radiator",
            module_url=f"{URL_BASE}/{PANEL_FILE.name}{version}",
        )

    card_exists = await hass.async_add_executor_job(CARD_FILE.is_file)
    if card_exists:
        add_extra_js_url(hass, f"{URL_BASE}/{CARD_FILE.name}{version}")
