import { LitElement, css, html, nothing, type TemplateResult } from "lit";
import { type EntryInfo, type RoomFields, type RoomInfo, addRoom, removeRoom, updateRoom, updateSources } from "./api";
import "./entity-picker";
import { type HomeAssistant, fireEvent } from "./ha";
import type { Localize, TranslationKey } from "./localize";
import { controlStyles, numberControl } from "./number-control";
import { shared } from "./styles";

interface FieldDefinition {
  key: string;
  label: TranslationKey;
  domains: string[];
  deviceClass?: string;
  optional: boolean;
}

const SOURCE_FIELDS: FieldDefinition[] = [
  { key: "flow_entity", label: "src.flow_entity", domains: ["number", "input_number"], optional: false },
  { key: "block_entity", label: "src.block_entity", domains: ["switch", "input_boolean"], optional: true },
  { key: "flow_sensor", label: "src.flow_sensor", domains: ["sensor"], deviceClass: "temperature", optional: true },
  { key: "flame_sensor", label: "src.flame_sensor", domains: ["binary_sensor"], optional: true },
  { key: "dhw_sensor", label: "src.dhw_sensor", domains: ["binary_sensor"], optional: true },
  { key: "outdoor_sensor", label: "src.outdoor_sensor", domains: ["sensor"], deviceClass: "temperature", optional: false },
  { key: "weather", label: "src.weather", domains: ["weather"], optional: true },
  { key: "schedule", label: "src.schedule", domains: ["schedule"], optional: true },
];

const ROOM_FIELDS: FieldDefinition[] = [
  { key: "sensor", label: "room.sensor", domains: ["sensor"], deviceClass: "temperature", optional: false },
  { key: "valve", label: "room.valve", domains: ["climate"], optional: true },
  { key: "valve_temperature", label: "room.valve_temperature", domains: ["number", "input_number"], optional: true },
];

function errorText(err: unknown): string {
  return String((err as { message?: string })?.message ?? err);
}

function picker(
  hass: HomeAssistant,
  t: Localize,
  field: FieldDefinition,
  value: string | null | undefined,
  onChange: (value: string | null) => void,
): TemplateResult {
  return html`
    <div class="field">
      <label>${t(field.label)}${field.optional ? "" : " *"}</label>
      <heatcast-entity-picker
        .hass=${hass}
        .domains=${field.domains}
        .deviceClass=${field.deviceClass}
        .value=${value}
        ?optional=${field.optional}
        @value-changed=${(event: CustomEvent) => onChange(event.detail)}
      ></heatcast-entity-picker>
    </div>
  `;
}

/** Boiler outputs and weather inputs; saving reloads the integration. */
export class HeatCastSourcesCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    draft: { state: true },
    idleFlow: { state: true },
    error: { state: true },
    saving: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  draft?: Record<string, string | null>;
  idleFlow = 0;
  error?: string;
  saving = false;

  private edit(): void {
    this.draft = { ...this.entry.sources };
    this.idleFlow = this.entry.idle_flow;
    this.error = undefined;
  }

  private async save(): Promise<void> {
    if (!this.draft) return;
    this.saving = true;
    try {
      await updateSources(this.hass, this.entry.entry_id, this.draft, this.idleFlow);
      this.draft = undefined;
      fireEvent(this, "heatcast-entries-changed");
    } catch (err) {
      this.error = errorText(err);
    } finally {
      this.saving = false;
    }
  }

  render() {
    const t = this.localize;
    return html`
      <section class="card">
        <h2>${t("settings.sources")}</h2>
        ${this.draft ? this.renderForm() : this.renderSummary()}
      </section>
    `;
  }

  private renderSummary(): TemplateResult {
    const t = this.localize;
    return html`
      <dl>
        ${SOURCE_FIELDS.map((field) => {
          const entityId = this.entry.sources[field.key];
          const name = entityId ? (this.hass.states[entityId]?.attributes.friendly_name ?? entityId) : "–";
          return html`<dt>${t(field.label)}</dt>
            <dd title=${entityId ?? ""}>${name}</dd>`;
        })}
      </dl>
      <div class="actions"><button class="text primary" @click=${this.edit}>${t("action.edit")}</button></div>
    `;
  }

  private renderForm(): TemplateResult {
    const t = this.localize;
    const draft = this.draft!;
    const blockSwitch = !!draft.block_entity;
    return html`
      ${SOURCE_FIELDS.map((field) =>
        picker(this.hass, t, field, draft[field.key], (value) => {
          this.draft = { ...draft, [field.key]: value };
        }),
      )}
      ${blockSwitch
        ? nothing
        : html`<div class="field">
            <label>${t("src.idle_flow")}</label>
            <input
              class="text"
              type="number"
              min="0"
              max="40"
              .value=${String(this.idleFlow)}
              @change=${(event: Event) => (this.idleFlow = Number((event.target as HTMLInputElement).value))}
            />
          </div>`}
      <p class="muted small">${t("settings.reload_hint")}</p>
      ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
      <div class="actions">
        <button class="text" @click=${() => (this.draft = undefined)}>${t("settings.cancel")}</button>
        <button class="text primary" ?disabled=${this.saving} @click=${this.save}>${t("action.save")}</button>
      </div>
    `;
  }

  static styles = [
    shared,
    controlStyles,
    css`
      dl {
        display: grid;
        grid-template-columns: auto 1fr;
        gap: 6px 16px;
        margin: 0;
        font-size: 0.9rem;
      }
      dt {
        color: var(--hc-muted);
      }
      dd {
        margin: 0;
        text-align: right;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    `,
  ];
}

