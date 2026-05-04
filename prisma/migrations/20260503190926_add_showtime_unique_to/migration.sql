/*
  Warnings:

  - A unique constraint covering the columns `[screenId,startTime]` on the table `Showtime` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Showtime_screenId_startTime_key" ON "Showtime"("screenId", "startTime");
