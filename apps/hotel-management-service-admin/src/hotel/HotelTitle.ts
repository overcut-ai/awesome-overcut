import { Hotel as THotel } from "../api/hotel/Hotel";

export const HOTEL_TITLE_FIELD = "name";

export const HotelTitle = (record: THotel): string => {
  return record.name?.toString() || String(record.id);
};
