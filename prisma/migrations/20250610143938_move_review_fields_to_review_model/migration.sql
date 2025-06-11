/*
  Warnings:

  - You are about to drop the column `customerName` on the `ReviewItem` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `ReviewItem` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `ReviewItem` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `ReviewItem` table. All the data in the column will be lost.
  - Added the required column `customerName` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `Review` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Review` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "customerName" TEXT NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "ReviewItem" DROP COLUMN "customerName",
DROP COLUMN "description",
DROP COLUMN "rating",
DROP COLUMN "title";
