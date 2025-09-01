import { HotelWhereInput } from "./HotelWhereInput";
import { HotelOrderByInput } from "./HotelOrderByInput";

export type HotelFindManyArgs = {
  where?: HotelWhereInput;
  orderBy?: Array<HotelOrderByInput>;
  skip?: number;
  take?: number;
};
