import { prisma } from "../lib/prisma";

class Ticket{
    async updateSeatTicketPrice(seat_type:string, price: number){
        await prisma.seat.update({
            where: {
                seat_type: seat_type,
                
            }
        })
    }
}