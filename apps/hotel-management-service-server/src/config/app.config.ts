import { registerAs } from "@nestjs/config";
import * as Joi from "joi";

export type DatabaseConfig = {
  url: string;
  user: string;
  password: string;
  name: string;
  port: number;
};

export type CryptoConfig = {
  bcryptSalt: string;
};

export type ServerConfig = {
  port: number;
  composeProjectName: string;
};

export const databaseConfig = registerAs(
  "database",
  (): DatabaseConfig => ({
    url: process.env.DB_URL as string,
    user: process.env.DB_USER as string,
    password: process.env.DB_PASSWORD as string,
    name: process.env.DB_NAME as string,
    port: Number(process.env.DB_PORT),
  })
);

export const cryptoConfig = registerAs(
  "crypto",
  (): CryptoConfig => ({
    bcryptSalt: process.env.BCRYPT_SALT as string,
  })
);

export const serverConfig = registerAs(
  "server",
  (): ServerConfig => ({
    port: Number(process.env.PORT),
    composeProjectName: process.env.COMPOSE_PROJECT_NAME as string,
  })
);

export const appConfigValidationSchema = Joi.object({
  BCRYPT_SALT: Joi.string().required(),
  DB_URL: Joi.string().uri().required(),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_NAME: Joi.string().required(),
  DB_PORT: Joi.number().port().required(),
  PORT: Joi.number().port().required(),
  COMPOSE_PROJECT_NAME: Joi.string().required(),
});
