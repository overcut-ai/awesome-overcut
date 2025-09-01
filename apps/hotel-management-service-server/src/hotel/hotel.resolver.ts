import * as graphql from "@nestjs/graphql";
import { HotelResolverBase } from "./base/hotel.resolver.base";
import { Hotel } from "./base/Hotel";
import { HotelService } from "./hotel.service";

@graphql.Resolver(() => Hotel)
export class HotelResolver extends HotelResolverBase {
  constructor(protected readonly service: HotelService) {
    super(service);
  }
}
