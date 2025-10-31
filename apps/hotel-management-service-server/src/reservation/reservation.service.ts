import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { ReservationServiceBase } from "./base/reservation.service.base";
import { applyPaginationDefaults } from "../pagination";
import { Prisma, Reservation as PrismaReservation } from "@prisma/client";

@Injectable()
export class ReservationService extends ReservationServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async reservations<T extends Prisma.ReservationFindManyArgs>(
    args: T
  ): Promise<PrismaReservation[]> {
    return super.reservations(applyPaginationDefaults(args));
  }
}
