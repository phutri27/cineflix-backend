import { prisma } from "../lib/prisma";

class Seat{
    async getAllSeatOfScreen(screenId: string){
        const seats = await prisma.seat.findMany({
            where:{
                screenId: screenId
            }
        })

        return seats
    }

    async insertSeat(row: string, seat_typeId: string, number: number, screenId: string){
        await prisma.seat.create({
            data:{
                row: row,
                seat_typeId: seat_typeId,
                number: number,
                screenId: screenId
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