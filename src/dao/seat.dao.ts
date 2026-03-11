import { prisma } from "../lib/prisma";

export interface SeatsProp {
    row: string
    number: number
    seat_typeId: string
    screenId: string,
}
class Seat{
    async getAllSeatOfScreen(screenId: string){
        const seats = await prisma.seat.findMany({
            where:{
                screenId: screenId
            }
        })

        return seats
    }

    async insertSeat(data: SeatsProp){
        await prisma.seat.create({
            data:{
                row: data.row,
                seat_typeId: data.seat_typeId,
                number: data.number,
                screenId: data.screenId,
            }
        })
    }

    async updateSeat(id: string, seat_typeId: string, number: number){
        await prisma.seat.update({
            where:{
                id: id
            },
            data:{
                seat_typeId: seat_typeId,
                number: number
            }
        })
    }

    async deleteSeat(id: string){
        await prisma.seat.delete({
            where:{
                id: id
            }
        })
    }
}

export const seatObj = new Seat()