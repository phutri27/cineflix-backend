import type { Request, Response, NextFunction} from 'express'
import { seatLockObj } from '../redis-query/seat-lock-query'
export const seatLock = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { seatIds, showTimeId }: {seatIds: string[], showTimeId: string} = req.body
        const userId = req.user?.id as string
        seatIds.map(async (seatId) => {
            const result = await seatLockObj.lockSeat(showTimeId, seatId, userId)
            if (!result) {
                return res.status(400).json({message: "This seat has been taken, please choose another seat"})
            }
        })
        const io = req.app.get("socketio")
        io.emit('seats_status', seatIds)
        const redirectUrl = res.locals.redirectUrl
        return res.status(200).json({redirectUrl})
    } catch (error) {
        next(error)
    }
}