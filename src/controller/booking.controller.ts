import type { Request, Response, NextFunction } from "express";
import { seatLockObj } from "../redis-query/seat-lock-query";
import { bookingObj, type BookingProps } from "../dao/booking.dao";
import { matchedData } from "express-validator";
import { match } from "node:assert";
export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const { data, seatIds }: {data: BookingProps, seatIds: string[]} = matchedData(req)
        await Promise.all(seatIds.map((seatId) => seatLockObj.lockSeat(data.showtimeId, seatId, userId)))
        await bookingObj.insertBooking(data, userId)
        return res.status(201).json({message: "Booking created successfully"})
    } catch (error) {
        next(error)
    }
}

export const updateBookingStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = req.params.id as string
        const { status } = matchedData(req)
        await bookingObj.updateBookingStatus(bookingId, status)
        return res.status(200).json({message: "Booking status updated successfully"})
    } catch (error) {
        next(error)
    }
}

export const deleteBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const bookingId = req.params.id as string
        await bookingObj.deleteBooking(bookingId)
        return res.status(200).json({message: "Booking deleted successfully"})
    } catch (error) {
        next(error)
    }
}