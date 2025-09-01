import { Hotel } from "../hotel/Hotel";
import { Reservation } from "../reservation/Reservation";

export type Room = {
  createdAt: Date;
  floor: number | null;
  hotel?: Hotel | null;
  id: string;
  numberField: string | null;
  reservations?: Array<Reservation>;
  typeField: string | null;
  updatedAt: Date;
};
