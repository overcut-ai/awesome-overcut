import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { HotelServiceBase } from "./base/hotel.service.base";
import { applyPaginationDefaults } from "../pagination";
import { Prisma, Hotel as PrismaHotel } from "@prisma/client";

@Injectable()
export class HotelService extends HotelServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async hotels<T extends Prisma.HotelFindManyArgs>(
    args: T
  ): Promise<PrismaHotel[]> {
    return super.hotels(applyPaginationDefaults(args));
  }
}
