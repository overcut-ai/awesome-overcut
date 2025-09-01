import { StringNullableFilter } from "../../util/StringNullableFilter";
import { StringFilter } from "../../util/StringFilter";
import { RoomListRelationFilter } from "../room/RoomListRelationFilter";

export type HotelWhereInput = {
  address?: StringNullableFilter;
  description?: StringNullableFilter;
  id?: StringFilter;
  name?: StringNullableFilter;
  phone?: StringNullableFilter;
  rooms?: RoomListRelationFilter;
};
