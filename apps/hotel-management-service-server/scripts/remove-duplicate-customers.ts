#!/usr/bin/env ts-node

/**
 * One-time migration script that removes duplicate customers that share the same phone number.
 *
 * Strategy:
 * 1. Group by `phoneNumber` to find duplicates (count > 1).
 * 2. For each duplicate set, keep the *earliest* created customer (createdAt ASC) —
 *    Alternatively, you can tweak the `orderBy` to keep the most recently updated.
 * 3. Delete all other customers with the same phone number.
 *
 * Usage:
 *   npm run cleanup:duplicates
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍  Looking for duplicate customers by phone number…");

  // 1) Find phoneNumbers that appear more than once
  const dupPhoneGroups = await prisma.customer.groupBy({
    by: ["phoneNumber"],
    where: {
      phoneNumber: {
        not: null,
      },
    },
    _count: {
      phoneNumber: true,
    },
    having: {
      phoneNumber: {
        _count: {
          gt: 1,
        },
      },
    },
  });

  if (dupPhoneGroups.length === 0) {
    console.log("✅  No duplicates found — nothing to do.");
    return;
  }

  console.log(`⚠️   Found ${dupPhoneGroups.length} phone numbers with duplicates.`);

  let totalRemoved = 0;
  for (const group of dupPhoneGroups) {
    const phoneNumber = group.phoneNumber as string;

    // Fetch all customers with this phone number ordered by createdAt asc
    const customers = await prisma.customer.findMany({
      where: { phoneNumber },
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    if (customers.length <= 1) continue; // should not happen

    const keepCustomerId = customers[0].id; // earliest created
    const removeIds = customers.slice(1).map((c) => c.id);

    // Delete the duplicates (excluding the one we keep)
    const { count } = await prisma.customer.deleteMany({
      where: { id: { in: removeIds } },
    });

    console.log(
      `🗑️   Removed ${count} duplicate customer(s) for phone number ${phoneNumber}. Kept ${keepCustomerId}`
    );
    totalRemoved += count;
  }

  console.log(`\n✨  Duplicate cleanup complete. Total customers removed: ${totalRemoved}`);
}

main()
  .catch((e) => {
    console.error("❌  Error while cleaning duplicates:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
