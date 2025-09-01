import { RoomUpdateManyWithoutHotelsInput } from "./RoomUpdateManyWithoutHotelsInput";

export type HotelUpdateInput = {
  address?: string | null;
  description?: string | null;
  name?: string | null;
  rooms?: RoomUpdateManyWithoutHotelsInput;
};
