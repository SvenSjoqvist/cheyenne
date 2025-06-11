/*
  Warnings:

  - Added the required column `customerName` to the `ReviewItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `ReviewItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `ReviewItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ReviewItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ReviewItem" ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
