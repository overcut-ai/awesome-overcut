import { Test } from "@nestjs/testing";
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler,
  ValidationPipe,
} from "@nestjs/common";
import request from "supertest";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../auth/defaultAuth.guard";
import { ACLModule } from "../auth/acl.module";
import { AclFilterResponseInterceptor } from "../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../interceptors/aclValidateRequest.interceptor";
import { map } from "rxjs";
import { CustomerController } from "./customer.controller";
import { CustomerService } from "./customer.service";

// Stubs and helpers copied from base spec
const service = {
  createCustomer() {
    return {};
  },
  updateCustomer() {
    return {};
  },
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const req = argumentHost.getRequest();
    req.user = {
      roles: ["user"],
    };
    return true;
  },
};

const acGuard = {
  canActivate: () => true,
};

const aclFilterResponseInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map((data) => data)
    );
  },
};

const aclValidateRequestInterceptor = {
  intercept: (_: ExecutionContext, next: CallHandler) => next.handle(),
};

describe("Customer Email Validation", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: CustomerService,
          useValue: service,
        },
      ],
      controllers: [CustomerController],
      imports: [ACLModule],
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .overrideInterceptor(AclFilterResponseInterceptor)
      .useValue(aclFilterResponseInterceptor)
      .overrideInterceptor(AclValidateRequestInterceptor)
      .useValue(aclValidateRequestInterceptor)
      .compile();

    app = moduleRef.createNestApplication();
    // Use real validation pipe to trigger DTO validation
    app.useGlobalPipes(
      new ValidationPipe({
        transform: true,
        forbidUnknownValues: false,
      })
    );
    await app.init();
  });

  const INVALID_EMAIL_PAYLOAD = {
    firstName: "John",
    lastName: "Doe",
    phoneNumber: "1234567890",
    email: "not-an-email",
  };

  it("POST /customers with invalid email should return 400", async () => {
    await request(app.getHttpServer())
      .post("/customers")
      .send(INVALID_EMAIL_PAYLOAD)
      .expect(HttpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toEqual(
          expect.arrayContaining([expect.stringContaining("Invalid email format")])
        );
      });
  });

  it("PATCH /customers/:id with invalid email should return 400", async () => {
    await request(app.getHttpServer())
      .patch("/customers/exampleId")
      .send({ email: "not-an-email" })
      .expect(HttpStatus.BAD_REQUEST)
      .expect((res) => {
        expect(res.body.message).toEqual(
          expect.arrayContaining([expect.stringContaining("Invalid email format")])
        );
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
