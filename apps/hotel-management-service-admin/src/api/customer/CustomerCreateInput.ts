import { ReservationCreateNestedManyWithoutCustomersInput } from "./ReservationCreateNestedManyWithoutCustomersInput";

export type CustomerCreateInput = {
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phoneNumber?: string | null;
  reservations?: ReservationCreateNestedManyWithoutCustomersInput;
};
