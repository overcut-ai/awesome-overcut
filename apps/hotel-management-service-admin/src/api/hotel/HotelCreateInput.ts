import { RoomCreateNestedManyWithoutHotelsInput } from "./RoomCreateNestedManyWithoutHotelsInput";

export type HotelCreateInput = {
  address?: string | null;
  description?: string | null;
  name?: string | null;
  rooms?: RoomCreateNestedManyWithoutHotelsInput;
};
