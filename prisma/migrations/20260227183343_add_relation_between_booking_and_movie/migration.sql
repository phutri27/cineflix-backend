/*
  Warnings:

  - Added the required column `movieId` to the `Booking` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "movieId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
