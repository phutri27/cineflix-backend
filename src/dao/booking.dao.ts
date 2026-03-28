import { prisma } from "../lib/prisma";
import { BookingStatus } from "../../generated/prisma/enums";
import { stat } from "node:fs";

interface BookingProps{
    movieId: string
    showtimeId: string
    totalAmount: number
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
                movieId: data.movieId,
                showtimeId: data.showtimeId,
                totalAmount: data.totalAmount,
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
                userId: true,
                movie:{
                    select:{
                        posterUrl: true,
                        title: true,
                        rated: true
                    }
                },
                showtime:{
                    select:{
                        startTime: true,
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
                totalAmount: true,
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