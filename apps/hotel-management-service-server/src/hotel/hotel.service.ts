import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { HotelServiceBase } from "./base/hotel.service.base";

@Injectable()
export class HotelService extends HotelServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }
}
