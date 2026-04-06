import type { Request, Response, NextFunction } from "express";
import { seatLockObj } from "../redis-query/seat-lock-query";
import { bookingObj } from "../dao/booking.dao";
import { matchedData } from "express-validator";

export const getBookingInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId } = req.query
        const bookingInfo = await bookingObj.getBooking(String(bookingId))
        return res.status(200).json(bookingInfo)
    } catch (error) {
        next(error)
    }
}