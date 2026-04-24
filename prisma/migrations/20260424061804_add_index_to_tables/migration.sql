-- CreateIndex
CREATE INDEX "Booking_userId_showtimeId_idx" ON "Booking"("userId", "showtimeId");

-- CreateIndex
CREATE INDEX "Cinema_cityId_idx" ON "Cinema"("cityId");

-- CreateIndex
CREATE INDEX "Notifications_userId_idx" ON "Notifications"("userId");

-- CreateIndex
CREATE INDEX "Screen_cinemaId_idx" ON "Screen"("cinemaId");

-- CreateIndex
CREATE INDEX "Showtime_screenId_idx" ON "Showtime"("screenId");

-- CreateIndex
CREATE INDEX "Showtime_movieId_startTime_idx" ON "Showtime"("movieId", "startTime");

-- CreateIndex
CREATE INDEX "ThirdParty_userId_idx" ON "ThirdParty"("userId");

-- CreateIndex
CREATE INDEX "Ticket_bookingId_idx" ON "Ticket"("bookingId");

-- CreateIndex
CREATE INDEX "Transaction_bookingId_idx" ON "Transaction"("bookingId");
