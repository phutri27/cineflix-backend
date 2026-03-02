-- CreateTable
CREATE TABLE "_CinemaToMovie" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CinemaToMovie_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CinemaToMovie_B_index" ON "_CinemaToMovie"("B");

-- AddForeignKey
ALTER TABLE "_CinemaToMovie" ADD CONSTRAINT "_CinemaToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "Cinema"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CinemaToMovie" ADD CONSTRAINT "_CinemaToMovie_B_fkey" FOREIGN KEY ("B") REFERENCES "Movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;
