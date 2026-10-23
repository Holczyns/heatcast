import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { type EntryInfo, setIndividualRooms } from "./api";
import type { CurveParams } from "./curve-chart";
import "./curve-chart";
import { type HomeAssistant, fireEvent, isOn, numberState } from "./ha";
import type { Localize, TranslationKey } from "./localize";
import { shared } from "./styles";

const GROUPS: [TranslationKey, string[]][] = [
  ["settings.temperatures", ["comfort_temp", "eco_offset"]],
  ["settings.controller", ["kp", "ti_min", "integral"]],
  [
    "settings.weather",
    ["damping_tau_h", "outdoor_damped", "forecast_horizon_h", "forecast_weight", "k_solar", "k_wind", "wind_ref"],
  ],
  ["settings.filter", ["room_rate_max", "sensor_hold_min"]],
];
const CURVE_KEYS = ["design_temp", "outdoor_min", "curve_exponent", "curve_offset", "flow_min", "flow_max", "summer_temp"];

export class HeatCastSettings extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    confirming: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  confirming = false;

  private num(key: string): number | undefined {
    return numberState(this.hass, this.entry.entities[key]);
  }

  render() {
    if (!this.hass.user?.is_admin) {
      return html`<section class="card muted">${this.localize("settings.admin_only")}</section>`;
    }
    return html`
      <div class="grid">
        ${this.renderBoiler()} ${this.renderCurve()}
        ${GROUPS.map(([title, keys]) => this.renderGroup(title, keys.map((key) => this.entry.entities[key])))}
        ${this.renderGroup(
          "settings.rooms",
          this.entry.rooms.map((room) => room.entities.weight),
          this.entry.rooms.map((room) => room.name),
        )}
        ${this.renderFeatures()}
      </div>
      <p class="small">
        <a href="/config/integrations/integration/heatcast">${this.localize("settings.entities")}</a>
      </p>
    `;
  }

  private renderGroup(title: TranslationKey, entityIds: (string | undefined)[], labels?: string[]): TemplateResult {
    return html`
      <section class="card">
        <h2>${this.localize(title)}</h2>
        ${entityIds.map((entityId, index) => (entityId ? this.renderNumber(entityId, labels?.[index]) : nothing))}
      </section>
    `;
  }

  private renderNumber(entityId: string, label?: string): TemplateResult {
    const state = this.hass.states[entityId];
    if (!state) return html``;
    const value = Number.parseFloat(state.state);
    const step = Number(state.attributes.step ?? 1);
    const min = Number(state.attributes.min ?? -Infinity);
    const max = Number(state.attributes.max ?? Infinity);
    const digits = step < 0.01 ? 3 : step < 0.1 ? 2 : step < 1 ? 1 : 0;
    const unit = state.attributes.unit_of_measurement ?? "";
    const set = (next: number) => {
      const rounded = Math.round(Math.max(Math.min(next, max), min) / step) * step;
      this.hass.callService("number", "set_value", { entity_id: entityId, value: Number(rounded.toFixed(4)) });
    };
    return html`
      <div class="number">
        <span class="label">${label ?? state.attributes.friendly_name}</span>
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

  private renderCurve(): TemplateResult {
    const values = CURVE_KEYS.map((key) => this.num(key));
    const setpoint = this.num("setpoint");
    let params: CurveParams | undefined;
    if (values.every((v) => v !== undefined) && setpoint !== undefined) {
      const [designTemp, outdoorMin, exponent, offset, flowMin, flowMax, summerTemp] = values as number[];
      params = { setpoint, designTemp, outdoorMin, exponent, offset, flowMin, flowMax, summerTemp };
    }
    return html`
      <section class="card curve">
        <h2>${this.localize("settings.curve")}</h2>
        <heatcast-curve-chart
          .params=${params}
          .outdoor=${this.num("outdoor_effective")}
          language=${this.hass.language}
        ></heatcast-curve-chart>
        <p class="muted small">${this.localize("settings.curve_hint")}</p>
        ${CURVE_KEYS.map((key) => this.renderNumber(this.entry.entities[key]))}
      </section>
    `;
  }

  private renderToggle(
    title: TranslationKey,
    hint: TranslationKey,
    on: boolean,
    onChange: (on: boolean) => void,
  ): TemplateResult {
    return html`
      <div class="toggle-row">
        <div>
          <div>${this.localize(title)}</div>
          <div class="muted small">${this.localize(hint)}</div>
        </div>
        <button class="toggle ${on ? "on" : ""}" role="switch" aria-checked=${on} @click=${() => onChange(!on)}>
          <span></span>
        </button>
      </div>
    `;
  }

  private renderBoiler(): TemplateResult {
    const control = isOn(this.hass, this.entry.entities.control);
    const testMode = isOn(this.hass, this.entry.entities.test_mode);
    const switchTo = (entityId: string, on: boolean) =>
      this.hass.callService("switch", on ? "turn_on" : "turn_off", { entity_id: entityId });
    return html`
      <section class="card">
        <h2>${this.localize("settings.boiler")}</h2>
        ${this.renderToggle("settings.control", "settings.control_hint", control, (on) => {
          if (on) {
            this.confirming = true;
            return;
          }
          switchTo(this.entry.entities.control, false);
        })}
        ${this.confirming
          ? html`<div class="confirm">
              <span>${this.localize("settings.control_confirm")}</span>
              <button class="text" @click=${() => (this.confirming = false)}>${this.localize("settings.cancel")}</button>
              <button
                class="text primary"
                @click=${() => {
                  this.confirming = false;
                  switchTo(this.entry.entities.control, true);
                }}
              >
                ${this.localize("settings.confirm")}
              </button>
            </div>`
          : nothing}
        ${this.renderToggle("settings.test_mode", "settings.test_mode_hint", testMode, (on) =>
          switchTo(this.entry.entities.test_mode, on),
        )}
        ${this.renderNumber(this.entry.entities.test_flow)}
      </section>
    `;
  }

  private renderFeatures(): TemplateResult {
    return html`
      <section class="card">
        <h2>${this.localize("settings.features")}</h2>
        ${this.renderToggle("settings.individual", "settings.individual_hint", this.entry.individual_rooms, async (on) => {
          await setIndividualRooms(this.hass, this.entry.entry_id, on);
          // The entry reloads and its entities change; the panel fetches them again.
          fireEvent(this, "heatcast-entries-changed");
        })}
      </section>
    `;
  }

  static styles = [
    shared,
    css`
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(340px, 1fr));
        gap: var(--hc-gap);
        align-items: start;
      }
      .curve {
        grid-row: span 2;
      }
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
      .stepper input {
        width: 64px;
        padding: 4px 6px;
        text-align: right;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        background: transparent;
        color: var(--primary-text-color);
        font: inherit;
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
      .toggle {
        flex: none;
        width: 44px;
        height: 24px;
        border-radius: 12px;
        border: none;
        padding: 2px;
        cursor: pointer;
        background: var(--disabled-color, #bdbdbd);
        transition: background 0.2s;
      }
      .toggle span {
        display: block;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: #fff;
        transition: transform 0.2s;
      }
      .toggle.on {
        background: var(--primary-color);
      }
      .toggle.on span {
        transform: translateX(20px);
      }
      .confirm {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        margin: 4px 0 8px;
        border-radius: 8px;
        background: color-mix(in srgb, var(--warning-color, #ffa600) 15%, transparent);
      }
      .confirm span {
        flex: 1;
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
      button.text.primary {
        color: var(--primary-color);
        font-weight: 500;
      }
      a {
        color: var(--primary-color);
      }
    `,
  ];
}

customElements.get("heatcast-settings") ?? customElements.define("heatcast-settings", HeatCastSettings);

