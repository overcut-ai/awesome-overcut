import { ReservationWhereInput } from "./ReservationWhereInput";
import { ReservationOrderByInput } from "./ReservationOrderByInput";

export type ReservationFindManyArgs = {
  where?: ReservationWhereInput;
  orderBy?: Array<ReservationOrderByInput>;
  skip?: number;
  take?: number;
};
