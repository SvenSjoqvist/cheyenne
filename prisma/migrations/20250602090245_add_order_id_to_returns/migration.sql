/*
  Warnings:

  - Added the required column `orderId` to the `Return` table without a default value. This is not possible if the table is not empty.

*/
-- First add the column as nullable
ALTER TABLE "Return" ADD COLUMN "orderId" TEXT;

-- Update existing records with a default value
UPDATE "Return" SET "orderId" = 'legacy-' || id WHERE "orderId" IS NULL;

-- Make the column non-nullable
ALTER TABLE "Return" ALTER COLUMN "orderId" SET NOT NULL;
