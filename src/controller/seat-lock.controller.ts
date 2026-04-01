import type { Request, Response, NextFunction} from 'express'
import { seatLockObj } from '../redis-query/seat-lock-query'
export const seatLock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seatIds, showTimeId }: {seatIds: string[], showTimeId: string} = req.body
        const userId = req.user?.id as string
        for (const seatId of seatIds) {
            const result = await seatLockObj.lockSeat(showTimeId, seatId, userId);     
            if (!result) {
                return res.status(400).json({
                    message: `Seat has been taken, please choose another seat`
                });
            }
        }
        const io = req.app.get("socketio")
        io.emit('seats_status', seatIds)
        if (res.locals.redirectUrl){
            const redirectUrl = res.locals.redirectUrl
            return res.status(200).json({redirectUrl})
        } else if (res.locals.vnpayPaymentUrl && res.locals.paymentData) {
            const paymentUrl = res.locals.vnpayPaymentUrl
            const data = res.locals.paymentData
            return res.status(200).json({
                success: true,
                paymentUrl,
                data,
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