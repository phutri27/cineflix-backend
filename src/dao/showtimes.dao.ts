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
            }
        })

        return showtimes
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