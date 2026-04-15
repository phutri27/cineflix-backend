/*
  Warnings:

  - A unique constraint covering the columns `[startTime,screenId,isCancelled]` on the table `Showtime` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Showtime_startTime_screenId_key";

-- CreateIndex
CREATE UNIQUE INDEX "Showtime_startTime_screenId_isCancelled_key" ON "Showtime"("startTime", "screenId", "isCancelled");
