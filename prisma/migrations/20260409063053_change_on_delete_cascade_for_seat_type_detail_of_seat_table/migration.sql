-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_seat_typeId_fkey";

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_seat_typeId_fkey" FOREIGN KEY ("seat_typeId") REFERENCES "SeatTypeDetail"("id") ON DELETE CASCADE ON UPDATE CASCADE;
