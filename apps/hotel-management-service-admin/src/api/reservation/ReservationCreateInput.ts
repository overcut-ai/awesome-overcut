import { CustomerWhereUniqueInput } from "../customer/CustomerWhereUniqueInput";
import { RoomWhereUniqueInput } from "../room/RoomWhereUniqueInput";

export type ReservationCreateInput = {
  checkIn?: Date | null;
  checkOut?: Date | null;
  customer?: CustomerWhereUniqueInput | null;
  room?: RoomWhereUniqueInput | null;
};
