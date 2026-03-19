import { prisma } from "../lib/prisma";

export interface ShowtimeProp{
    startTime: Date
    screenId: string
    movieId: string;
}

export interface CreateShowtimeProp extends ShowtimeProp{
    movieId: string;
}

class Showtime {
    async createShowtime(datas: CreateShowtimeProp[]) {
        await prisma.showtime.createMany({
            data: datas.map((data) => ({
                startTime: new Date(data.startTime),
                movieId: data.movieId,
                screenId: data.screenId
            })),
            skipDuplicates: true
        })
    }

    async getShowtime(movieId: string, screenId: string){
        const showtimes = await prisma.showtime.findMany({
            where: {
                movieId: movieId,
                screenId: screenId
            },
            orderBy:{
                startTime: 'asc'
            }
        })

        return showtimes
    }

    async getShowtimeByDate(movieId: string, date: Date, cityId: number){
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const showtimes = await prisma.movie.findUnique({
            where: {
                id: movieId
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
                                        startTime: {
                                            gte: new Date(date),
                                            lte: endOfDay
                                        }
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

    async updateShowtime(movieId: string, cinemaId: string, data: ShowtimeProp[]){
        await prisma.$transaction([
            prisma.showtime.deleteMany({
                where: {
                    movieId: movieId,
                    screen: {
                        cinemaId: cinemaId
                    }
                }
            }),
            prisma.showtime.createMany({
                data: data.map((d) => ({
                    movieId: movieId, 
                    screenId: d.screenId,
                    startTime: new Date(d.startTime)
                }))
            })
        ]);
    }

    async deleteShowTime(id: string){
        await prisma.showtime.delete({
            where: {
                id: id
            }
        })
    }
}

export const showtimeObj = new Showtime()