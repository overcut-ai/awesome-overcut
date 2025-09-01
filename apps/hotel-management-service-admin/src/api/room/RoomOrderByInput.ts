import { SortOrder } from "../../util/SortOrder";

export type RoomOrderByInput = {
  createdAt?: SortOrder;
  floor?: SortOrder;
  hotelId?: SortOrder;
  id?: SortOrder;
  numberField?: SortOrder;
  typeField?: SortOrder;
  updatedAt?: SortOrder;
};
