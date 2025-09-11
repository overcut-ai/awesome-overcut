-- Prisma Migrate Migration SQL
-- Generated at 2025-09-11 11:35 UTC
-- Add unique constraint to phoneNumber in Customer

-- Ensure no duplicates exist before adding constraint (example)
-- DELETE FROM "Customer" c1 USING "Customer" c2
-- WHERE c1."id" <> c2."id" AND c1."phoneNumber" IS NOT NULL AND c1."phoneNumber" = c2."phoneNumber";

ALTER TABLE "Customer"
ADD CONSTRAINT "Customer_phoneNumber_key" UNIQUE ("phoneNumber");

-- Make phoneNumber non-nullable now that duplicates are removed
ALTER TABLE "Customer"
ALTER COLUMN "phoneNumber" SET NOT NULL;
