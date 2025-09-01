import { SortOrder } from "../../util/SortOrder";

export type ReservationOrderByInput = {
  checkIn?: SortOrder;
  checkOut?: SortOrder;
  createdAt?: SortOrder;
  customerId?: SortOrder;
  id?: SortOrder;
  roomId?: SortOrder;
  updatedAt?: SortOrder;
};
