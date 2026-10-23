import { LitElement, css, html, nothing } from "lit";
import { type EntryInfo, fetchEntries } from "./api";
import type { HomeAssistant } from "./ha";
import { type Localize, type TranslationKey, localizer } from "./localize";
import { shared } from "./styles";
import "./view-charts";
import "./view-home";
import "./view-settings";
import "./view-stats";

const TABS: { id: string; label: TranslationKey; icon: string }[] = [
  { id: "home", label: "tab.home", icon: "mdi:home-thermometer-outline" },
  { id: "charts", label: "tab.charts", icon: "mdi:chart-line" },
  { id: "stats", label: "tab.stats", icon: "mdi:chart-bar" },
  { id: "settings", label: "tab.settings", icon: "mdi:tune-variant" },
];
// Give a reloading entry time to come back before its entities are read again.
const RELOAD_DELAY_MS = 1500;

class HeatCastPanel extends LitElement {
  static properties = {
    hass: { attribute: false },
    narrow: { type: Boolean },
    entries: { state: true },
    entryId: { state: true },
    tab: { state: true },
    error: { state: true },
  };

  hass!: HomeAssistant;
  narrow = false;
  entries?: EntryInfo[];
  entryId?: string;
  tab = "home";
  error?: string;
  private loading = false;
  private localize: Localize = localizer("en");
  private language = "";

  protected willUpdate(changed: Map<string, unknown>): void {
    if (changed.has("hass") && this.hass && this.hass.language !== this.language) {
      this.language = this.hass.language;
      this.localize = localizer(this.language);
    }
    if (changed.has("hass") && this.hass && !this.entries && !this.loading) {
      this.load();
    }
  }

  private async load(): Promise<void> {
    this.loading = true;
    try {
      this.entries = await fetchEntries(this.hass);
      const known = this.entries.some((entry) => entry.entry_id === this.entryId);
      if (!known) this.entryId = this.entries[0]?.entry_id;
      this.error = undefined;
    } catch (err) {
      this.error = String((err as Error)?.message ?? err);
    } finally {
      this.loading = false;
    }
  }

  private entriesChanged = () => {
    window.setTimeout(() => this.load(), RELOAD_DELAY_MS);
  };

  connectedCallback(): void {
    super.connectedCallback();
    this.addEventListener("heatcast-entries-changed", this.entriesChanged);
    if (this.hass) this.load();
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    this.removeEventListener("heatcast-entries-changed", this.entriesChanged);
  }

  render() {
    const entry = this.entries?.find((item) => item.entry_id === this.entryId);
    return html`
      <div class="header">
        <div class="toolbar">
          <ha-menu-button .hass=${this.hass} .narrow=${this.narrow}></ha-menu-button>
          <div class="title">${entry?.title ?? "HeatCast"}</div>
          ${(this.entries?.length ?? 0) > 1
            ? html`<select @change=${(e: Event) => (this.entryId = (e.target as HTMLSelectElement).value)}>
                ${this.entries!.map(
                  (item) => html`<option value=${item.entry_id} ?selected=${item.entry_id === this.entryId}>${item.title}</option>`,
                )}
              </select>`
            : nothing}
        </div>
        <nav>
          ${TABS.map(
            (tab) => html`
              <button class="tab ${tab.id === this.tab ? "active" : ""}" @click=${() => (this.tab = tab.id)}>
                <ha-icon icon=${tab.icon}></ha-icon><span>${this.localize(tab.label)}</span>
              </button>
            `,
          )}
        </nav>
      </div>
      <main>${this.renderContent(entry)}</main>
    `;
  }

  private renderContent(entry: EntryInfo | undefined) {
    if (this.error) return html`<div class="card">${this.error}</div>`;
    if (!this.entries) return html`<div class="muted">${this.localize("loading")}</div>`;
    if (!entry) return html`<div class="card">${this.localize("no_entry")}</div>`;
    const props = { hass: this.hass, entry, localize: this.localize };
    switch (this.tab) {
      case "charts":
        return html`<heatcast-charts .hass=${props.hass} .entry=${entry} .localize=${props.localize}></heatcast-charts>`;
      case "stats":
        return html`<heatcast-stats .hass=${props.hass} .entry=${entry} .localize=${props.localize}></heatcast-stats>`;
      case "settings":
        return html`<heatcast-settings .hass=${props.hass} .entry=${entry} .localize=${props.localize}></heatcast-settings>`;
      default:
        return html`<heatcast-home .hass=${props.hass} .entry=${entry} .localize=${props.localize}></heatcast-home>`;
    }
  }

  static styles = [
    shared,
    css`
      :host {
        display: block;
        min-height: 100vh;
        background: var(--primary-background-color);
        color: var(--primary-text-color);
        font-family: var(--paper-font-body1_-_font-family, inherit);
      }
      .header {
        position: sticky;
        top: 0;
        z-index: 2;
        background: var(--app-header-background-color, var(--primary-background-color));
        color: var(--app-header-text-color, var(--primary-text-color));
        border-bottom: var(--app-header-border-bottom, 1px solid var(--divider-color));
      }
      .toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        height: 56px;
        padding: 0 12px;
      }
      .title {
        flex: 1;
        font-size: 1.25rem;
      }
      select {
        background: transparent;
        color: inherit;
        border: 1px solid var(--divider-color);
        border-radius: 6px;
        padding: 4px 8px;
      }
      nav {
        display: flex;
        gap: 4px;
        padding: 0 12px;
        overflow-x: auto;
      }
      .tab {
        display: inline-flex;
        align-items: center;
        gap: 6px;
        padding: 10px 14px;
        border: none;
        border-bottom: 2px solid transparent;
        background: transparent;
        color: inherit;
        opacity: 0.75;
        cursor: pointer;
        font: inherit;
        white-space: nowrap;
      }
      .tab.active {
        opacity: 1;
        border-bottom-color: var(--primary-color);
        color: var(--primary-color);
      }
      main {
        padding: var(--hc-gap);
        max-width: 1400px;
        margin: 0 auto;
        box-sizing: border-box;
      }
      @media (max-width: 600px) {
        .tab span {
          display: none;
        }
        main {
          padding: 8px;
        }
      }
    `,
  ];
}

customElements.get("heatcast-panel") ?? customElements.define("heatcast-panel", HeatCastPanel);
