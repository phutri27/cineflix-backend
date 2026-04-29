import { prisma } from "../lib/prisma.js";
import { BookingStatus } from "../generated/prisma/enums.js";

interface BookingProps{
    showtimeId: string
    seats: string[]
    snacks?: {snackId: string, quantity: number}[] 
    vouchers?: {voucherId: string, quantity: number}[]
}

interface DeleteBookingProps{
    showtimeId : string
}

class Booking{
    async insertBooking(data: BookingProps, userId: string){
        const response =await prisma.booking.create({
            data:{
                userId: userId,
                showtimeId: data.showtimeId,
                seats: {
                    connect: data.seats.map((id) => ({id}))
                },
                ...(data.snacks?.length ? {
                    snacks: {
                        createMany: {
                            data: data.snacks.map((snack) => ({
                                snackId: snack.snackId,
                                quantity: snack.quantity
                            }))
                        }
                    }
                } : {}),
                ...(data.vouchers?.length ? {
                    vouchers: {
                        createMany: {
                            data: data.vouchers.map((voucher) => ({
                                voucherId: voucher.voucherId,
                                quantity: voucher.quantity
                            }))
                        }
                    }
                } : {})
            }
        })
        return response
    }

    async getBooking(id: string){
        const booking = await prisma.booking.findUnique({
            where: {
                id: id
            },
            select:{
                id: true,
                user:{
                    select:{
                        id: true,
                        email: true,
                    }
                },
                showtime:{
                    select:{
                        id: true,
                        startTime: true,
                        movie: {
                            select:{
                                posterUrl: true,
                                title: true,
                                rated: true
                            }
                        },
                        screen:{
                            select:{
                                name: true,
                                cinema:{
                                    select:{
                                        name: true
                                    }
                                }
                            }
                        }
                    }
                },
                transaction:{
                    where:{
                        status: "PENDING"
                    }
                },
                seats:{
                    select:{
                        id: true,
                        row: true,
                        number: true
                    }
                },
                vouchers:{
                    select:{
                        voucher:{
                            select:{
                                reduceAmount: true,
                                name: true
                            }
                        },
                        quantity: true
                    }
                },
                snacks:{
                    select:{
                        snack:{
                            select:{
                                name: true,
                                price: true
                            }
                        },
                        quantity: true
                    }
                }
            }
        })
        return booking
    }

    async getBookingStatus(id: string): Promise<{status: BookingStatus} | null> {
        const data = await prisma.booking.findUnique({
            where:{
                id: id
            }, 
            select:{
                status: true
            }
        })
        return data
    }

    async getBookingSeats (id: string){
        const seats = await prisma.booking.findUnique({
            where:{
                id: id
            },
            select:{
                seats:{
                    select:{
                        id: true,
                        row: true,
                        number: true
                    }
                }
            }
        })
        return seats
    }

    async updateBookingStatus(bookingId: string, status: BookingStatus){
        await prisma.booking.update({
            where:{
                id: bookingId
            },
            data:{
                status: status
            }
        })
    }

    async deleteBooking(bookingId: string): Promise<DeleteBookingProps>{
        const response = await prisma.booking.delete({
            where:{
                id: bookingId
            },
            select: {
                showtimeId: true
            }
        })
        return response
    }
}

export const bookingObj = new Booking()