/** Rooms with live weights, plus adding, editing and removing rooms. */
export class HeatCastRoomsCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    entry: { attribute: false },
    localize: { attribute: false },
    editing: { state: true },
    draft: { state: true },
    confirmRemove: { state: true },
    error: { state: true },
    saving: { state: true },
  };

  hass!: HomeAssistant;
  entry!: EntryInfo;
  localize!: Localize;
  /** Room id being edited, "new" while adding, undefined otherwise. */
  editing?: string;
  draft?: RoomFields;
  confirmRemove = false;
  error?: string;
  saving = false;

  private startEdit(room?: RoomInfo): void {
    this.editing = room?.id ?? "new";
    this.draft = {
      name: room?.name ?? "",
      sensor: room?.sensor ?? "",
      valve: room?.valve ?? null,
      valve_temperature: room?.valve_temperature ?? null,
    };
    this.confirmRemove = false;
    this.error = undefined;
  }

  private stopEdit(): void {
    this.editing = undefined;
    this.draft = undefined;
  }

  private async run(action: () => Promise<unknown>): Promise<void> {
    this.saving = true;
    try {
      await action();
      this.stopEdit();
      fireEvent(this, "heatcast-entries-changed");
    } catch (err) {
      this.error = errorText(err);
    } finally {
      this.saving = false;
    }
  }

  render() {
    const t = this.localize;
    return html`
      <section class="card">
        <h2>${t("settings.rooms")}</h2>
        ${this.entry.rooms.map((room) =>
          this.editing === room.id ? this.renderForm(room) : this.renderRoom(room),
        )}
        ${this.editing === "new"
          ? this.renderForm()
          : html`<div class="actions">
              <button class="text primary" @click=${() => this.startEdit()}>+ ${t("action.add_room")}</button>
            </div>`}
      </section>
    `;
  }

  private renderRoom(room: RoomInfo): TemplateResult {
    return html`
      <div class="room">
        ${numberControl(this.hass, room.entities.weight, room.name)}
        <button class="text icon" title=${this.localize("action.edit")} @click=${() => this.startEdit(room)}>
          <ha-icon icon="mdi:pencil"></ha-icon>
        </button>
      </div>
    `;
  }

  private renderForm(room?: RoomInfo): TemplateResult {
    const t = this.localize;
    const draft = this.draft!;
    const valid = draft.name.trim().length > 0 && !!draft.sensor;
    const save = () =>
      this.run(() =>
        room
          ? updateRoom(this.hass, this.entry.entry_id, room.id, draft)
          : addRoom(this.hass, this.entry.entry_id, draft),
      );
    return html`
      <div class="form">
        <div class="field">
          <label>${t("room.name")} *</label>
          <input
            class="text"
            .value=${draft.name}
            @input=${(event: Event) => (this.draft = { ...draft, name: (event.target as HTMLInputElement).value })}
          />
        </div>
        ${ROOM_FIELDS.map((field) =>
          picker(this.hass, t, field, (draft as unknown as Record<string, string | null>)[field.key], (value) => {
            this.draft = { ...draft, [field.key]: value };
          }),
        )}
        <p class="muted small">${t("settings.reload_hint")}</p>
        ${this.error ? html`<div class="error">${this.error}</div>` : nothing}
        ${this.confirmRemove && room
          ? html`<div class="confirm">
              <span>${t("room.remove_confirm", { name: room.name })}</span>
              <button class="text" @click=${() => (this.confirmRemove = false)}>${t("settings.cancel")}</button>
              <button
                class="text danger"
                @click=${() => this.run(() => removeRoom(this.hass, this.entry.entry_id, room.id))}
              >
                ${t("action.remove")}
              </button>
            </div>`
          : nothing}
        <div class="actions">
          ${room
            ? html`<button class="text danger" @click=${() => (this.confirmRemove = true)}>${t("action.remove")}</button>`
            : nothing}
          <span class="spacer"></span>
          <button class="text" @click=${() => this.stopEdit()}>${t("settings.cancel")}</button>
          <button class="text primary" ?disabled=${!valid || this.saving} @click=${save}>
            ${room ? t("action.save") : t("action.add_room")}
          </button>
        </div>
      </div>
    `;
  }

  static styles = [
    shared,
    controlStyles,
    css`
      .room {
        display: flex;
        align-items: center;
        gap: 4px;
      }
      .room > :first-child {
        flex: 1;
      }
      button.icon {
        padding: 4px;
        color: var(--hc-muted);
      }
      .form {
        border: 1px solid var(--divider-color);
        border-radius: 8px;
        padding: 12px;
        margin: 6px 0;
      }
      input.text {
        width: 100%;
        box-sizing: border-box;
        padding: 6px 8px;
      }
      .spacer {
        flex: 1;
      }
      .confirm {
        display: flex;
        flex-wrap: wrap;
        align-items: center;
        gap: 8px;
        padding: 10px 12px;
        margin: 8px 0;
        border-radius: 8px;
        background: color-mix(in srgb, var(--error-color, #db4437) 12%, transparent);
      }
      .confirm span {
        flex: 1;
      }
    `,
  ];
}

customElements.get("heatcast-sources-card") ?? customElements.define("heatcast-sources-card", HeatCastSourcesCard);
customElements.get("heatcast-rooms-card") ?? customElements.define("heatcast-rooms-card", HeatCastRoomsCard);
