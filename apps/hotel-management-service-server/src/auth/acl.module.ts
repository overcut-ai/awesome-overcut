import { Module } from "@nestjs/common";
import { AccessControlModule } from "nest-access-control";

@Module({
  imports: [AccessControlModule.forRoles({} as any)],
})
export class ACLModule {}
