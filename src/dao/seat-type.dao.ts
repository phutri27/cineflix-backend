import { prisma } from "../lib/prisma";

export interface SeatTypeProp{
    price: number,
    seat_type: string,
    cinemaId: string
}

class SeatType{
    async getSeatDetails(cinemaId: string){
        const ticketsPrice = await prisma.seatTypeDetail.findMany({
            where:{
                cinemaId: cinemaId
            },
            select:{
                id: true,
                price: true,
                seat_type: true
            },
            orderBy:{
                createdAt: 'desc'
            }
        })

        return ticketsPrice
    }

    async insert(data: SeatTypeProp){
        await prisma.seatTypeDetail.create({
            data:{
                price: Number(data.price),
                seat_type: data.seat_type,
                cinemaId: data.cinemaId
            }
        })
    }

    async update(id: string, price: number, seat_type: string){
        await prisma.seatTypeDetail.update({
            data:{
                price: price,
                seat_type: seat_type
            },
            where:{
                id: id
            }
        })
    }

    async delete(id: string){
        await prisma.seatTypeDetail.delete({
            where:{
                id: id
            }
        })
    }
}

export const seatTypeObj = new SeatType() 