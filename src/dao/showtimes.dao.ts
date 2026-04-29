import { prisma } from "../lib/prisma.js";
import type { CreateShowtimeProp, ShowtimeProp } from "../types/showtime-types.js";
class Showtime {
    async createShowtime(datas: CreateShowtimeProp[]) {
        await prisma.showtime.createMany({
            data: datas.map((data) => ({
                startTime: new Date(data.startTime),
                movieId: data.movieId,
                screenId: data.screenId
            })),
        })
    }

    async getSpecificShowtime(id: string) {
        const showtime = await prisma.showtime.findUnique({
            where: {
                id: id
            },
            select:{
                id: true,
                startTime: true,
                screen: {
                    select: {
                        id:true,
                        name: true,
                        seats: {
                            select: {
                                id: true,
                                row: true,
                                number: true,
                                seat_typeId: true,
                                seatTypeDetail:{
                                    select:{
                                        seat_type: true
                                    }
                                }
                            }
                        },
                        cinema: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
                movie: {
                    select: {
                        id: true,
                        title: true,
                        rated: true,
                        posterUrl: true
                    }
                }
            }
        })

        return showtime
    }

    async getShowtime(movieId: string, screenId: string){
        const showtimes = await prisma.showtime.findMany({
            where: {
                movieId: movieId,
                screenId: screenId,
                isCancelled: false
            },
            orderBy:{
                startTime: 'asc'
            }
        })

        return showtimes
    }

    async getShowtimeByDate(movieId: string, date: Date, cityId: number){
        const endOfDay = new Date(date.setHours(date.getHours()))
        endOfDay.setHours(23, 59, 59, 999);

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (today.getTime() === date.getTime()){
            const now = new Date()
            now.setMinutes(now.getMinutes() - 15)
            date = now 
        }
        const showtimes = await prisma.movie.findUnique({
            where: {
                id: movieId,
            },
            select: {
                cinemas: {
                    where: {
                        cityId: cityId
                    },
                    select: {
                        id: true,
                        name: true,
                        screens: {
                            select: {
                                id: true,
                                name: true,
                                showtimes: {
                                    where: {
                                        AND:[
                                            {startTime: {
                                                gte: new Date(date),
                                                lte: endOfDay
                                            }},
                                            {isCancelled: false},
                                            {movie:{id: movieId}}
                                        ]
                                    },
                                    select: {
                                        id: true,
                                        startTime: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        })
        const result = showtimes?.cinemas.map((cinema) => {
            const allShowtimes = cinema.screens.flatMap((screen) => (
                screen.showtimes.map((st) => ({
                    id: st.id,
                    startTime: st.startTime,
                    screenId: screen.id,
                    screenName: screen.name 
                }))
            ))

            allShowtimes.sort((a, b) => a.startTime.getTime() - b.startTime.getTime())

            return {
                id: cinema.id,
                name: cinema.name,
                showtimes: allShowtimes
            }
        }).filter(cinema => cinema.showtimes.length > 0)

        return result
    }

    async updateShowtime(id: string, data: ShowtimeProp){
        await prisma.showtime.update({
            where:{
                id: id
            }, 
            data:{
                startTime: data.startTime
            }
        })
    }

    async deleteShowTime(id: string){
        await prisma.showtime.update({
            where: {
                id: id
            },
            data:{
                isCancelled: true
            }
        })
    }
}

export const showtimeObj = new Showtime()