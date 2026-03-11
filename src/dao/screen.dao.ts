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
    showtimes: string[]
}
class Screen{
    async getScreenByCinema(cinemaId: string){
        const screens = await prisma.screen.findMany({
            where:{
                cinemaId: cinemaId
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
                },
                showtimes: {
                    connect: data.showtimes.map((id: string) => ({id}))
                }
            }
        })
    }

    async updateScreen(id: string, data: ScreenTypeProp){
        await prisma.screen.update({
            data:{
                name: data.name,
                seats: {
                createMany: { 
                    data : data.seats.map(seat => ({
                            row: seat.row,
                            number: seat.number,
                            seat_typeId: seat.seat_typeId
                    }))
                }
                },
                showtimes: {
                    connect: data.showtimes.map((id: string) => ({id}))
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