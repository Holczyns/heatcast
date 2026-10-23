import { css, html, type TemplateResult } from "lit";
import type { HomeAssistant } from "./ha";

/** Stepper bound to a number entity; range and step come from the entity itself. */
export function numberControl(hass: HomeAssistant, entityId: string | undefined, label: string): TemplateResult {
  const state = entityId ? hass.states[entityId] : undefined;
  if (!state) return html``;
  const value = Number.parseFloat(state.state);
  const step = Number(state.attributes.step ?? 1);
  const min = Number(state.attributes.min ?? -Infinity);
  const max = Number(state.attributes.max ?? Infinity);
  const digits = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0;
  const unit = state.attributes.unit_of_measurement ?? "";
  const set = (next: number) => {
    if (!Number.isFinite(next)) return;
    const rounded = Math.round(Math.max(Math.min(next, max), min) / step) * step;
    hass.callService("number", "set_value", { entity_id: entityId, value: Number(rounded.toFixed(4)) });
  };
  return html`
    <div class="number">
      <span class="label">${label}</span>
      <span class="stepper">
        <button class="round mini" ?disabled=${value <= min} @click=${() => set(value - step)}>−</button>
        <input
          type="number"
          .value=${Number.isFinite(value) ? value.toFixed(digits) : ""}
          step=${step}
          min=${min}
          max=${max}
          @change=${(event: Event) => set(Number.parseFloat((event.target as HTMLInputElement).value))}
        />
        <button class="round mini" ?disabled=${value >= max} @click=${() => set(value + step)}>+</button>
        <span class="unit">${unit}</span>
      </span>
    </div>
  `;
}

export const controlStyles = css`
  .number,
  .toggle-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 6px 0;
  }
  .label {
    flex: 1;
    min-width: 0;
  }
  .stepper {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .stepper input,
  input.text {
    padding: 4px 6px;
    border: 1px solid var(--divider-color);
    border-radius: 6px;
    background: transparent;
    color: var(--primary-text-color);
    font: inherit;
  }
  .stepper input {
    width: 64px;
    text-align: right;
    -moz-appearance: textfield;
  }
  .stepper input::-webkit-outer-spin-button,
  .stepper input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  .unit {
    width: 56px;
    font-size: 0.8rem;
    color: var(--hc-muted);
  }
  .round.mini {
    width: 28px;
    height: 28px;
    font-size: 1rem;
  }
  button.text {
    border: none;
    background: transparent;
    color: var(--primary-text-color);
    padding: 6px 10px;
    border-radius: 6px;
    cursor: pointer;
    font: inherit;
  }
  button.text:hover {
    background: var(--secondary-background-color);
  }
  button.text.primary {
    color: var(--primary-color);
    font-weight: 500;
  }
  button.text.danger {
    color: var(--error-color, #db4437);
  }
  .actions {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-end;
    gap: 4px;
    margin-top: 8px;
  }
  .error {
    color: var(--error-color, #db4437);
    font-size: 0.85rem;
    margin-top: 6px;
  }
  .field {
    display: grid;
    gap: 4px;
    margin-bottom: 10px;
  }
  .field label {
    font-size: 0.85rem;
    color: var(--hc-muted);
  }
`;
