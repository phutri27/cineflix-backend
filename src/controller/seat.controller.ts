import { seatObj } from "../dao/seat.dao";
import { matchedData } from "express-validator";
import type { Request, Response, NextFunction } from "express";

export const getAllSeatOfScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const screen_id = req.params.screen_id as string
        const seats = await seatObj.getAllSeatOfScreen(screen_id)
        return res.status(200).json(seats)
    } catch (error) {
        return next(error)
    }
}

export const insertSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const screen_id = req.params.screen_id as string
        const {row, seat_type, number } = matchedData(req)
        await seatObj.insertSeat(row, seat_type, Number(number), screen_id)
        return res.status(200).json({
            message: "Create seat successfully"
        })
    } catch (error) {
        return next(error)
    }
}


export const updateSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const { seat_type, number} = matchedData(req)
        await seatObj.updateSeat(id, seat_type, Number(number))
        return res.status(200).json({
            message: "Update seat successfully"
        })
    } catch (error) {
        return next(error)
    }
}

export const deleteSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        await seatObj.deleteSeat(id)
        return res.status(200).json({
            message: "Delete seat successfully"
        })
    } catch (error) {
        return next(error)
    }
}