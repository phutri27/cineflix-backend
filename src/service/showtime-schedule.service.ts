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
                    durationMin: true,
                    premiereDate: true
                }
            }
        }
    })

    const date = new Date()
    date.setDate(date.getDate() + 15)
    date.setHours(9, 0, 0, 0)
    
    for (const cinema of cinemas){
        const showtimeData = []
        for (const screen of cinema.screens){
            const currentScreenDate = new Date(date);
            const shuffleMovies = [...cinema.movies].sort(() => Math.random() - 0.5).filter((movie) => movie.premiereDate <= currentScreenDate)
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
}
