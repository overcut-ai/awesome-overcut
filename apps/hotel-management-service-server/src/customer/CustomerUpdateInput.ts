import { IsEmail, IsOptional } from "class-validator";
import { CustomerUpdateInput as BaseCustomerUpdateInput } from "./base/CustomerUpdateInput";

export class CustomerUpdateInput extends BaseCustomerUpdateInput {
  @IsEmail({}, { message: "Invalid email format" })
  @IsOptional()
  override email?: string | null = undefined;
}
