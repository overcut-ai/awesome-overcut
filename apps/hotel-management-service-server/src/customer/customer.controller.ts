import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { Request } from "express";
import { plainToClass } from "class-transformer";
import { ApiNestedQuery } from "../decorators/api-nested-query.decorator";
import { CustomerService } from "./customer.service";
import { CustomerControllerBase } from "./base/customer.controller.base";

// Override DTOs with email validation
import { CustomerCreateInput } from "./CustomerCreateInput";
import { CustomerUpdateInput } from "./CustomerUpdateInput";

import { Customer } from "./base/Customer";
import { CustomerFindManyArgs } from "./base/CustomerFindManyArgs";
import { CustomerWhereUniqueInput } from "./base/CustomerWhereUniqueInput";
import { ReservationFindManyArgs } from "../reservation/base/ReservationFindManyArgs";
import { Reservation } from "../reservation/base/Reservation";
import { ReservationWhereUniqueInput } from "../reservation/base/ReservationWhereUniqueInput";
import * as errors from "../errors";
import { isRecordNotFoundError } from "../prisma.util";

@swagger.ApiTags("customers")
@common.Controller("customers")
export class CustomerController extends CustomerControllerBase {
  constructor(protected readonly service: CustomerService) {
    super(service);
  }

  // Override: use validated DTO for create
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Customer })
  async createCustomer(
    @common.Body() data: CustomerCreateInput
  ): Promise<Customer> {
    return await this.service.createCustomer({
      data: data,
      select: {
        createdAt: true,
        email: true,
        firstName: true,
        id: true,
        lastName: true,
        phoneNumber: true,
        updatedAt: true,
      },
    });
  }

  // The following methods delegate to base implementation but are re-declared here to avoid using generated DTOs where needed.

  @common.Patch(":id")
  @swagger.ApiOkResponse({ type: Customer })
  @swagger.ApiNotFoundResponse({ type: errors.NotFoundException })
  async updateCustomer(
    @common.Param() params: CustomerWhereUniqueInput,
    @common.Body() data: CustomerUpdateInput
  ): Promise<Customer | null> {
    try {
      return await this.service.updateCustomer({
        where: params,
        data: data,
        select: {
          createdAt: true,
          email: true,
          firstName: true,
          id: true,
          lastName: true,
          phoneNumber: true,
          updatedAt: true,
        },
      });
    } catch (error) {
      if (isRecordNotFoundError(error)) {
        throw new errors.NotFoundException(
          `No resource was found for ${JSON.stringify(params)}`
        );
      }
      throw error;
    }
  }

  // The rest of the endpoints fall back to base class implementations.
}
