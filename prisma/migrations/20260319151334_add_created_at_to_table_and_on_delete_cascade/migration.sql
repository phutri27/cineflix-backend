-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Booking" DROP CONSTRAINT "Booking_showtimeId_fkey";

-- DropForeignKey
ALTER TABLE "Cinema" DROP CONSTRAINT "Cinema_cityId_fkey";

-- DropForeignKey
ALTER TABLE "Screen" DROP CONSTRAINT "Screen_cinemaId_fkey";

-- DropForeignKey
ALTER TABLE "Seat" DROP CONSTRAINT "Seat_seat_typeId_fkey";

-- DropForeignKey
ALTER TABLE "Showtime" DROP CONSTRAINT "Showtime_movieId_fkey";

-- DropForeignKey
ALTER TABLE "Showtime" DROP CONSTRAINT "Showtime_screenId_fkey";

-- AlterTable
ALTER TABLE "Actor" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Cinema" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Director" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Screen" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SeatTypeDetail" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Showtime" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Snack" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Voucher" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AddForeignKey
ALTER TABLE "Cinema" ADD CONSTRAINT "Cinema_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Screen" ADD CONSTRAINT "Screen_cinemaId_fkey" FOREIGN KEY ("cinemaId") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Seat" ADD CONSTRAINT "Seat_seat_typeId_fkey" FOREIGN KEY ("seat_typeId") REFERENCES "SeatTypeDetail"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Booking" ADD CONSTRAINT "Booking_showtimeId_fkey" FOREIGN KEY ("showtimeId") REFERENCES "Showtime"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
