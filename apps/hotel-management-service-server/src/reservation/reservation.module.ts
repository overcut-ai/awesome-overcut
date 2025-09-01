import { Module } from "@nestjs/common";
import { ReservationModuleBase } from "./base/reservation.module.base";
import { ReservationService } from "./reservation.service";
import { ReservationController } from "./reservation.controller";
import { ReservationResolver } from "./reservation.resolver";

@Module({
  imports: [ReservationModuleBase],
  controllers: [ReservationController],
  providers: [ReservationService, ReservationResolver],
  exports: [ReservationService],
})
export class ReservationModule {}
