import { Customer } from "../customer/Customer";
import { Room } from "../room/Room";

export type Reservation = {
  checkIn: Date | null;
  checkOut: Date | null;
  createdAt: Date;
  customer?: Customer | null;
  id: string;
  room?: Room | null;
  updatedAt: Date;
};
