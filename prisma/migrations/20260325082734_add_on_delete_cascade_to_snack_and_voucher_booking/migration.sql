-- DropForeignKey
ALTER TABLE "BookingSnack" DROP CONSTRAINT "BookingSnack_bookingId_fkey";

-- DropForeignKey
ALTER TABLE "BookingSnack" DROP CONSTRAINT "BookingSnack_snackId_fkey";

-- AddForeignKey
ALTER TABLE "BookingSnack" ADD CONSTRAINT "BookingSnack_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BookingSnack" ADD CONSTRAINT "BookingSnack_snackId_fkey" FOREIGN KEY ("snackId") REFERENCES "Snack"("id") ON DELETE CASCADE ON UPDATE CASCADE;
