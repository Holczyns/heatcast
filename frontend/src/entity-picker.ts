import { LitElement, css, html } from "lit";
import { type HomeAssistant, fireEvent } from "./ha";

/** Plain select of entities from given domains, so the panel does not rely on lazily loaded HA pickers. */
export class HeatCastEntityPicker extends LitElement {
  static properties = {
    hass: { attribute: false },
    domains: { attribute: false },
    deviceClass: { attribute: false },
    value: { attribute: false },
    optional: { type: Boolean },
  };

  hass!: HomeAssistant;
  domains: string[] = [];
  deviceClass?: string;
  value?: string | null;
  optional = false;

  private options(): { id: string; name: string }[] {
    const matches = Object.values(this.hass.states).filter((state) => {
      const domainMatches = this.domains.includes(state.entity_id.split(".")[0]);
      const classMatches = !this.deviceClass || state.attributes.device_class === this.deviceClass;
      return domainMatches && (classMatches || state.entity_id === this.value);
    });
    return matches
      .map((state) => ({ id: state.entity_id, name: String(state.attributes.friendly_name ?? state.entity_id) }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  render() {
    const options = this.options();
    const known = !this.value || options.some((option) => option.id === this.value);
    return html`
      <select
        @change=${(event: Event) => {
          const value = (event.target as HTMLSelectElement).value;
          fireEvent(this, "value-changed", value || null);
        }}
      >
        ${this.optional || !this.value ? html`<option value="" ?selected=${!this.value}>–</option>` : ""}
        ${known ? "" : html`<option value=${this.value!} selected>${this.value}</option>`}
        ${options.map(
          (option) =>
            html`<option value=${option.id} ?selected=${option.id === this.value}>${option.name} · ${option.id}</option>`,
        )}
      </select>
    `;
  }

  static styles = css`
    select {
      width: 100%;
      box-sizing: border-box;
      padding: 6px 8px;
      border: 1px solid var(--divider-color);
      border-radius: 6px;
      background: var(--card-background-color, transparent);
      color: var(--primary-text-color);
      font: inherit;
    }
  `;
}

customElements.get("heatcast-entity-picker") ?? customElements.define("heatcast-entity-picker", HeatCastEntityPicker);
