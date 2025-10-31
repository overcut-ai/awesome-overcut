import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CustomerServiceBase } from "./base/customer.service.base";
import { applyPaginationDefaults } from "../pagination";
import { Prisma, Customer as PrismaCustomer } from "@prisma/client";

@Injectable()
export class CustomerService extends CustomerServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async customers<T extends Prisma.CustomerFindManyArgs>(
    args: T
  ): Promise<PrismaCustomer[]> {
    return super.customers(applyPaginationDefaults(args));
  }
}
