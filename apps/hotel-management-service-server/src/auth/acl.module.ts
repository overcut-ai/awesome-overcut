import { Module } from "@nestjs/common";
import { AccessControlModule, RolesBuilder } from "nest-access-control";

const roles = new RolesBuilder();

@Module({
  imports: [AccessControlModule.forRoles(roles)],
  exports: [AccessControlModule],
})
export class ACLModule {}
