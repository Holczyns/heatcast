import { LitElement, css, html, nothing, svg } from "lit";
import { type EntryInfo, type HistoryPoint, fetchHistory } from "./api";
import { type HomeAssistant, type LovelaceCard, createCard } from "./ha";
import { type Localize, formatNumber } from "./localize";
import { shared } from "./styles";

const DAYS = 14;
const STATISTIC_DAYS = 30;

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

export class HeatCastStats extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    burner: { state: true },
    demand: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  burner?: DailyHours[];
  demand?: DailyHours[];
  private cards: LovelaceCard[] = [];

  connectedCallback(): void {
    super.connectedCallback();
    this.load();
  }

  protected updated(changed: Map<string, unknown>): void {
    if (changed.has("hass")) {
      for (const card of this.cards) card.hass = this.hass;
    }
  }

  private async load(): Promise<void> {
    const end = new Date();
    const start = new Date(end);
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - (DAYS - 1));

    const flame = this.entry.sources.flame_sensor;
    const demand = this.entry.entities.demand;
    const ids = [demand, flame].filter((id): id is string => !!id);
    const history = await fetchHistory(this.hass, ids, start, end);
    this.demand = onHoursPerDay(history[demand] ?? [], start, end);
    this.burner = flame ? onHoursPerDay(history[flame] ?? [], start, end) : undefined;

    const e = this.entry.entities;
    const graphs: [string, string | undefined][] = [
      [this.localize("stats.flow"), e.flow_setpoint],
      [this.localize("stats.outdoor"), e.outdoor_effective],
      [this.localize("stats.house"), e.room_temperature],
    ];
    const created = await Promise.all(
      graphs
        .filter(([, entity]) => !!entity)
        .map(([title, entity]) =>
          createCard({
            type: "statistics-graph",
            title,
            entities: [entity],
            period: "day",
            stat_types: ["mean", "min", "max"],
            days_to_show: STATISTIC_DAYS,
            chart_type: "line",
          }),
        ),
    );
    this.cards = created.filter((card): card is LovelaceCard => !!card);
    for (const card of this.cards) card.hass = this.hass;
    this.requestUpdate();
  }

  private renderBars(title: string, days: DailyHours[] | undefined, colour: string) {
    if (!days) return nothing;
    const lang = this.hass.language;
    const max = Math.max(24 / 4, ...days.map((d) => d.hours));
    const width = 100 / days.length;
    const total = days.reduce((sum, d) => sum + d.hours, 0);
    return html`
      <section class="card">
        <h2>${title}</h2>
        <div class="muted small">
          ${this.localize("stats.days", { n: days.length })} · ${this.localize("stats.total", { h: formatNumber(lang, total, 0) })}
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
              html`<span>${i % 2 === days.length % 2 ? d.day.toLocaleDateString(lang, { day: "numeric" }) : ""}</span>`,
          )}
        </div>
      </section>
    `;
  }

  render() {
    return html`
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
      .bars {
        width: 100%;
        height: 160px;
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

customElements.get("heatcast-stats") ?? customElements.define("heatcast-stats", HeatCastStats);
