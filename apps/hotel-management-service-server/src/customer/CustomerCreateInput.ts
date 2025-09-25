/*
 * This file is used to override the generated CustomerCreateInput with
 * additional validation that will be preserved between Amplication
 * re-generations.
 */
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsOptional } from "class-validator";
// suppress override duplication error for typescript <5 when using override
//
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CustomerCreateInput as BaseCustomerCreateInput } from "./base/CustomerCreateInput";

@InputType()
export class CustomerCreateInput extends BaseCustomerCreateInput {
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
