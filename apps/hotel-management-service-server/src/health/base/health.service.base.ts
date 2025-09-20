import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";

@Injectable()
export class HealthServiceBase {
  constructor(protected readonly prisma: PrismaService) {}
  async isDbReady(): Promise<boolean> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      await (this.prisma as any).$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      return false;
    }
  }
}
