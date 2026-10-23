import { LitElement, css, html, type TemplateResult } from "lit";
import { shared } from "./styles";

interface Section {
  icon: string;
  title: string;
  body: TemplateResult;
}

const PIPELINE_EN = ["Outdoor sensor", "Damping", "Forecast, sun, wind", "Curve", "Room correction", "Limits", "Boiler"];

const pipeline = (steps: string[]) =>
  html`<div class="pipeline">${steps.map((step) => html`<span class="chip">${step}</span>`)}</div>`;

const EN: Section[] = [
  {
    icon: "mdi:information-outline",
    title: "How HeatCast works",
    body: html`
      <p>
        HeatCast calculates the temperature of the water flowing to radiators and underfloor heating and sends it to the
        boiler every 30 seconds. It does not switch the burner: the boiler does that while holding the requested flow
        temperature.
      </p>
      ${pipeline(PIPELINE_EN)}
      <ol>
        <li><b>The outdoor temperature</b> is damped, because the house cools and warms with a delay.</li>
        <li>
          <b>The forecast</b> shifts it towards the coming hours. Sun raises it, wind lowers it. The result is the
          <b>effective temperature</b>.
        </li>
        <li><b>The heating curve</b> turns the effective temperature into a flow temperature.</li>
        <li>
          <b>The room correction</b> (a PI controller) adds or removes a few kelvin depending on whether the rooms are too
          cold or too warm.
        </li>
        <li>The result is kept between minimum and maximum and rounded to a whole degree.</li>
      </ol>
      <p>Every step is shown on the <b>Home</b> tab in the boiler card.</p>
    `,
  },
  {
    icon: "mdi:rocket-launch-outline",
    title: "First start and taking over the boiler",
    body: html`
      <p>
        After installation HeatCast runs in <b>shadow mode</b>: it calculates everything but sends nothing to the boiler.
        Leave it like that for a few days and compare its setpoint with your current control on the <b>History</b> tab.
      </p>
      <p>Taking over:</p>
      <ol>
        <li>
          Set the boiler's fallback: its own heating curve or a fixed temperature, plus frost protection. The boiler returns
          to it when HeatCast stops sending.
        </li>
        <li><b>Turn off every other automation or thermostat writing the boiler setpoint.</b> The boiler cannot tell two writers apart.</li>
        <li>Turn on <b>Boiler control</b> in the settings and watch the setpoint and the measured flow for the first hours.</li>
      </ol>
      <p>Turning control off lifts the heating block, so the boiler can heat on its own settings straight away.</p>
    `,
  },
  {
    icon: "mdi:shield-check-outline",
    title: "Safety and failures",
    body: html`
      <ul>
        <li>
          <b>Home Assistant is down:</b> the setpoint is no longer refreshed and the boiler returns to its own control after
          a few minutes (about 4 minutes with EMS-ESP and Bosch boilers).
        </li>
        <li>
          <b>No room readings:</b> with less than half of the sensor weight available, the room correction is 0 and the
          integral holds. Heating follows the curve alone.
        </li>
        <li>
          <b>A short sensor dropout</b> (Bluetooth sensors vanish for minutes) keeps the last value for the time set in
          <i>Sensor dropout hold</i>.
        </li>
        <li><b>A forecast older than 3 hours</b> is ignored and the damped temperature is used alone.</li>
        <li>
          <b>Off</b> on the house thermostat means no heating demand. With control on, the boiler's space heating is
          blocked and only the boiler's own frost protection remains.
        </li>
        <li>The controller state is stored and survives a Home Assistant restart.</li>
      </ul>
    `,
  },
  {
    icon: "mdi:chart-bell-curve-cumulative",
    title: "Tuning the heating curve",
    body: html`
      <p>Change the curve rarely and in small steps, after a few days of different weather.</p>
      <table>
        <tr><th>Symptom</th><th>Change</th></tr>
        <tr><td>Too cold in any weather</td><td>Shift up by 1 K</td></tr>
        <tr><td>Too cold only in frost</td><td>Design flow temperature up by 2–3 °C</td></tr>
        <tr><td>Too warm only in mild weather</td><td>Shift down and design flow temperature up by the same amount</td></tr>
        <tr><td>Heating starts too early or too late in autumn</td><td>“Heating off above” threshold</td></tr>
      </table>
      <p>
        <b>The integral is the best hint.</b> It corrects a steady curve error. If it sits at <b>+3 K</b> for long, the curve
        is too low. At <b>−3 K</b> the curve is too high, or the minimum flow temperature does not let it go lower.
      </p>
      <p>Curvature: underfloor about 1.1, radiators about 1.3. The curve chart in the settings updates live.</p>
    `,
  },
  {
    icon: "mdi:tune-vertical",
    title: "Room controller",
    body: html`
      <ul>
        <li><b>Room deviation</b> is the weighted difference between targets and room temperatures. Positive means too cold.</li>
        <li><b>Proportional gain</b>: kelvin of flow per missing degree in the rooms (limited to ±3 K).</li>
        <li>
          <b>Integral time</b>: the longer, the slower the integral removes a steady error (limited to ±3 K). A few hours
          suit underfloor heating.
        </li>
        <li>
          The integral holds without heating demand, without room readings, or when the flow is at a limit and the error
          pushes further into it.
        </li>
        <li>
          <b>The room filter</b> passes temperature changes only up to a set speed, so an open window or a few people in a
          small room do not move the controller.
        </li>
      </ul>
    `,
  },
  {
    icon: "mdi:weather-partly-snowy-rainy",
    title: "Weather, forecast, sun and wind",
    body: html`
      <ul>
        <li><b>Building time constant</b> (τ): how slowly the house follows the weather. Light houses 2–3 h, heavy ones 6–10 h.</li>
        <li><b>Forecast horizon</b>: how many hours ahead to look. Matching the heating delay works well.</li>
        <li><b>Forecast weight</b>: 0 ignores the forecast, 1 uses only the forecast. 0.5 is a safe start.</li>
        <li><b>Sun gain</b>: kelvin added to the effective temperature in full sun. Start at 0 and raise it if the house overheats on sunny days.</li>
        <li><b>Wind loss</b>: kelvin removed per km/h above the threshold, for draughty or exposed houses.</li>
      </ul>
    `,
  },
  {
    icon: "mdi:floor-plan",
    title: "Rooms, weights and individual temperatures",
    body: html`
      <ul>
        <li><b>Weight</b> sets how much a room counts. Give rooms where comfort matters a higher weight; 0 only shows the room.</li>
        <li>
          <b>Individual room temperatures</b> are enabled in the settings. Every room gets a thermostat and the house
          thermostat gets a <b>SYNC</b> button. With SYNC on, all rooms use the house setpoint. Changing one room turns
          SYNC off, like in a car's climate control.
        </li>
        <li>
          With one heating circuit and no radiator valves the boiler cannot hold different temperatures in different rooms.
          The controller finds a weighted compromise and each room card shows how far it is from its target.
        </li>
        <li>
          <b>Radiator valves</b> assigned to a room get its target every 5 minutes while control is on. If a valve accepts
          an external temperature, HeatCast writes the room sensor value to it.
        </li>
      </ul>
    `,
  },
  {
    icon: "mdi:calendar-clock",
    title: "Schedule and eco setback",
    body: html`
      <p>
        During the comfort schedule the house temperature applies. Outside it every target, rooms included, is lowered by
        the <b>eco setback</b>. With underfloor heating a setback above 1 K rarely pays off, since the screed reacts hours
        later.
      </p>
    `,
  },
  {
    icon: "mdi:test-tube",
    title: "Boiler test mode",
    body: html`
      <p>
        Sends a fixed test flow temperature regardless of the model, even in shadow mode, to check that the boiler accepts
        the setpoint. It turns itself off after an hour; the boiler then returns to its own control after a few minutes,
        which tests the fallback as well.
      </p>
    `,
  },
];

