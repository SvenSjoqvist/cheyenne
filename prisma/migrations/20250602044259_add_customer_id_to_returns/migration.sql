/*
  Warnings:

  - Added the required column `customerId` to the `Return` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column as nullable
ALTER TABLE "Return" ADD COLUMN "customerId" TEXT;

-- Update existing records with a default value
UPDATE "Return" SET "customerId" = 'legacy-' || id WHERE "customerId" IS NULL;

-- Make the column non-nullable
ALTER TABLE "Return" ALTER COLUMN "customerId" SET NOT NULL;
