import { LitElement, css, html } from "lit";
import type { EntryInfo } from "./api";
import { type HomeAssistant, type LovelaceCard, createCard } from "./ha";
import type { Localize, TranslationKey } from "./localize";
import { shared } from "./styles";

const RANGES = [24, 24 * 7, 24 * 30];

interface ChartDefinition {
  title: TranslationKey;
  entities: (string | null | undefined)[];
}

/** One unit per chart: mixed units squeeze the lines into a flat band. */
function charts(entry: EntryInfo): ChartDefinition[] {
  const e = entry.entities;
  return [
    { title: "chart.flow", entities: [e.flow_setpoint, entry.sources.flow_sensor, e.curve_flow] },
    { title: "chart.outdoor", entities: [entry.sources.outdoor_sensor, e.outdoor_damped, e.outdoor_effective] },
    {
      title: "chart.rooms",
      entities: [e.room_temperature, e.setpoint, ...entry.rooms.map((room) => room.entities.filtered)],
    },
    { title: "chart.correction", entities: [e.room_correction, e.proportional, e.integral] },
    { title: "chart.weather", entities: [e.forecast_effect, e.solar_correction, e.wind_correction] },
    {
      title: "chart.states",
      entities: [e.demand, e.control, entry.sources.flame_sensor, entry.sources.dhw_sensor],
    },
  ];
}

export class HeatCastCharts extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    hours: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  hours = 24;
  private cards: LovelaceCard[] = [];

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("hours") || changed.has("entry")) {
      this.buildCards();
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("hass")) {
      for (const card of this.cards) card.hass = this.hass;
    }
  }

  private async buildCards(): Promise<void> {
    const created = await Promise.all(
      charts(this.entry).map((chart) =>
        createCard({
          type: "history-graph",
          title: this.localize(chart.title),
          hours_to_show: this.hours,
          entities: chart.entities.filter((entity): entity is string => !!entity),
        }),
      ),
    );
    this.cards = created.filter((card): card is LovelaceCard => !!card);
    for (const card of this.cards) card.hass = this.hass;
    this.requestUpdate();
  }

  render() {
    return html`
      <div class="toolbar">
        <span class="muted small">${this.localize("range")}</span>
        ${RANGES.map(
          (hours) =>
            html`<button class="range ${hours === this.hours ? "active" : ""}" @click=${() => (this.hours = hours)}>
              ${hours < 48 ? `${hours} h` : `${hours / 24} d`}
            </button>`,
        )}
      </div>
      <div class="grid">${this.cards}</div>
    `;
  }

  static styles = [
    shared,
    css`
      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: var(--hc-gap);
      }
      .range {
        border: 1px solid var(--divider-color);
        border-radius: 999px;
        padding: 4px 12px;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
      }
      .range.active {
        border-color: var(--primary-color);
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
        gap: var(--hc-gap);
      }
      @media (max-width: 600px) {
        .grid {
          grid-template-columns: 1fr;
        }
      }
    `,
  ];
}

customElements.get("heatcast-charts") ?? customElements.define("heatcast-charts", HeatCastCharts);
