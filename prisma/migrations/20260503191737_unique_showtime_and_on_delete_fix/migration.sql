-- DropForeignKey
ALTER TABLE "BookingSnack" DROP CONSTRAINT "BookingSnack_snackId_fkey";

-- DropForeignKey
ALTER TABLE "Cinema" DROP CONSTRAINT "Cinema_cityId_fkey";

-- DropForeignKey
ALTER TABLE "Showtime" DROP CONSTRAINT "Showtime_screenId_fkey";

-- AddForeignKey
ALTER TABLE "Cinema" ADD CONSTRAINT "Cinema_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "City"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_screenId_fkey" FOREIGN KEY ("screenId") REFERENCES "Screen"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSnack" ADD CONSTRAINT "BookingSnack_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "Snack"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
