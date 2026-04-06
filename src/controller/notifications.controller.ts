import { notiObj } from "../dao/notifications.dao";
import type { Request, Response, NextFunction } from "express";
import { format } from 'date-fns'
import { showtimeObj } from "../dao/showtimes.dao";
import { transactionObj } from "../dao/transaction.dao";
export const createNoti = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const showTimeId = res.locals.showTimeId
        const userId = res.locals.userId
        const transactionId = res.locals.transactionId

        const showTimeInfo = await showtimeObj.getSpecificShowtime(showTimeId)
        const transactioninfo = await transactionObj.getTransactionInfo(transactionId)
        const title = "Booking Confirmed"
        const content = `Your booking for ${showTimeInfo?.movie.title} 

        at ${format(showTimeInfo?.startTime!, "dd/MM/y HH:mm")} with amount of ${transactioninfo?.amount} VND has been confirmed. Enjoy your movie!`
        const noti = await notiObj.createNoti(title, content, userId)

        const io = req.app.get("socketio")
        io.to(userId).emit("new-notification", noti)

        if (res.locals.IpnSuccess){
            const IpnSuccess = res.locals.IpnSuccess
            return res.status(200).json(IpnSuccess)
        }

        return res.status(200).json({ success: true})
    } catch (error) {
        return next(error)
    }
}
export const getUserNotis = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id 
        const { page, limit } = req.query
        const notis = await notiObj.getAllNoti(userId as string, Number(page), Number(limit))
        return res.status(200).json(notis)
    } catch (error) {
        return next(error)
    }
}

export const updateNoti = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notiId  = req.params.id
        const noti = await notiObj.updateNotiStatus(notiId as string)
        const userId = req.user?.id
        const io = req.app.get("socketio")
        io.to(userId).emit("update-notification", noti.id)
        return res.status(200).json({ success: true})
    } catch (error) {
        return next(error)
    }
}

export const deleteNoti = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const notiId = req.params.id
        const noti = await notiObj.deleteNotiQuery(notiId as string)
        const userId = req.user?.id
        const io = req.app.get("socketio")
        io.to(userId).emit("delete-notification", noti.id)
        return res.status(200).json({ success: true})
    } catch (error) {
        return next(error)
    }
}