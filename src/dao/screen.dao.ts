import type { Seat } from "../../generated/prisma/client";
import { prisma } from "../lib/prisma";

type SeatType = {
    row: string
    number: number
    seat_typeId: string
}

export interface ScreenTypeProp {
    name: string
    cinema_id: string
    seats: SeatType[]
}
class Screen{
    async getScreenByCinema(cinemaId: string){
        const screens = await prisma.screen.findMany({
            where:{
                cinemaId: cinemaId
            },
            orderBy:{
                createdAt: 'desc'
            },
            include:{
                showtimes: {
                    where:{
                        isCancelled: false
                    },
                    select:{
                        id: true,
                        startTime: true,
                        movie:{
                            select:{
                                id: true
                            }
                        }
                    }
                }
            }
        })

        return screens
    }

    async getScreenById(screenId: string){
        const screen = await prisma.screen.findUnique({
            where:{
                id: screenId
            },
            include:{
                seats: true,
                cinema: {
                    select:{
                        name: true
                    }
                }
            }
        })
        return screen
    }

    async getScreenByMovie(cinemaId: string, movieId: string){
        const screens = await prisma.screen.findMany({
            where:{
                AND: [
                    {
                        cinemaId: cinemaId
                    },
                    {
                        showtimes: {
                            some: {
                                movieId: movieId,
                                isCancelled: false
                            }
                        }
                    }
                ]
            },
            include:{
                showtimes: {
                    where: {
                        movieId: movieId,
                        isCancelled: false
                    },
                    orderBy:{
                        startTime: "asc"
                    }
                }
            }
        })
        return screens
    }

    async insertScreen(data: ScreenTypeProp){
        await prisma.screen.create({
            data:{
                cinemaId: data.cinema_id,
                name: data.name,
                seats: {
                    createMany: { 
                        data : data.seats.map(seat => ({
                            row: seat.row,
                            number: seat.number,
                            seat_typeId: seat.seat_typeId
                        }))
                    }
                }
            }
        })
    }

    async updateScreen(id: string, data: ScreenTypeProp){
        await prisma.screen.update({
            data:{
                name: data.name,
                seats: {
                deleteMany: {},
                createMany: { 
                    data : data.seats.map(seat => ({
                            row: seat.row,
                            number: seat.number,
                            seat_typeId: seat.seat_typeId
                    }))
                }
                }
            },
            where:{
                id: id
            }
        })
    }

    async deleteScreen(id: string){
        await prisma.screen.delete({
            where:{
                id: id
            }
        })
    }
}

export const screenObj = new Screen()