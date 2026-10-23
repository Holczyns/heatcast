import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { type EntryInfo, setIndividualRooms } from "./api";
import type { CurveParams } from "./curve-chart";
import "./curve-chart";
import { type HomeAssistant, fireEvent, isOn, numberState } from "./ha";
import { LANGUAGE, type Localize, type TranslationKey } from "./localize";
import { controlStyles, numberControl } from "./number-control";
import "./setup-cards";
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
        ${this.renderBoiler()}
        <heatcast-sources-card .hass=${this.hass} .entry=${this.entry} .localize=${this.localize}></heatcast-sources-card>
        ${this.renderCurve()}
        ${GROUPS.map(([title, keys]) =>
          this.renderGroup(
            title,
            keys.map((key) => this.entry.entities[key]),
            keys.map((key) => this.paramLabel(key)),
          ),
        )}
        <heatcast-rooms-card .hass=${this.hass} .entry=${this.entry} .localize=${this.localize}></heatcast-rooms-card>
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
        ${entityIds.map((entityId, index) => this.renderNumber(entityId, labels?.[index] ?? ""))}
      </section>
    `;
  }

  private renderNumber(entityId: string | undefined, label: string): TemplateResult {
    return numberControl(this.hass, entityId, label);
  }

  private paramLabel(key: string): string {
    return this.localize(`p.${key}` as TranslationKey);
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
          language=${LANGUAGE}
        ></heatcast-curve-chart>
        <p class="muted small">${this.localize("settings.curve_hint")}</p>
        ${CURVE_KEYS.map((key) => this.renderNumber(this.entry.entities[key], this.paramLabel(key)))}
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
        ${this.renderNumber(this.entry.entities.test_flow, this.paramLabel("test_flow"))}
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
    controlStyles,
    css`
      /* Columns instead of a grid: cards of different height leave no holes. */
      .grid {
        columns: 3 340px;
        column-gap: var(--hc-gap);
      }
      .grid > section {
        break-inside: avoid;
        margin-bottom: var(--hc-gap);
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
      a {
        color: var(--primary-color);
      }
    `,
  ];
}

customElements.get("heatcast-settings") ?? customElements.define("heatcast-settings", HeatCastSettings);

