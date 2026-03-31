import { response } from "express";
import { prisma } from "../lib/prisma";
import { format} from 'date-fns'

export interface TicketResponse{
    id: string
    seat: string
    movie: string
    showtime: string | null
    screen: string
    cinema: string
}
class Ticket{
    async createTicket(seatsId: string[], bookingId: string){
        await prisma.ticket.createManyAndReturn({
            data: seatsId.map((id) => ({
                seatId: id,
                bookingId: bookingId
            }))
        })
    }

    async getTicketInfo(bookingId: string): Promise<TicketResponse[]> {
        const response = await prisma.ticket.findMany({
            where:{
                bookingId: bookingId
            },
            select:{
                id: true,
                seat:{
                    select:{
                        row: true,
                        number: true,
                        seatTypeDetail:{
                            select:{
                                seat_type: true,
                                price: true
                            }
                        }
                    }
                },
                booking:{
                    select:{
                        movie:{
                            select:{
                                title: true,
                            }
                        },
                        showtime:{
                            select:{
                                startTime: true,
                                screen:{
                                    select:{
                                        name: true,
                                        cinema: {
                                            select:{
                                                name: true
                                            }
                                        }
                                    }
                                }
                            }
                        },
                        snacks:{
                            select:{
                                snack:{
                                    select:{
                                        name: true
                                    }
                                },
                                quantity: true
                            }
                        }
                    }
                }
            }
        })

        const tickets = response.map((data) => {
            const startTime = data?.booking.showtime.startTime.toString().replace("Z", "")
            const formattedStartTime = startTime ? format(new Date(startTime), "HH:mm dd/MM/y") : null
            const result = {
                id: data?.id,
                seat: `${data?.seat.row}${data?.seat.number} `,
                movie: data?.booking.movie.title,
                showtime: formattedStartTime,
                screen: data?.booking.showtime.screen.name,
                cinema: data?.booking.showtime.screen.cinema.name
            }
            return result
        })

        return tickets
    }

}

export const ticketObj = new Ticket()