/*
  Warnings:

  - Added the required column `posterPublicId` to the `Movie` table without a default value. This is not possible if the table is not empty.
  - Added the required column `imagePublicId` to the `Snack` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Movie" ADD COLUMN     "posterPublicId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Snack" ADD COLUMN     "imagePublicId" TEXT NOT NULL;
