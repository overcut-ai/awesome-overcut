/*
 * This file is used to override the generated CustomerUpdateInput with
 * additional validation that will be preserved between Amplication
 * re-generations.
 */
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";
import { CustomerUpdateInput as BaseCustomerUpdateInput } from "./base/CustomerUpdateInput";

@InputType()
export class CustomerUpdateInput extends BaseCustomerUpdateInput {
  @ApiProperty({
    required: false,
    type: String,
  })
  @IsEmail({}, { message: "Invalid email format" })
  @IsOptional()
  @Field(() => String, {
    nullable: true,
  })
  // @ts-ignore – overriding property to apply validation decorators
  override email!: string | null;
}
