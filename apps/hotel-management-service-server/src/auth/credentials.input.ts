import { Field, InputType } from "@nestjs/graphql";

@InputType()
export class CredentialsInput {
  @Field()
  username: string;

  @Field()
  password: string;
}
