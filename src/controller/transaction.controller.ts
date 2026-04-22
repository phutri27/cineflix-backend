import type { Request, Response, NextFunction } from "express";
import { transactionObj } from "../dao/transaction.dao";
import type { BookingInfo } from "../types/booking-types";
export const calculateAmount = async (req: Request, res: Response, next: NextFunction) => {
    const { datas }: {datas: BookingInfo} = req.body
    const totalSeatAmount = datas.seats.reduce((total, seat) => total + parseInt(seat.price), 0)
    const totalSnackAmount = datas.snacks.reduce((total, snack) => total + (snack.price * snack.quantity), 0)
    const totalDiscount = datas.vouchers.reduce((total, voucher) => total + (voucher.reduceAmount * voucher.quantity), 0)
    const totalAmount = (totalSeatAmount + totalSnackAmount) - ((totalDiscount / 100) * (totalSeatAmount + totalSnackAmount))
    res.locals.amount = totalAmount
    next()
}

export const revenueByCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await transactionObj.revenueByCinema()
        return res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const revenueByMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await transactionObj.revenueByMovie()
        return res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}

export const revenueByUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const response = await transactionObj.revenueByUser()
        return res.status(200).json(response)
    } catch (error) {
        next(error)
    }
}