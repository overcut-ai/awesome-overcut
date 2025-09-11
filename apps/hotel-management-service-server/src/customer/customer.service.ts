import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";
import { DuplicatePhoneNumberError } from "../errors";
import { CustomerServiceBase } from "./base/customer.service.base";

@Injectable()

export class CustomerService extends CustomerServiceBase {
  constructor(protected readonly prisma: PrismaService) {
    super(prisma);
  }

  async createCustomer(args: Prisma.CustomerCreateArgs) {
    try {
      return await super.createCustomer(args);
    } catch (error) {
      if (
        error &&
        typeof error === "object" &&
        "code" in error &&
        (error as any).code === "P2002"
      ) {
        // Unique constraint violation - map to domain error
        throw new DuplicatePhoneNumberError();
      }
      throw error;
    }
  }
}
