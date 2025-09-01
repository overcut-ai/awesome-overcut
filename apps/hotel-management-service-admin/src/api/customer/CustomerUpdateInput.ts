import { ReservationUpdateManyWithoutCustomersInput } from "./ReservationUpdateManyWithoutCustomersInput";

export type CustomerUpdateInput = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  reservations?: ReservationUpdateManyWithoutCustomersInput;
};
