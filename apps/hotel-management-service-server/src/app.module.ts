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
import * as Joi from "joi";
import {
  cryptoConfig,
  databaseConfig,
  serverConfig,
} from "./config/app.config";

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
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, cryptoConfig, serverConfig],
      validationSchema: Joi.object({
        BCRYPT_SALT: Joi.string().required(),
        DB_URL: Joi.string().uri().required(),
        DB_USER: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        DB_PORT: Joi.number().port().required(),
        PORT: Joi.number().port().required(),
        COMPOSE_PROJECT_NAME: Joi.string().required(),
      }),
    }),
    ServeStaticModule.forRootAsync({
      useClass: ServeStaticOptionsService,
    }),
    GraphQLModule.forRootAsync<ApolloDriverConfig>({
      driver: ApolloDriver,
      useFactory: (configService: ConfigService) => {
        const playground = configService.get("GRAPHQL_PLAYGROUND");
        const introspection = configService.get("GRAPHQL_INTROSPECTION");
        return {
          autoSchemaFile: "schema.graphql",
          sortSchema: true,
          playground,
          introspection: playground || introspection,
        };
      },
      inject: [ConfigService],
      imports: [ConfigModule],
    }),
  ],
  providers: [],
})
export class AppModule {}
