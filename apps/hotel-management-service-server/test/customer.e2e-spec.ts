import { INestApplication, ValidationPipe } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import * as request from "supertest";
import { CustomerController } from "../src/customer/customer.controller";
import { CustomerService } from "../src/customer/customer.service";

// Create a mocked CustomerService so we don't hit the database
const customerServiceMock = {
  createCustomer: jest.fn(),
  updateCustomer: jest.fn(),
  customers: jest.fn(),
  customer: jest.fn(),
  deleteCustomer: jest.fn(),
  findReservations: jest.fn(),
};

describe("CustomerController (e2e) - Email Validation", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: customerServiceMock,
        },
      ],
    }).compile();

    app = moduleRef.createNestApplication();
    // Apply global validation pipe as in main.ts
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      })
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it("POST /customers with invalid email should return 400", async () => {
    await request(app.getHttpServer())
      .post("/customers")
      .send({ email: "foo" })
      .expect(400)
      .expect((res) => {
        expect(Array.isArray(res.body.message)).toBe(true);
        // message array should contain 'Invalid email format'
        const combined = res.body.message.join(" ");
        expect(combined).toMatch(/Invalid email format/);
      });
  });

  it("PATCH /customers/1 with invalid email should return 400", async () => {
    await request(app.getHttpServer())
      .patch("/customers/1")
      .send({ email: "foo" })
      .expect(400)
      .expect((res) => {
        expect(Array.isArray(res.body.message)).toBe(true);
        const combined = res.body.message.join(" ");
        expect(combined).toMatch(/Invalid email format/);
      });
  });
});
