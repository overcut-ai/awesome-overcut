import { IntNullableFilter } from "../../util/IntNullableFilter";
import { HotelWhereUniqueInput } from "../hotel/HotelWhereUniqueInput";
import { StringFilter } from "../../util/StringFilter";
import { StringNullableFilter } from "../../util/StringNullableFilter";
import { ReservationListRelationFilter } from "../reservation/ReservationListRelationFilter";

export type RoomWhereInput = {
  floor?: IntNullableFilter;
  hotel?: HotelWhereUniqueInput;
  id?: StringFilter;
  numberField?: StringNullableFilter;
  reservations?: ReservationListRelationFilter;
  typeField?: StringNullableFilter;
};
