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
    date.setDate(date.getDate() + 7)
    date.setHours(9, 0, 0, 0)
    let time = 7
    
    while (time > 0) {
        for (const cinema of cinemas){
            for (const screen of cinema.screens){
                const currentScreenDate = new Date(date);
                for (let i = 0; i < cinema.movies.length; i++){
                    const randomMovieIndex = Math.floor(Math.random() * cinema.movies.length)
                    const movie = cinema.movies[randomMovieIndex]
                    await prisma.showtime.create({
                        data:{
                            movieId: movie?.id!,
                            screenId: screen.id,
                            startTime: new Date(currentScreenDate)
                        }
                    })
                    currentScreenDate.setMinutes(currentScreenDate.getMinutes() + movie?.durationMin! + 20)
                }
            }
        }
        date.setDate(date.getDate() + 1)
        time--
    }
}