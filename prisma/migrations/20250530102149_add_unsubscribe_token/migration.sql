/*
  Warnings:

  - A unique constraint covering the columns `[unsubscribeToken]` on the table `Subscriber` will be added. If there are existing duplicate values, this will fail.
  - The required column `unsubscribeToken` was added to the `Subscriber` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "Subscriber" ADD COLUMN     "unsubscribeToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Subscriber_unsubscribeToken_key" ON "Subscriber"("unsubscribeToken");