export class HeatCastGuide extends LitElement {
  render() {
    const sections = EN;
    return html`
      <div class="guide">
        ${sections.map(
          (section, index) => html`
            <details class="card" ?open=${index === 0}>
              <summary><ha-icon icon=${section.icon}></ha-icon><span>${section.title}</span></summary>
              <div class="body">${section.body}</div>
            </details>
          `,
        )}
      </div>
    `;
  }

  static styles = [
    shared,
    css`
      .guide {
        max-width: 860px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 12px;
      }
      details.card {
        padding: 0;
      }
      summary {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 16px;
        cursor: pointer;
        font-weight: 500;
        list-style: none;
      }
      summary::-webkit-details-marker {
        display: none;
      }
      summary::after {
        content: "";
        margin-left: auto;
        width: 8px;
        height: 8px;
        border-right: 2px solid var(--hc-muted);
        border-bottom: 2px solid var(--hc-muted);
        transform: rotate(45deg);
        transition: transform 0.2s;
      }
      details[open] summary::after {
        transform: rotate(-135deg);
      }
      summary ha-icon {
        color: var(--primary-color);
      }
      .body {
        padding: 0 16px 16px 48px;
        line-height: 1.55;
      }
      .body p,
      .body ul,
      .body ol {
        margin: 0 0 10px;
      }
      .body li {
        margin-bottom: 6px;
      }
      .pipeline {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin: 8px 0 12px;
      }
      .pipeline .chip:not(:last-child)::after {
        content: "→";
        margin-left: 6px;
        color: var(--hc-muted);
      }
      table {
        border-collapse: collapse;
        width: 100%;
        margin: 4px 0 12px;
        font-size: 0.9rem;
      }
      th,
      td {
        text-align: left;
        padding: 6px 8px;
        border-bottom: 1px solid var(--divider-color);
      }
      th {
        color: var(--hc-muted);
        font-weight: 500;
      }
      @media (max-width: 600px) {
        .body {
          padding-left: 16px;
        }
      }
    `,
  ];
}

customElements.get("heatcast-guide") ?? customElements.define("heatcast-guide", HeatCastGuide);
