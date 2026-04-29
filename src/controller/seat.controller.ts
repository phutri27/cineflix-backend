import { seatObj } from "../dao/seat.dao.js";
import { matchedData } from "express-validator";
import type { Request, Response, NextFunction } from "express";
import type { SeatsProp } from "../types/seats-types.js";

export const getAllSeatOfScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {screen_id} = req.params
        const seats = await seatObj.getAllSeatOfScreen(screen_id as string)
        return res.status(200).json(seats)
    } catch (error) {
        return next(error)
    }
}

export const insertSeat = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: SeatsProp = matchedData(req)
        await seatObj.insertSeat(data)
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
        const { seat_typeId, number} = matchedData(req)
        await seatObj.updateSeat(id, seat_typeId, Number(number))
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