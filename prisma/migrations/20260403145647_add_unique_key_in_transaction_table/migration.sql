/*
  Warnings:

  - A unique constraint covering the columns `[bookingId,status]` on the table `Transaction` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Transaction_bookingId_status_key" ON "Transaction"("bookingId", "status");
