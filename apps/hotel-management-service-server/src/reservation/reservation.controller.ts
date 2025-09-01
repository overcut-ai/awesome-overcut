import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import { ReservationService } from "./reservation.service";
import { ReservationControllerBase } from "./base/reservation.controller.base";

@swagger.ApiTags("reservations")
@common.Controller("reservations")
export class ReservationController extends ReservationControllerBase {
  constructor(protected readonly service: ReservationService) {
    super(service);
  }
}
