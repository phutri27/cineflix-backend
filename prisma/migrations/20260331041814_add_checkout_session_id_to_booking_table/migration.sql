/*
  Warnings:

  - A unique constraint covering the columns `[checkoutSessionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "checkoutSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_checkoutSessionId_key" ON "Booking"("checkoutSessionId");
