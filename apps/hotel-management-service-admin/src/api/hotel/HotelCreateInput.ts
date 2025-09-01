import { RoomCreateNestedManyWithoutHotelsInput } from "./RoomCreateNestedManyWithoutHotelsInput";

export type HotelCreateInput = {
  address?: string | null;
  description?: string | null;
  name?: string | null;
  phone?: string | null;
  rooms?: RoomCreateNestedManyWithoutHotelsInput;
};
