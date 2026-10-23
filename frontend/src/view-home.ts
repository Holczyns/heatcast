import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import type { EntryInfo, RoomInfo } from "./api";
import { type HomeAssistant, isOn, numberState } from "./ha";
import { type Localize, formatNumber, formatSigned } from "./localize";
import { shared } from "./styles";

const TARGET_STEP = 0.5;

export class HeatCastHome extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;

  private num(key: string): number | undefined {
    return numberState(this.hass, this.entry.entities[key]);
  }

  private fmt(value: number | undefined, digits = 1): string {
    return formatNumber(this.hass.language, value, digits);
  }

  render() {
    return html`
      <div class="grid">
        ${this.renderHouse()} ${this.renderBoiler()} ${this.renderWeather()}
        <section class="card rooms">
          <h2><ha-icon icon="mdi:floor-plan"></ha-icon>${this.localize("rooms")}</h2>
          <div class="room-grid">${this.entry.rooms.map((room) => this.renderRoom(room))}</div>
        </section>
      </div>
    `;
  }

  private renderHouse(): TemplateResult {
    const t = this.localize;
    const climateId = this.entry.entities.thermostat;
    const climate = this.hass.states[climateId];
    const current = climate?.attributes.current_temperature as number | undefined;
    const target = climate?.attributes.temperature as number | undefined;
    const heatingOn = climate?.state === "heat";
    const control = isOn(this.hass, this.entry.entities.control);
    const demand = isOn(this.hass, this.entry.entities.demand);
    const flame = isOn(this.hass, this.entry.sources.flame_sensor);
    const dhw = isOn(this.hass, this.entry.sources.dhw_sensor);
    const syncId = this.entry.entities.room_sync;

    return html`
      <section class="card house">
        <div class="house-head">
          <h2><ha-icon icon="mdi:home-thermometer"></ha-icon>${t("house")}</h2>
          <button
            class="power ${heatingOn ? "on" : ""}"
            title=${heatingOn ? t("heating") : t("heating_off")}
            @click=${() => this.setHvacMode(climateId, heatingOn ? "off" : "heat")}
          >
            <ha-icon icon="mdi:power"></ha-icon>
          </button>
        </div>
        <div class="dial">
          <div class="current">
            <span class="big">${this.fmt(current)}</span><span class="unit">°C</span>
            <div class="muted small">${t("inside")}</div>
          </div>
          <div class="setpoint">
            <button class="round" ?disabled=${!heatingOn} @click=${() => this.setTarget(climateId, target, -TARGET_STEP)}>−</button>
            <div>
              <div class="target ${heatingOn ? "" : "muted"}">${this.fmt(target)} °C</div>
              <div class="muted small">${heatingOn ? t("target") : t("heating_off")}</div>
            </div>
            <button class="round" ?disabled=${!heatingOn} @click=${() => this.setTarget(climateId, target, TARGET_STEP)}>+</button>
          </div>
        </div>
        <div class="chips">
          <span class="chip ${control ? "ok" : ""}">
            <ha-icon icon=${control ? "mdi:water-boiler" : "mdi:water-boiler-off"}></ha-icon>${control ? t("control_on") : t("control_off")}
          </span>
          <span class="chip ${demand ? "heat" : ""}">${demand ? t("demand") : t("no_demand")}</span>
          ${flame ? html`<span class="chip heat"><ha-icon class="flame" icon="mdi:fire"></ha-icon>${t("flame")}</span>` : nothing}
          ${dhw ? html`<span class="chip cold"><ha-icon icon="mdi:water-pump"></ha-icon>${t("dhw")}</span>` : nothing}
        </div>
        ${syncId ? this.renderSync(syncId) : nothing}
      </section>
    `;
  }

  private renderSync(syncId: string): TemplateResult {
    const synced = isOn(this.hass, syncId);
    return html`
      <div class="sync">
        <button class="sync-button ${synced ? "on" : ""}" @click=${() => this.toggle(syncId, synced)}>SYNC</button>
        <span class="muted small">${synced ? this.localize("sync_hint") : this.localize("individual_hint")}</span>
      </div>
    `;
  }

  private renderBoiler(): TemplateResult {
    const t = this.localize;
    const flow = this.num("flow_setpoint");
    const measured = numberState(this.hass, this.entry.sources.flow_sensor ?? undefined);
    return html`
      <section class="card boiler">
        <h2><ha-icon icon="mdi:water-boiler"></ha-icon>${t("boiler")}</h2>
        <div class="flow">
          <div>
            <span class="big">${this.fmt(flow, 0)}</span><span class="unit">°C</span>
            <div class="muted small">${t("flow_setpoint")}</div>
          </div>
          ${measured !== undefined
            ? html`<div class="measured">
                <span class="mid">${this.fmt(measured)} °C</span>
                <div class="muted small">${t("flow_measured")}</div>
              </div>`
            : nothing}
        </div>
        <h3 class="muted small">${t("why_flow")}</h3>
        ${this.renderBreakdown()}
      </section>
    `;
  }

  private renderBreakdown(): TemplateResult {
    const t = this.localize;
    const lang = this.hass.language;
    const demand = isOn(this.hass, this.entry.entities.demand);
    const damped = this.num("outdoor_damped");
    const effective = this.num("outdoor_effective");
    const curve = this.num("curve_flow");
    const p = this.num("proportional");
    const integral = this.num("integral");
    const flowMin = this.num("flow_min");
    const flowMax = this.num("flow_max");
    const flow = this.num("flow_setpoint");

    const delta = (label: string, value: number | undefined) =>
      value === undefined
        ? nothing
        : html`<div class="row">
            <span>${label}</span>
            <span class="bar"><span class=${value >= 0 ? "pos" : "neg"} style="width:${Math.min(Math.abs(value) * 16, 100)}%"></span></span>
            <span class="value">${formatSigned(lang, value)} K</span>
          </div>`;

    const raw = curve !== undefined ? curve + (p ?? 0) + (integral ?? 0) : undefined;
    let limit: TemplateResult | typeof nothing = nothing;
    if (raw !== undefined && flowMin !== undefined && raw < flowMin) {
      limit = html`<div class="row note"><span>${t("limited_min")}</span><span></span><span class="value">${this.fmt(flowMin, 0)} °C</span></div>`;
    }
    if (raw !== undefined && flowMax !== undefined && raw > flowMax) {
      limit = html`<div class="row note"><span>${t("limited_max")}</span><span></span><span class="value">${this.fmt(flowMax, 0)} °C</span></div>`;
    }

    return html`
      <div class="breakdown">
        <div class="row"><span>${t("outdoor_damped")}</span><span></span><span class="value">${this.fmt(damped)} °C</span></div>
        ${delta(t("forecast_effect"), this.num("forecast_effect"))} ${delta(t("solar"), this.num("solar_correction"))}
        ${delta(t("wind"), (this.num("wind_correction") ?? 0) === 0 ? undefined : -(this.num("wind_correction") ?? 0))}
        <div class="row total"><span>${t("outdoor_effective")}</span><span></span><span class="value">${this.fmt(effective)} °C</span></div>
        <div class="row">
          <span>${t("curve_at", { t: `${this.fmt(effective)} °C` })}</span><span></span><span class="value">${this.fmt(curve)} °C</span>
        </div>
        ${delta(t("p_term"), p)} ${delta(t("integral"), integral)} ${limit}
        <div class="row total result">
          <span>${t("result")}</span><span></span><span class="value">${demand ? `${this.fmt(flow, 0)} °C` : "–"}</span>
        </div>
        ${demand ? nothing : html`<div class="muted small">${t("summer")}</div>`}
      </div>
    `;
  }

  private renderWeather(): TemplateResult {
    const t = this.localize;
    const outdoor = numberState(this.hass, this.entry.sources.outdoor_sensor ?? undefined);
    const valid = isOn(this.hass, this.entry.entities.forecast_valid);
    const horizon = this.num("forecast_horizon_h");
    const deltaValue = this.num("forecast_delta");
    return html`
      <section class="card weather">
        <h2><ha-icon icon="mdi:weather-partly-cloudy"></ha-icon>${t("weather")}</h2>
        <div class="tiles">
          <div><span class="mid">${this.fmt(outdoor)} °C</span><div class="muted small">${t("outdoor_now")}</div></div>
          <div><span class="mid">${this.fmt(this.num("outdoor_damped"))} °C</span><div class="muted small">${t("outdoor_damped")}</div></div>
          <div><span class="mid">${this.fmt(this.num("outdoor_effective"))} °C</span><div class="muted small">${t("outdoor_effective")}</div></div>
        </div>
        ${this.entry.sources.weather
          ? html`<div class="forecast">
              <span class="chip ${valid ? "" : "heat"}">${valid ? `${t("forecast")} · ${t("next_hours", { h: horizon ?? 4 })}` : t("forecast_stale")}</span>
              <span class="chip"><ha-icon icon="mdi:thermometer"></ha-icon>${deltaValue === undefined ? "–" : formatSigned(this.hass.language, deltaValue)} K</span>
              <span class="chip"><ha-icon icon="mdi:cloud"></ha-icon>${this.fmt(this.num("forecast_cloud"), 0)} %</span>
              <span class="chip"><ha-icon icon="mdi:weather-windy"></ha-icon>${this.fmt(this.num("forecast_wind"), 0)} km/h</span>
              <span class="chip"><ha-icon icon="mdi:white-balance-sunny"></ha-icon>${this.fmt(this.num("forecast_daylight"), 0)} %</span>
            </div>`
          : nothing}
      </section>
    `;
  }

  private renderRoom(room: RoomInfo): TemplateResult {
    const t = this.localize;
    const current = numberState(this.hass, room.sensor);
    const filtered = numberState(this.hass, room.entities.filtered);
    const target = numberState(this.hass, room.entities.target);
    const weight = numberState(this.hass, room.entities.weight);
    const thermostat = room.entities.thermostat;
    const deviation = target !== undefined && filtered !== undefined ? filtered - target : undefined;
    const onTarget = deviation !== undefined && Math.abs(deviation) < 0.3;

    let status = t("sensor_missing");
    let tone = "";
    if (deviation !== undefined) {
      status = t("on_target");
      tone = "ok";
    }
    if (deviation !== undefined && !onTarget) {
      const amount = this.fmt(Math.abs(deviation));
      status = deviation < 0 ? t("too_cold", { d: amount }) : t("too_warm", { d: amount });
      tone = deviation < 0 ? "cold" : "heat";
    }
    const position = deviation === undefined ? 50 : 50 + Math.max(Math.min(deviation, 2), -2) * 25;

    return html`
      <div class="room ${weight === 0 ? "ignored" : ""}">
        <div class="room-head">
          <span class="room-name">${room.name}</span>
          <span class="chip small" title=${t("weight")}>${this.fmt(weight, 2)}</span>
        </div>
        <div class="room-temp"><span class="mid">${this.fmt(current)}</span> °C</div>
        <div class="scale"><span class="marker ${tone}" style="left:${position}%"></span></div>
        <div class="room-foot">
          <span class="small ${tone ? `tone-${tone}` : "muted"}">${status}</span>
          ${thermostat
            ? html`<span class="room-target">
                <button class="round mini" @click=${() => this.setTarget(thermostat, target, -TARGET_STEP)}>−</button>
                <span>${this.fmt(target)}</span>
                <button class="round mini" @click=${() => this.setTarget(thermostat, target, TARGET_STEP)}>+</button>
              </span>`
            : html`<span class="small muted">${t("target")} ${this.fmt(target)} °C</span>`}
        </div>
      </div>
    `;
  }

  private setTarget(entityId: string, current: number | undefined, step: number): void {
    if (current === undefined) return;
    this.hass.callService("climate", "set_temperature", { entity_id: entityId, temperature: current + step });
  }

  private setHvacMode(entityId: string, mode: string): void {
    this.hass.callService("climate", "set_hvac_mode", { entity_id: entityId, hvac_mode: mode });
  }

  private toggle(entityId: string, on: boolean): void {
    this.hass.callService("switch", on ? "turn_off" : "turn_on", { entity_id: entityId });
  }

  static styles = [
    shared,
    css`
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: var(--hc-gap);
      }
      .rooms {
        grid-column: 1 / -1;
      }
      .big {
        font-size: 3rem;
        font-weight: 300;
        line-height: 1;
      }
      .mid {
        font-size: 1.4rem;
        font-weight: 400;
      }
      .unit {
        font-size: 1.2rem;
        margin-left: 2px;
        color: var(--hc-muted);
      }
      .house-head {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
      }
      .power {
        border: none;
        border-radius: 50%;
        width: 40px;
        height: 40px;
        cursor: pointer;
        background: var(--secondary-background-color);
        color: var(--hc-muted);
      }
      .power.on {
        background: color-mix(in srgb, var(--hc-heat) 20%, transparent);
        color: var(--hc-heat);
      }
      .dial {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between;
        align-items: center;
        gap: 16px;
        margin: 8px 0 16px;
      }
      .setpoint {
        display: flex;
        align-items: center;
        gap: 12px;
        text-align: center;
      }
      .target {
        font-size: 1.6rem;
        color: var(--hc-heat);
      }
      .chips,
      .forecast {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .flame {
        animation: flicker 1.6s ease-in-out infinite;
      }
      @keyframes flicker {
        50% {
          opacity: 0.55;
        }
      }
      .sync {
        display: flex;
        align-items: center;
        gap: 12px;
        margin-top: 16px;
        padding-top: 12px;
        border-top: 1px solid var(--divider-color);
      }
      .sync-button {
        font-weight: 600;
        letter-spacing: 0.08em;
        padding: 6px 14px;
        border-radius: 8px;
        border: 1px solid var(--divider-color);
        background: transparent;
        color: var(--hc-muted);
        cursor: pointer;
      }
      .sync-button.on {
        border-color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 15%, transparent);
        color: var(--primary-color);
      }
      .flow {
        display: flex;
        justify-content: space-between;
        align-items: flex-end;
        margin-bottom: 12px;
      }
      .measured {
        text-align: right;
      }
      h3 {
        margin: 12px 0 6px;
        font-weight: 500;
      }
      .breakdown .row {
        display: grid;
        grid-template-columns: 1fr 80px 72px;
        align-items: center;
        gap: 8px;
        padding: 3px 0;
        font-size: 0.9rem;
      }
      .breakdown .value {
        text-align: right;
        font-variant-numeric: tabular-nums;
      }
      .breakdown .total {
        border-top: 1px solid var(--divider-color);
        margin-top: 2px;
        padding-top: 6px;
        font-weight: 500;
      }
      .breakdown .result .value {
        color: var(--hc-heat);
      }
      .breakdown .note {
        color: var(--hc-muted);
        font-style: italic;
      }
      .bar {
        height: 6px;
        border-radius: 3px;
        background: var(--secondary-background-color);
        overflow: hidden;
      }
      .bar span {
        display: block;
        height: 100%;
      }
      .bar .pos {
        background: var(--hc-heat);
      }
      .bar .neg {
        background: var(--hc-cold);
      }
      .tiles {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 8px;
        margin-bottom: 12px;
      }
      .room-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 12px;
      }
      .room {
        border: 1px solid var(--divider-color);
        border-radius: calc(var(--hc-radius) - 4px);
        padding: 12px;
      }
      .room.ignored {
        opacity: 0.6;
      }
      .room-head,
      .room-foot {
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 8px;
      }
      .room-name {
        font-weight: 500;
      }
      .room-temp {
        margin: 8px 0;
      }
      .scale {
        position: relative;
        height: 6px;
        border-radius: 3px;
        margin: 4px 0 10px;
        background: linear-gradient(90deg, var(--hc-cold), var(--hc-ok) 40%, var(--hc-ok) 60%, var(--hc-heat));
        opacity: 0.85;
      }
      .marker {
        position: absolute;
        top: -4px;
        width: 4px;
        height: 14px;
        margin-left: -2px;
        border-radius: 2px;
        background: var(--primary-text-color);
      }
      .tone-cold {
        color: var(--hc-cold);
      }
      .tone-heat {
        color: var(--hc-heat);
      }
      .tone-ok {
        color: var(--hc-ok);
      }
      .room-target {
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .round.mini {
        width: 28px;
        height: 28px;
        font-size: 1rem;
      }
    `,
  ];
}

customElements.get("heatcast-home") ?? customElements.define("heatcast-home", HeatCastHome);
