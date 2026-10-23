import type { HomeAssistant } from "./ha";

export interface RoomInfo {
  id: string;
  name: string;
  sensor: string;
  valve?: string | null;
  entities: Record<string, string>;
}

export interface EntryInfo {
  entry_id: string;
  title: string;
  individual_rooms: boolean;
  sources: Record<string, string | null>;
  entities: Record<string, string>;
  rooms: RoomInfo[];
}

export function fetchEntries(hass: HomeAssistant): Promise<EntryInfo[]> {
  return hass.callWS<EntryInfo[]>({ type: "heatcast/entries" });
}

export function setIndividualRooms(hass: HomeAssistant, entryId: string, enabled: boolean): Promise<void> {
  return hass.callWS({ type: "heatcast/set_options", entry_id: entryId, individual_rooms: enabled });
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
