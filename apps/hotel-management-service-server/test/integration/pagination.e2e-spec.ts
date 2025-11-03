import request from "supertest";
import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import { AppModule } from "../../../src/app.module";
import { PrismaService } from "../../../src/prisma/prisma.service";
import { applyPaginationDefaults, MAX_PAGE_SIZE } from "../../../src/pagination";
import { PrismaClient } from "@prisma/client";

// NOTE: These e2e tests spin up the NestJS app with an in-memory SQLite DB (via Prisma)
// for isolation. Adjust the datasource provider/environment if needed.

describe("Pagination limits (e2e)", () => {
  let app: INestApplication;
  let prisma: PrismaClient;

  beforeAll(async () => {
    // Override DB connection to sqlite for tests
    process.env.DB_URL = "file:./test.db?connection_limit=1";

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(new PrismaService())
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();

    prisma = new PrismaClient({ datasources: { db: { url: process.env.DB_URL } } });

    // Seed with > MAX_PAGE_SIZE records for each model to test limits
    await seedData(MAX_PAGE_SIZE + 20);
  });

  afterAll(async () => {
    await prisma.$executeRawUnsafe(`PRAGMA wal_checkpoint(FULL);`);
    await prisma.$disconnect();
    await app.close();
  });

  async function seedData(count: number) {
    // Hotels
    const hotelsData = Array.from({ length: count }).map((_, i) => ({
      name: `Hotel ${i}`,
      address: `Street ${i}`,
      description: `Desc ${i}`,
    }));

    await prisma.hotel.createMany({ data: hotelsData });

    // Customers
    const customersData = Array.from({ length: count }).map((_, i) => ({
      firstName: `First${i}`,
      lastName: `Last${i}`,
      email: `email${i}@example.com`,
    }));
    await prisma.customer.createMany({ data: customersData });

    // Rooms
    const roomsData = Array.from({ length: count }).map((_, i) => ({
      floor: Math.floor(i / 10),
      numberField: `${100 + i}`,
      typeField: "STANDARD",
    }));
    await prisma.room.createMany({ data: roomsData });

    // Reservations
    const reservationData = Array.from({ length: count }).map((_, i) => ({
      checkIn: new Date(),
      checkOut: new Date(),
    }));
    await prisma.reservation.createMany({ data: reservationData });
  }

  const endpoints = [
    { path: "/hotels", key: "hotels" },
    { path: "/customers", key: "customers" },
    { path: "/rooms", key: "rooms" },
    { path: "/reservations", key: "reservations" },
  ];

  endpoints.forEach(({ path, key }) => {
    describe(`${key} list`, () => {
      it(`GET ${path} with no take`, async () => {
        const res = await request(app.getHttpServer()).get(path);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeLessThanOrEqual(MAX_PAGE_SIZE);
      });

      it(`GET ${path}?take=150 limited`, async () => {
        const res = await request(app.getHttpServer()).get(path).query({ take: 150 });
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(MAX_PAGE_SIZE);
      });

      it(`GET ${path}?take=20 returns 20`, async () => {
        const res = await request(app.getHttpServer()).get(path).query({ take: 20 });
        expect(res.status).toBe(200);
        expect(res.body.length).toBe(20);
      });
    });
  });
});
