import { matchedData } from "express-validator";
import { seatTypeObj } from "../dao/seat-type.dao";
import type { Request, Response, NextFunction } from "express";

export const getAllSeatType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cinema_id = req.params.cinema_id as string
        const seatTypes = await seatTypeObj.getSeatDetails(cinema_id)
        return res.status(200).json(seatTypes)
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const insertSeatType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cinema_id = req.params.cinema_id as string
        const { price, seat_type } = matchedData(req)
        await seatTypeObj.insert(Number(price), seat_type, cinema_id)
        return res.status(200).json({
            message: "Create seat type successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
} 

export const updateSeatType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const { price, seat_type} = matchedData(req)
        await seatTypeObj.update(id, Number(price), seat_type)
        return res.status(200).json({
            message: "Update seat type successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const deleteSeatType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        await seatTypeObj.delete(id)
        return res.status(200).json({
            memssage: "Delete seat type successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}