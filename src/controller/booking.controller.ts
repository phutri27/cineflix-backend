import type { Request, Response, NextFunction } from "express";
import { seatLockObj } from "../redis-query/seat-lock-query";
import { bookingObj } from "../dao/booking.dao";
import { matchedData } from "express-validator";

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const { data, seatIds }: {data: any, seatIds: string[]} = matchedData(req)
        seatIds.map(async (seatId) => {
            const result = await seatLockObj.lockSeat(data.showtimeId, seatId, userId)
            if (!result){
                return res.status(409).json({
                    message: `Seat has been taken, please choose another seat`
                })
            } 
        })
        const bookingData = await bookingObj.insertBooking(data, userId)
        const io = req.app.get("socketio")
        io.emit('seats_status', seatIds)
        return res.status(201).json(bookingData)
    } catch (error) {
        next(error)
    }
}

export const getBookingInfo = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { bookingId } = req.query
        const bookingInfo = await bookingObj.getBooking(String(bookingId))
        return res.status(200).json(bookingInfo)
    } catch (error) {
        next(error)
    }
}

export const getAllLockedSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { showTimeId } = req.query 
        const seats = await seatLockObj.getAllLockedSeat(String(showTimeId))
        return res.status(200).json(seats)
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
        const { seatIds }: {seatIds: string[]} = req.body
        const response = await bookingObj.deleteBooking(bookingId)
        seatIds.map(async (seatId) => {
            await seatLockObj.unlockSeat(response.showtimeId, seatId)
        })
        return res.status(200).json({message: "Booking deleted successfully"})
    } catch (error) {
        next(error)
    }
}