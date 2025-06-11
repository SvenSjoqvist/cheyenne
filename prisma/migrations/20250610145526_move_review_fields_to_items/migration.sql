/*
  Warnings:

  - You are about to drop the column `description` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `rating` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Review` table. All the data in the column will be lost.
  - Added the required column `description` to the `ReviewItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rating` to the `ReviewItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `ReviewItem` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "description",
DROP COLUMN "rating",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "ReviewItem" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "rating" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
