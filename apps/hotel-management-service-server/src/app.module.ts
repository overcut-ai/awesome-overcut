import { Module } from "@nestjs/common";
import { HotelModule } from "./hotel/hotel.module";
import { RoomModule } from "./room/room.module";
import { ReservationModule } from "./reservation/reservation.module";
import { CustomerModule } from "./customer/customer.module";
import { HealthModule } from "./health/health.module";
import { PrismaModule } from "./prisma/prisma.module";
import { SecretsManagerModule } from "./providers/secrets/secretsManager.module";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ServeStaticOptionsService } from "./serveStaticOptions.service";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";

@Module({
  controllers: [],
  imports: [
    HotelModule,
    RoomModule,
    ReservationModule,
    CustomerModule,
    HealthModule,
    PrismaModule,
    SecretsManagerModule,
    ConfigModule.forRoot({ isGlobal: true }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const parseBooleanEnv = (value?: string) => value?.toLowerCase() === "true";

        const nodeEnv = configService.get<string>("NODE_ENV");
        const isProduction = nodeEnv?.toLowerCase() === "production";
        const isPlaygroundRequested = parseBooleanEnv(
          configService.get<string>("GRAPHQL_PLAYGROUND")
        );
        const isIntrospectionRequested = parseBooleanEnv(
          configService.get<string>("GRAPHQL_INTROSPECTION")
        );

        return {
          autoSchemaFile: "schema.graphql",
          sortSchema: true,
          playground: !isProduction && isPlaygroundRequested,
          introspection:
            !isProduction && (isPlaygroundRequested || isIntrospectionRequested),
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [],
})
export class AppModule {}
