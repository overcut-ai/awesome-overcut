import { Room as TRoom } from "../api/room/Room";

export const ROOM_TITLE_FIELD = "numberField";

export const RoomTitle = (record: TRoom): string => {
  return record.numberField?.toString() || String(record.id);
};
