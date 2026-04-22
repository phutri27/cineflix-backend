import { prisma } from "../lib/prisma";
import { format} from 'date-fns'
import type { TicketResponse } from "../types/ticket-types";

class Ticket{
    async createTicket(seatsId: string[], bookingId: string){
        await prisma.ticket.createMany({
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
                        showtime:{
                            select:{
                                movie:{
                                    select:{
                                        title: true
                                    }
                                },
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
            const startTime = data?.booking.showtime.startTime
            const formattedStartTime = startTime ? format(startTime, "HH:mm dd/MM/y") : null
            const result = {
                id: data?.id,
                seat: `${data?.seat.row}${data?.seat.number} `,
                movie: data?.booking.showtime.movie.title,
                showtime: formattedStartTime,
                screen: data?.booking.showtime.screen.name,
                cinema: data?.booking.showtime.screen.cinema.name
            }
            return result
        })

        return tickets
    }
    
    async getPaidTicket(bookingId: string) {
        const response = await prisma.ticket.count({
            where:{
                bookingId: bookingId
            },
        })

        return response
    }

    async insertTicketUrl(id: string, url: string){
        await prisma.ticket.update({
            where:{
                id: id
            },
            data:{
                ticketUrl: url
            }
        })
    }
}

export const ticketObj = new Ticket()