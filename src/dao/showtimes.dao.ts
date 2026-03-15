import { prisma } from "../lib/prisma";

export interface ShowtimeProp{
    startTime: Date
    movieId: string
    screenId: string
}

class Showtime {
    async createShowtime(datas: ShowtimeProp[]) {
        await prisma.showtime.createMany({
            data: datas
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

    async updateShowtime(movieId: string, screenId: string,startTime: Date){
        await prisma.showtime.updateMany({
            where: {
                AND:[
                   { movieId: movieId},
                    {screenId: screenId}
                ]
            }, 
            data:{
                startTime: startTime
            }
        })
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