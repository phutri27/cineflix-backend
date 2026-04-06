import type { Decimal } from "@prisma/client/runtime/client";
import { prisma } from "../lib/prisma";
import { TransactionStatus } from "../../generated/prisma/enums";
import { paymentObj } from "../redis-query/payment-query";
import type { PricingDetailProp } from "../controller/transaction.controller";

interface BookingProps{
    id: string,
    showtimeId: string
    seats: PricingDetailProp[]
    snacks?: {snackId: string, quantity: number}[] 
    vouchers?: {voucherId: string, quantity: number}[]
}

interface TransactionProps{
    id: string
    bookingId: string
    provider:string
    providerTransactionId: string
    amount: Decimal
}

class Transaction{
    async createTransactionAndBooking(booking: BookingProps, transaction: TransactionProps,userId: string){
        const seats = booking.seats
        const seatIds = seats.map((seat) => seat.seat_id)
        await prisma.$transaction([
            prisma.booking.create({
                data:{
                    id: booking.id,
                    userId: userId,
                    showtimeId: booking.showtimeId,
                    seats: {
                        connect: seatIds.map((id) => ({id}))
                    },
                    ...(booking.snacks?.length ? {
                    snacks: {
                        createMany: {
                            data: booking.snacks.map((snack) => ({
                                snackId: snack.snackId,
                                quantity: snack.quantity
                            }))
                        }
                    }} : {}),
                    ...(booking.vouchers?.length ? {
                        vouchers: {
                            createMany: {
                                data: booking.vouchers.map((voucher) => ({
                                    voucherId: voucher.voucherId,
                                    quantity: voucher.quantity
                                }))
                            }
                        }
                    } : {})
                }
            }),
                prisma.transaction.create({
            data:{
                id: transaction.id,
                bookingId: transaction.bookingId,
                provider: transaction.provider,
                providerTransactionId: transaction.providerTransactionId,
                amount: transaction.amount
            }
        })
        ])

    }

    async createTransaction(transaction: TransactionProps){
        await prisma.transaction.create({
            data:{
                id: transaction.id,
                bookingId: transaction.bookingId,
                provider: transaction.provider,
                providerTransactionId: transaction.providerTransactionId,
                amount: transaction.amount
            }
        })
    }
    
    async updateTransactionSuccess(transactionId: string, bookingId: string){
        await prisma.$transaction([
            prisma.transaction.update({
                where:{
                    id: transactionId
                },
                data:{
                    status: "SUCCESS"
                }
            }),
            prisma.booking.update({
                where:{
                    id: bookingId
                },
                data:{
                    status: "PAID"
                }
            })
        ])

        const pendingTransactionId = await prisma.transaction.findMany({
            where:{
                bookingId: bookingId,
                NOT:{
                    id:transactionId
                },
                status: "PENDING",
            },
            select:{
                providerTransactionId: true
            }
        })

        const transactionIds = pendingTransactionId.map((transaction) => transaction.providerTransactionId)
        for (const id of transactionIds){
            await paymentObj.deleteCheckoutSession(id!)
        }
    }

    async updateTransactionStatus(transactionId: string, status: TransactionStatus){
        await prisma.transaction.update({
            where:{
                id: transactionId
            },
            data:{
                status: status
            }
        })
    }

    async getTransactionInfo(transactionId: string){
        const response = await prisma.transaction.findUnique({
            where:{
                id: transactionId
            },
            include:{
                booking: {
                    select:{
                        showtimeId: true,
                        user:{
                            select:{
                                id: true,
                                email: true
                            }
                        },
                        seats:{
                            select:{
                                id:true
                            }
                        }
                    }
                }
            }
        })
        return response
    }

    async getCancelTransaction(sessionId: string){
        const response = await prisma.transaction.findFirst({
            where:{
                providerTransactionId: sessionId
            },
            include:{
                booking:{
                    select:{
                        status: true,
                        showtimeId: true,
                        seats:{
                            select:{
                                id: true,
                            }
                        }
                    }
                }
            }
        })
        return response
    }
}

export const transactionObj = new Transaction()