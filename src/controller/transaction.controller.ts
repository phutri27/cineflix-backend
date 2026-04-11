import type { Request, Response, NextFunction } from "express";
import { bookingObj } from "../dao/booking.dao";
import { transactionObj } from "../dao/transaction.dao";
import { seatLockObj } from "../redis-query/seat-lock-query";

export interface PricingDetailProp {
    id: string
    seat_id: string
    price: string
    seat_type: string
    row: string
    number: number
}

export interface SnackData {
    snackId: string
    price: number
    quantity: number
}

export interface VoucherData {
    voucherId: string
    reduceAmount: number
    quantity: number
}

export interface BookingObj {
    movieId: string | undefined
    showtimeId: string
    seats: PricingDetailProp[]
    snacks: SnackData[]
    vouchers: VoucherData[]
    bookingId: string
}

export const calculateAmount = async (req: Request, res: Response, next: NextFunction) => {
    const { datas }: {datas: BookingObj} = req.body
    const totalSeatAmount = datas.seats.reduce((total, seat) => total + parseInt(seat.price), 0)
    const totalSnackAmount = datas.snacks.reduce((total, snack) => total + (snack.price * snack.quantity), 0)
    const totalDiscount = datas.vouchers.reduce((total, voucher) => total + (voucher.reduceAmount * voucher.quantity), 0)
    const totalAmount = (totalSeatAmount + totalSnackAmount) - ((totalDiscount / 100) * (totalSeatAmount + totalSnackAmount))
    res.locals.amount = totalAmount
    next()
}
