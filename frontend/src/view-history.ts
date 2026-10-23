import { LitElement, css, html, nothing, svg } from "lit";
import { type EntryInfo, type HistoryPoint, fetchHistory } from "./api";
import { type HomeAssistant, type LovelaceCard, createCard } from "./ha";
import { LANGUAGE, type Localize, type TranslationKey, formatNumber } from "./localize";
import { shared } from "./styles";

interface Range {
  hours: number;
  days: number;
  label: string;
}

// Up to a week the raw history is readable; a month is shown as daily statistics.
const RANGES: Range[] = [
  { hours: 24, days: 7, label: "24 h" },
  { hours: 24 * 7, days: 14, label: "7 d" },
  { hours: 24 * 30, days: 30, label: "30 d" },
];
const DAILY_FROM_HOURS = 24 * 30;

interface Series {
  entity: string | null | undefined;
  name: string;
}

interface ChartDefinition {
  title: TranslationKey;
  series: Series[];
  timeline?: boolean;
}

interface DailyHours {
  day: Date;
  hours: number;
}

/** Hours per local day an on/off entity spent "on", from its state changes. */
export function onHoursPerDay(points: HistoryPoint[], start: Date, end: Date): DailyHours[] {
  const days: DailyHours[] = [];
  for (let day = new Date(start); day < end; day.setDate(day.getDate() + 1)) {
    days.push({ day: new Date(day), hours: 0 });
  }
  for (let i = 0; i < points.length; i++) {
    if (points[i].s !== "on") continue;
    const from = Math.max(points[i].lu * 1000, start.getTime());
    const to = Math.min(i + 1 < points.length ? points[i + 1].lu * 1000 : Date.now(), end.getTime());
    for (const bucket of days) {
      const dayStart = bucket.day.getTime();
      const dayEnd = new Date(bucket.day).setDate(bucket.day.getDate() + 1);
      const overlap = Math.min(to, dayEnd) - Math.max(from, dayStart);
      if (overlap > 0) bucket.hours += overlap / 3_600_000;
    }
  }
  return days;
}

/** One unit per chart: mixed units squeeze the lines into a flat band. */
function charts(entry: EntryInfo, t: Localize): ChartDefinition[] {
  const e = entry.entities;
  const s = entry.sources;
  return [
    {
      title: "chart.flow",
      series: [
        { entity: e.flow_setpoint, name: t("s.setpoint") },
        { entity: s.flow_sensor, name: t("s.measured") },
        { entity: e.curve_flow, name: t("s.curve") },
      ],
    },
    {
      title: "chart.outdoor",
      series: [
        { entity: s.outdoor_sensor, name: t("s.outdoor") },
        { entity: e.outdoor_damped, name: t("s.damped") },
        { entity: e.outdoor_effective, name: t("s.effective") },
      ],
    },
    {
      title: "chart.rooms",
      series: [
        { entity: e.room_temperature, name: t("s.house") },
        { entity: e.setpoint, name: t("s.house_target") },
        ...entry.rooms.map((room) => ({ entity: room.entities.filtered, name: room.name })),
      ],
    },
    {
      title: "chart.correction",
      series: [
        { entity: e.room_correction, name: t("s.correction") },
        { entity: e.proportional, name: "P" },
        { entity: e.integral, name: "I" },
      ],
    },
    {
      title: "chart.weather",
      series: [
        { entity: e.forecast_effect, name: t("s.forecast") },
        { entity: e.solar_correction, name: t("s.solar") },
        { entity: e.wind_correction, name: t("s.wind") },
      ],
    },
    {
      title: "chart.states",
      timeline: true,
      series: [
        { entity: e.demand, name: t("s.demand") },
        { entity: e.control, name: t("s.control") },
        { entity: s.flame_sensor, name: t("s.flame") },
        { entity: s.dhw_sensor, name: t("s.dhw") },
      ],
    },
  ];
}

