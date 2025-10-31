# Prisma Seed Scripts Audit – Database Connection Handling

Date: 2025-10-31

This audit searches the repository for potential mis-management of `PrismaClient` connections in seed / script files. We looked specifically for:

* `new PrismaClient(` – new client instantiation
* `$disconnect()` – connection teardown

---

## Findings

| # | File Path | Line(s) | Code Snippet | Requires Change? | Recommended Action |
|---|-----------|---------|--------------|------------------|--------------------|
| 1 | `apps/hotel-management-service-server/scripts/seed.ts` | 18-19 | ```ts
const client = new PrismaClient();
void client.$disconnect();
``` | **Yes** | • Move `$disconnect()` into a `finally` block and `await` it.<br/>• Prefer passing a shared `PrismaClient` instance to `customSeed()` instead of creating separate instances.<br/>• Await `customSeed()` if it becomes async. |
| 2 | `apps/hotel-management-service-server/scripts/customSeed.ts` | 4-6 | ```ts
const client = new PrismaClient();

client.$disconnect();
``` | **Yes** | • Accept a `PrismaClient` parameter rather than creating a new one.<br/>• Ensure the caller handles cleanup in `finally` with `await client.$disconnect()`. |

No other occurrences of `PrismaClient` instantiation or `$disconnect()` were found in the repository at the time of this audit.

---

## Summary
Both seed scripts create their own `PrismaClient` instance and call `$disconnect()` without awaiting the returned promise. This risks the Node.js process exiting before the connection is cleanly closed, possibly causing connection leaks.

**Refactor Plan (to be implemented in subsequent phases):**

1. Instantiate a single `PrismaClient` in `seed.ts`.
2. Wrap all seeding logic in `try { … } finally { await client.$disconnect(); }`.
3. Pass the shared client into `customSeed()` (update its signature accordingly).
4. Use `process.on('beforeExit')` as a secondary safeguard if desired.

This document will serve as reference for Phase 2 refactoring work.
