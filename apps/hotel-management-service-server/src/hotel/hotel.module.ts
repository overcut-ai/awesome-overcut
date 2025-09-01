import { Module } from "@nestjs/common";
import { HotelModuleBase } from "./base/hotel.module.base";
import { HotelService } from "./hotel.service";
import { HotelController } from "./hotel.controller";
import { HotelResolver } from "./hotel.resolver";

@Module({
  imports: [HotelModuleBase],
  controllers: [HotelController],
  providers: [HotelService, HotelResolver],
  exports: [HotelService],
})
export class HotelModule {}
