import type { Request, Response, NextFunction} from 'express'
import { seatLockObj } from '../redis-query/seat-lock-query'
import type { BookingObj } from './transaction.controller'
export const seatLock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { datas }: {datas: BookingObj} = req.body
        const bookingId = res.locals.bookingId
        const seatIds = datas.seats.map((seat) => seat.seat_id)
        for (const seatId of seatIds) {
            const result = await seatLockObj.lockSeat(datas.showtimeId, seatId, bookingId);     
            const value = await seatLockObj.getLockSeatValue(datas.showtimeId, seatId)
            if (!result && value !== bookingId) {
                return res.status(400).json({seatTaken: true});
            }
        }
        const io = req.app.get("socketio")
        io.emit('seats_status', seatIds)
        if (res.locals.redirectUrl){
            const redirectUrl = res.locals.redirectUrl
            return res.status(200).json({redirectUrl, bookingId})
        } else if (res.locals.vnpayPaymentUrl) {
            const paymentUrl = res.locals.vnpayPaymentUrl
            return res.status(200).json({
                success: true,
                paymentUrl,
                bookingId
            });
        }
    } catch (error) {
        next(error)
    }
}

export const unlockSeat  = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seatIds, showTimeId }: {seatIds: string[], showTimeId: string} = req.body
        for (const seatId of seatIds){
            await seatLockObj.unlockSeat(showTimeId, seatId)
        }
        return res.status(200).json({ success: true })
    } catch (error) {
        next(error)
    }
}