export class HeatCastHistory extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    range: { state: true },
    burner: { state: true },
    demand: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  range: Range = RANGES[0];
  burner?: DailyHours[];
  demand?: DailyHours[];
  private cards: LovelaceCard[] = [];

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("range") || changed.has("entry")) {
      this.buildCards();
      this.loadHours();
    }
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("hass")) {
      for (const card of this.cards) card.hass = this.hass;
    }
  }

  private async buildCards(): Promise<void> {
    const daily = this.range.hours >= DAILY_FROM_HOURS;
    const definitions = charts(this.entry, this.localize).filter((chart) => !(daily && chart.timeline));
    const created = await Promise.all(
      definitions.map((chart) => {
        const entities = chart.series.filter((item) => !!item.entity);
        if (daily) {
          return createCard({
            type: "statistics-graph",
            title: this.localize(chart.title),
            entities: entities.map((item) => ({ entity: item.entity, name: item.name })),
            period: "day",
            stat_types: ["mean"],
            days_to_show: this.range.days,
            chart_type: "line",
          });
        }
        return createCard({
          type: "history-graph",
          title: this.localize(chart.title),
          hours_to_show: this.range.hours,
          entities: entities.map((item) => ({ entity: item.entity, name: item.name })),
        });
      }),
    );
    this.cards = created.filter((card): card is LovelaceCard => !!card);
    for (const card of this.cards) card.hass = this.hass;
    this.requestUpdate();
  }

  private async loadHours(): Promise<void> {
    const end = new Date();
    const start = new Date(end);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (this.range.days - 1));
    const flame = this.entry.sources.flame_sensor;
    const demand = this.entry.entities.demand;
    const ids = [demand, flame].filter((id): id is string => !!id);
    const history = await fetchHistory(this.hass, ids, start, end);
    this.demand = onHoursPerDay(history[demand] ?? [], start, end);
    this.burner = flame ? onHoursPerDay(history[flame] ?? [], start, end) : undefined;
  }

  private renderBars(title: string, days: DailyHours[] | undefined, colour: string) {
    if (!days) return nothing;
    const lang = LANGUAGE;
    const max = Math.max(6, ...days.map((d) => d.hours));
    const width = 100 / days.length;
    const total = days.reduce((sum, d) => sum + d.hours, 0);
    const average = total / days.length;
    const labelEvery = Math.ceil(days.length / 10);
    return html`
      <section class="card">
        <h2>${title}</h2>
        <div class="muted small">
          ${this.localize("stats.days", { n: days.length })} · ${this.localize("stats.total", { h: formatNumber(lang, total, 0) })}
          · ${this.localize("stats.average", { h: formatNumber(lang, average) })}
        </div>
        <svg viewBox="0 0 100 50" preserveAspectRatio="none" class="bars" role="img" aria-label=${title}>
          ${days.map((d, i) => {
            const h = (d.hours / max) * 46;
            return svg`<rect x=${i * width + width * 0.15} y=${48 - h} width=${width * 0.7} height=${h} rx="0.6" fill=${colour}>
              <title>${d.day.toLocaleDateString(lang, { weekday: "short", day: "numeric", month: "short" })}: ${formatNumber(lang, d.hours)} h</title>
            </rect>`;
          })}
        </svg>
        <div class="labels">
          ${days.map(
            (d, i) =>
              html`<span>${(days.length - 1 - i) % labelEvery === 0 ? d.day.toLocaleDateString(lang, { day: "numeric" }) : ""}</span>`,
          )}
        </div>
      </section>
    `;
  }

  render() {
    const daily = this.range.hours >= DAILY_FROM_HOURS;
    return html`
      <div class="toolbar">
        ${RANGES.map(
          (range) =>
            html`<button class="range ${range === this.range ? "active" : ""}" @click=${() => (this.range = range)}>
              ${range.label}
            </button>`,
        )}
        <span class="muted small">${daily ? this.localize("history.daily") : this.localize("history.raw")}</span>
      </div>
      <div class="grid">
        ${this.entry.sources.flame_sensor
          ? this.renderBars(this.localize("stats.burner"), this.burner, "var(--hc-heat)")
          : html`<section class="card muted small">${this.localize("stats.no_flame")}</section>`}
        ${this.renderBars(this.localize("stats.demand"), this.demand, "var(--primary-color)")} ${this.cards}
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      .toolbar {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        margin-bottom: var(--hc-gap);
      }
      .range {
        border: 1px solid var(--divider-color);
        border-radius: 999px;
        padding: 4px 14px;
        background: transparent;
        color: var(--primary-text-color);
        cursor: pointer;
        font: inherit;
      }
      .range.active {
        border-color: var(--primary-color);
        color: var(--primary-color);
        background: color-mix(in srgb, var(--primary-color) 12%, transparent);
      }
      .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(min(420px, 100%), 1fr));
        gap: var(--hc-gap);
      }
      .bars {
        width: 100%;
        height: 140px;
        margin-top: 12px;
      }
      .labels {
        display: flex;
        font-size: 0.7rem;
        color: var(--hc-muted);
      }
      .labels span {
        flex: 1;
        text-align: center;
      }
    `,
  ];
}

customElements.get("heatcast-history") ?? customElements.define("heatcast-history", HeatCastHistory);
