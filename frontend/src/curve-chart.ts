import { LitElement, css, html, svg } from "lit";
import { formatNumber } from "./localize";

export interface CurveParams {
  setpoint: number;
  designTemp: number;
  outdoorMin: number;
  exponent: number;
  offset: number;
  flowMin: number;
  flowMax: number;
  summerTemp: number;
}

// Same formula as the model; the panel only draws it.
export function curveFlow(p: CurveParams, outdoor: number): number {
  const span = p.setpoint - p.outdoorMin;
  if (span <= 0) return p.setpoint;
  const load = Math.max(p.setpoint - outdoor, 0) / span;
  return p.setpoint + (p.designTemp - p.setpoint) * load ** (1 / p.exponent) + p.offset;
}

const WIDTH = 320;
const HEIGHT = 180;
const PAD = { left: 30, right: 10, top: 10, bottom: 22 };

export class HeatCastCurveChart extends LitElement {
  static properties = {
    params: { attribute: false },
    outdoor: { attribute: false },
    language: {},
  };

  params?: CurveParams;
  outdoor?: number;
  language = "en";

  render() {
    const p = this.params;
    if (!p) return html``;
    const xMax = 20;
    const xMin = Math.min(p.outdoorMin, -20);
    const yMin = Math.floor(Math.min(p.flowMin, p.setpoint) / 5) * 5;
    const yMax = Math.ceil(Math.max(p.flowMax, p.designTemp + p.offset) / 5) * 5;
    const plotW = WIDTH - PAD.left - PAD.right;
    const plotH = HEIGHT - PAD.top - PAD.bottom;
    // Outdoor runs from warm (left) to cold (right), as on boiler manuals.
    const x = (t: number) => PAD.left + ((xMax - t) / (xMax - xMin)) * plotW;
    const y = (v: number) => PAD.top + ((yMax - v) / (yMax - yMin)) * plotH;
    const clamp = (v: number) => Math.max(Math.min(v, p.flowMax), p.flowMin);

    const raw: string[] = [];
    const limited: string[] = [];
    for (let t = xMax; t >= xMin; t -= 0.5) {
      raw.push(`${x(t).toFixed(1)},${y(curveFlow(p, t)).toFixed(1)}`);
      if (t < p.summerTemp) limited.push(`${x(t).toFixed(1)},${y(clamp(curveFlow(p, t))).toFixed(1)}`);
    }
    const xTicks = [20, 10, 0, -10, -20].filter((t) => t >= xMin);
    const yTicks: number[] = [];
    for (let v = yMin; v <= yMax; v += 5) yTicks.push(v);

    const current = this.outdoor;
    return html`
      <svg viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img">
        ${yTicks.map(
          (v) => svg`<line class="grid" x1=${PAD.left} x2=${WIDTH - PAD.right} y1=${y(v)} y2=${y(v)}></line>
            <text class="tick" x=${PAD.left - 4} y=${y(v) + 3} text-anchor="end">${v}</text>`,
        )}
        ${xTicks.map(
          (t) => svg`<text class="tick" x=${x(t)} y=${HEIGHT - 6} text-anchor="middle">${t}</text>`,
        )}
        <rect class="summer" x=${x(xMax)} y=${PAD.top} width=${Math.max(x(p.summerTemp) - x(xMax), 0)} height=${plotH}></rect>
        <polyline class="raw" points=${raw.join(" ")}></polyline>
        <polyline class="curve" points=${limited.join(" ")}></polyline>
        ${current === undefined
          ? ""
          : svg`<circle class="now" cx=${x(Math.max(Math.min(current, xMax), xMin))} cy=${y(clamp(curveFlow(p, current)))} r="5">
              <title>${formatNumber(this.language, current)} °C → ${formatNumber(this.language, clamp(curveFlow(p, current)))} °C</title>
            </circle>`}
      </svg>
    `;
  }

  static styles = css`
    svg {
      width: 100%;
      height: auto;
      display: block;
    }
    .grid {
      stroke: var(--divider-color, #e0e0e0);
      stroke-width: 0.5;
    }
    .tick {
      font-size: 9px;
      fill: var(--secondary-text-color);
    }
    .summer {
      fill: var(--secondary-background-color, rgba(127, 127, 127, 0.1));
    }
    .raw {
      fill: none;
      stroke: var(--secondary-text-color);
      stroke-width: 1;
      stroke-dasharray: 3 3;
      opacity: 0.6;
    }
    .curve {
      fill: none;
      stroke: var(--state-climate-heat-color, #ff8100);
      stroke-width: 2.5;
      stroke-linejoin: round;
    }
    .now {
      fill: var(--primary-color);
      stroke: var(--card-background-color, #fff);
      stroke-width: 2;
    }
  `;
}

customElements.get("heatcast-curve-chart") ?? customElements.define("heatcast-curve-chart", HeatCastCurveChart);
