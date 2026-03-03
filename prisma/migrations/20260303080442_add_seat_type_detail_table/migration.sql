/*
  Warnings:

  - You are about to drop the column `seat_type` on the `Seat` table. All the data in the column will be lost.
  - You are about to drop the column `price` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `seat_typeId` to the `Seat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Seat" DROP COLUMN "seat_type",
ADD COLUMN     "seat_typeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "price";

-- CreateTable
CREATE TABLE "SeatTypeDetail" (
    "id" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "seat_type" TEXT NOT NULL,
    "cinemaId" TEXT NOT NULL,

    CONSTRAINT "SeatTypeDetail_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SeatTypeDetail_seat_type_cinemaId_key" ON "SeatTypeDetail"("seat_type", "cinemaId");

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_seat_typeId_fkey" FOREIGN KEY ("seat_typeId") REFERENCES "SeatTypeDetail"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SeatTypeDetail" ADD CONSTRAINT "SeatTypeDetail_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE CASCADE;
