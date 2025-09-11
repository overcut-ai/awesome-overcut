import { mock } from "jest-mock-extended";
import { PrismaService } from "../prisma/prisma.service";
import { CustomerService } from "./customer.service";
import { DuplicatePhoneNumberError } from "../errors";
import { Prisma } from "@prisma/client";

describe("CustomerService - createCustomer", () => {
  const prismaError: Prisma.PrismaClientKnownRequestError = {
    clientVersion: "5.x",
    code: "P2002",
    meta: { target: ["phoneNumber"] },
    name: "PrismaClientKnownRequestError",
    message: "Unique constraint failed on the fields: (phoneNumber)",
    stack: undefined,
  } as unknown as Prisma.PrismaClientKnownRequestError;

  let prismaService: PrismaService;
  let service: CustomerService;

  beforeEach(() => {
    prismaService = mock<PrismaService>();
    // Force TypeScript to treat mock as any to assign .customer
    (prismaService as any).customer = {
      create: jest
        .fn()
        .mockResolvedValueOnce({ id: "id1" })
        .mockRejectedValueOnce(prismaError),
    };

    service = new CustomerService(prismaService);
  });

  it("should create first customer successfully and throw DuplicatePhoneNumberError on second attempt", async () => {
    await expect(service.createCustomer({} as any)).resolves.toEqual({ id: "id1" });
    await expect(
      service.createCustomer({} as any)
    ).rejects.toBeInstanceOf(DuplicatePhoneNumberError);
  });
});
