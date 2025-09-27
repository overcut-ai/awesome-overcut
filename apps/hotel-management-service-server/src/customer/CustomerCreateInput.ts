import { IsEmail, IsOptional } from "class-validator";
import { CustomerCreateInput as BaseCustomerCreateInput } from "./base/CustomerCreateInput";

export class CustomerCreateInput extends BaseCustomerCreateInput {
  @IsEmail({}, { message: "Invalid email format" })
  @IsOptional()
  override email?: string | null = undefined;
}
