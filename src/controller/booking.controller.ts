import type { Request, Response, NextFunction } from "express";
import { bookingObj } from "../dao/booking.dao";

export const getBookingInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId } = req.query
        const bookingInfo = await bookingObj.getBooking(String(bookingId))
        return res.status(200).json(bookingInfo)
    } catch (error) {
        next(error)
    }
}