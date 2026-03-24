import { prisma } from "../lib/prisma";
import { BookingStatus } from "../../generated/prisma/enums";
import { stat } from "node:fs";
export interface BookingProps{
    movieId: string
    showtimeId: string
    totalAmount: number
    snacks?: {snackId: string, quantity: number}[] 
    vouchers?: {voucherId: string, quantity: number}[] 
}

class Booking{
    async insertBooking(data: BookingProps, userId: string){
        await prisma.booking.create({
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

    async deleteBooking(bookingId: string){
        await prisma.booking.delete({
            where:{
                id: bookingId
            }
        })
    }
}

export const bookingObj = new Booking()