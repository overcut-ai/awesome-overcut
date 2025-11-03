import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { RoomServiceBase } from "./base/room.service.base";
import { applyPaginationDefaults } from "../pagination";
import { Prisma, Room as PrismaRoom } from "@prisma/client";

@Injectable()
export class RoomService extends RoomServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async rooms<T extends Prisma.RoomFindManyArgs>(
    args: T
  ): Promise<PrismaRoom[]> {
    return super.rooms(applyPaginationDefaults(args));
  }
}
