import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { HotelService } from "./hotel.service";
import { HotelControllerBase } from "./base/hotel.controller.base";

@swagger.ApiTags("hotels")
@common.Controller("hotels")
export class HotelController extends HotelControllerBase {
  constructor(protected readonly service: HotelService) {
    super(service);
  }
}
