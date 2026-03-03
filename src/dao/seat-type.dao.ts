import { prisma } from "../lib/prisma";

class SeatType{
    async getSeatDetails(cinemaId: string){
        const ticketsPrice = await prisma.seatTypeDetail.findMany({
            where:{
                cinemaId: cinemaId
            },
            select:{
                price: true,
                seat_type: true
            }
        })

        return ticketsPrice
    }

    async insert(price: number, seat_type: string, cinemaId: string){
        await prisma.seatTypeDetail.create({
            data:{
                price: price,
                seat_type: seat_type,
                cinemaId: cinemaId
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