import { Module } from "@nestjs/common";
import { RolesBuilder } from "nest-access-control";

// Simple roles builder placeholder
const rolesBuilder = new RolesBuilder();

@Module({
  providers: [
    {
      provide: RolesBuilder,
      useValue: rolesBuilder,
    },
  ],
  exports: [RolesBuilder],
})
export class ACLModule {}
