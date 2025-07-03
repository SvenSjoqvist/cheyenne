/*
  Warnings:

  - The `creator` column on the `EmailTemplate` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "EmailTemplate" DROP COLUMN "creator",
ADD COLUMN     "creator" TEXT NOT NULL DEFAULT 'USER';

-- DropEnum
DROP TYPE "TemplateCreator";
