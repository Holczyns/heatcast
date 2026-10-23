import type { HomeAssistant } from "./ha";

export interface RoomInfo {
  id: string;
  name: string;
  sensor: string;
  valve?: string | null;
  valve_temperature?: string | null;
  entities: Record<string, string>;
}

export interface RoomFields {
  name: string;
  sensor: string;
  valve?: string | null;
  valve_temperature?: string | null;
}

export interface EntryInfo {
  entry_id: string;
  title: string;
  individual_rooms: boolean;
  sources: Record<string, string | null>;
  idle_flow: number;
  entities: Record<string, string>;
  rooms: RoomInfo[];
}

export function fetchEntries(hass: HomeAssistant): Promise<EntryInfo[]> {
  return hass.callWS<EntryInfo[]>({ type: "heatcast/entries" });
}

export function setIndividualRooms(hass: HomeAssistant, entryId: string, enabled: boolean): Promise<void> {
  return hass.callWS({ type: "heatcast/set_options", entry_id: entryId, individual_rooms: enabled });
}

export function updateSources(
  hass: HomeAssistant,
  entryId: string,
  sources: Record<string, string | null>,
  idleFlow: number,
): Promise<void> {
  return hass.callWS({ type: "heatcast/update_sources", entry_id: entryId, ...sources, idle_flow: idleFlow });
}

export function addRoom(hass: HomeAssistant, entryId: string, room: RoomFields): Promise<{ room_id: string }> {
  return hass.callWS({ type: "heatcast/add_room", entry_id: entryId, ...room });
}

export function updateRoom(hass: HomeAssistant, entryId: string, roomId: string, room: RoomFields): Promise<void> {
  return hass.callWS({ type: "heatcast/update_room", entry_id: entryId, room_id: roomId, ...room });
}

export function removeRoom(hass: HomeAssistant, entryId: string, roomId: string): Promise<void> {
  return hass.callWS({ type: "heatcast/remove_room", entry_id: entryId, room_id: roomId });
}

export interface HistoryPoint {
  s: string;
  lu: number;
  lc?: number;
}

/** State changes of entities in a period, as returned by the history websocket. */
export async function fetchHistory(
  hass: HomeAssistant,
  entityIds: string[],
  start: Date,
  end: Date,
): Promise<Record<string, HistoryPoint[]>> {
  return hass.callWS({
    type: "history/history_during_period",
    start_time: start.toISOString(),
    end_time: end.toISOString(),
    entity_ids: entityIds,
    minimal_response: true,
    no_attributes: true,
    significant_changes_only: false,
  });
}
