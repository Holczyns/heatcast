// The small part of the Home Assistant frontend API the panel relies on.

export interface HassEntity {
  entity_id: string;
  state: string;
  attributes: Record<string, any>;
  last_changed: string;
}

export interface HomeAssistant {
  states: Record<string, HassEntity>;
  language: string;
  user?: { is_admin: boolean };
  themes?: { darkMode?: boolean };
  callService(domain: string, service: string, data?: Record<string, unknown>): Promise<unknown>;
  callWS<T>(message: Record<string, unknown>): Promise<T>;
}

export interface LovelaceCard extends HTMLElement {
  hass?: HomeAssistant;
}

interface CardHelpers {
  createCardElement(config: Record<string, unknown>): LovelaceCard;
}

declare global {
  interface Window {
    loadCardHelpers?: () => Promise<CardHelpers>;
  }
}

let helpers: Promise<CardHelpers> | undefined;

/** Native dashboard cards (history, statistics) rendered inside the panel. */
export async function createCard(config: Record<string, unknown>): Promise<LovelaceCard | undefined> {
  if (!window.loadCardHelpers) return undefined;
  helpers ??= window.loadCardHelpers();
  return (await helpers).createCardElement(config);
}

export function numberState(hass: HomeAssistant, entityId: string | undefined): number | undefined {
  if (!entityId) return undefined;
  const value = Number.parseFloat(hass.states[entityId]?.state ?? "");
  return Number.isFinite(value) ? value : undefined;
}

export function isOn(hass: HomeAssistant, entityId: string | undefined | null): boolean {
  return !!entityId && hass.states[entityId]?.state === "on";
}

export function fireEvent(node: HTMLElement, type: string, detail?: unknown): void {
  node.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
}
