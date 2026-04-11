-- DropForeignKey
ALTER TABLE "Showtime" DROP CONSTRAINT "Showtime_movieId_fkey";

-- AddForeignKey
ALTER TABLE "Showtime" ADD CONSTRAINT "Showtime_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "Movie"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
