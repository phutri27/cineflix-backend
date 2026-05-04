import { prisma } from "../lib/prisma.js";

export const generateShowtime = async () => {
    const cinemas = await prisma.cinema.findMany({
        select:{
            screens:{
                select:{
                    id: true
                }
            },
            movies:{
                select:{
                    id: true,
                    durationMin: true
                }
            }
        }
    })
    const date = new Date()
    date.setDate(date.getDate() + 8)
    date.setHours(9, 0, 0, 0)
    let time = 7
    
    while (time > 0) {
        for (const cinema of cinemas){
            const showtimeData = []
            for (const screen of cinema.screens){
                const currentScreenDate = new Date(date);
                const shuffleMovies = [...cinema.movies].sort(() => Math.random() - 0.5)
                for (const movie of shuffleMovies){
                    if (!movie){
                        continue
                    }
                    showtimeData.push({
                        movieId: movie.id,
                        screenId: screen.id,
                        startTime: new Date(currentScreenDate)
                    })
                    currentScreenDate.setMinutes(currentScreenDate.getMinutes() + movie?.durationMin! + 20)
                }
            }
            await prisma.showtime.createMany({
                data: showtimeData,
                skipDuplicates: true
            })
        }
        date.setDate(date.getDate() + 1)
        time--
    }
}