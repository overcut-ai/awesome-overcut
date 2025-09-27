import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { CustomerService } from "./customer.service";
import { CustomerControllerBase } from "./base/customer.controller.base";
// Import override DTOs
import { CustomerCreateInput } from "./CustomerCreateInput";
import { CustomerUpdateInput } from "./CustomerUpdateInput";
import { Customer } from "./base/Customer";

@swagger.ApiTags("customers")
@common.Controller("customers")
export class CustomerController extends CustomerControllerBase {
  constructor(protected readonly service: CustomerService) {
    super(service);
  }

  // Override create endpoint to use validated DTO
  @common.Post()
  @swagger.ApiCreatedResponse({ type: Customer })
  async createCustomer(@common.Body() data: CustomerCreateInput): Promise<Customer> {
    // Delegate to base implementation
    return super.createCustomer(data);
  }

  // Override update endpoint to use validated DTO
  @common.Patch(":id")
  @swagger.ApiOkResponse({ type: Customer })
  async updateCustomer(
    @common.Param("id") id: string,
    @common.Body() data: CustomerUpdateInput
  ): Promise<Customer | null> {
    return super.updateCustomer({ id }, data);
  }
}
