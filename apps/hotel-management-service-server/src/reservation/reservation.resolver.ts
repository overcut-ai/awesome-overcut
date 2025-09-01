import * as graphql from "@nestjs/graphql";
import { ReservationResolverBase } from "./base/reservation.resolver.base";
import { Reservation } from "./base/Reservation";
import { ReservationService } from "./reservation.service";

@graphql.Resolver(() => Reservation)
export class ReservationResolver extends ReservationResolverBase {
  constructor(protected readonly service: ReservationService) {
    super(service);
  }
}
