import { HotelWhereUniqueInput } from "../hotel/HotelWhereUniqueInput";
import { ReservationCreateNestedManyWithoutRoomsInput } from "./ReservationCreateNestedManyWithoutRoomsInput";

export type RoomCreateInput = {
  floor?: number | null;
  hotel?: HotelWhereUniqueInput | null;
  numberField?: string | null;
  reservations?: ReservationCreateNestedManyWithoutRoomsInput;
  typeField?: string | null;
};
