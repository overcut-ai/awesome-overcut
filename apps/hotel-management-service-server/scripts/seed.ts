import * as dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import { customSeed } from "./customSeed";

// Single PrismaClient instance for the whole script
const client = new PrismaClient();

// Extra safety: ensure disconnect on process exit
process.on("beforeExit", async () => {
  await client.$disconnect();
});

if (require.main === module) {
  dotenv.config();

  const { BCRYPT_SALT } = process.env;

  if (!BCRYPT_SALT) {
    throw new Error("BCRYPT_SALT environment variable must be defined");
  }

  // Execute the seed when run directly
  seed().catch((err) => {
    console.error("Failed to seed database", err);
    process.exit(1);
  });
}

async function seed() {
  console.info("Seeding database...");

  try {
    console.info("Seeding database with custom seed...");
    await customSeed(client);

    console.info("Seeded database successfully");
  } finally {
    // Always disconnect, even if seeding throws
    await client.$disconnect();
  }
}
