/*
  Warnings:

  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Return" DROP CONSTRAINT "Return_customerEmail_fkey";

-- DropTable
DROP TABLE "Customer";
