import { ValidationPipe } from "@nestjs/common";
import { HttpAdapterHost, NestFactory } from "@nestjs/core";
import { OpenAPIObject, SwaggerModule } from "@nestjs/swagger";
import { HttpExceptionFilter } from "./filters/HttpExceptions.filter";
import { AppModule } from "./app.module";
import { connectMicroservices } from "./connectMicroservices";
import {
  swaggerPath,
  swaggerDocumentOptions,
  swaggerSetupOptions,
} from "./swagger";

const { PORT = 3000 } = process.env;

async function main() {
  // Configure CORS to allow credentials and specific origins
  const corsOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(",")
    : true;

  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: corsOrigins,
      credentials: true,
    },
  });

  // Enable security headers via helmet including a strict Content Security Policy
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const helmet = (await import("helmet")).default;
  app.use(
    helmet({
      // Disable the default CSP so we can configure our own below
      contentSecurityPolicy: false,
    })
  );
  // Apply a minimal CSP allowing resources only from self
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const { contentSecurityPolicy } = await import("helmet");
  app.use(
    contentSecurityPolicy({
      directives: {
        defaultSrc: ["'self'"],
        objectSrc: ["'none'"],
        baseUri: ["'self'"],
        scriptSrc: ["'self'"]
      },
    })
  );

  // Enable cookie parsing for inbound requests
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const cookieParser = (await import("cookie-parser")).default;
  app.use(cookieParser());

  // Attach Authorization header from accessToken cookie when header is missing
  app.use((req, _res, next) => {
    if (!req.headers["authorization"] && req.cookies?.accessToken) {
      req.headers["authorization"] = `Bearer ${req.cookies.accessToken}`;
    }
    next();
  });

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
    })
  );

  const document = SwaggerModule.createDocument(app, swaggerDocumentOptions);

  /** check if there is Public decorator for each path (action) and its method (findMany / findOne) on each controller */
  Object.values((document as OpenAPIObject).paths).forEach((path: any) => {
    Object.values(path).forEach((method: any) => {
      if (
        Array.isArray(method.security) &&
        method.security.includes("isPublic")
      ) {
        method.security = [];
      }
    });
  });

  await connectMicroservices(app);
  await app.startAllMicroservices();

  SwaggerModule.setup(swaggerPath, app, document, swaggerSetupOptions);

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new HttpExceptionFilter(httpAdapter));

  void app.listen(PORT);

  return app;
}

module.exports = main();
