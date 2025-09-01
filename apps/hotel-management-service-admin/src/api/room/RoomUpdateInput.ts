import { HotelWhereUniqueInput } from "../hotel/HotelWhereUniqueInput";
import { ReservationUpdateManyWithoutRoomsInput } from "./ReservationUpdateManyWithoutRoomsInput";

export type RoomUpdateInput = {
  floor?: number | null;
  hotel?: HotelWhereUniqueInput | null;
  numberField?: string | null;
  reservations?: ReservationUpdateManyWithoutRoomsInput;
  typeField?: string | null;
};
