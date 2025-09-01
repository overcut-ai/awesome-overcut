import { HotelWhereUniqueInput } from "./HotelWhereUniqueInput";
import { HotelUpdateInput } from "./HotelUpdateInput";

export type UpdateHotelArgs = {
  where: HotelWhereUniqueInput;
  data: HotelUpdateInput;
};
