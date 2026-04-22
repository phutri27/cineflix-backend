import { matchedData } from "express-validator";
import { seatTypeObj } from "../dao/seat-type.dao";
import type { Request, Response, NextFunction } from "express";
import type { SeatTypeProp } from "../types/seatType-types";
export const getAllSeatType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cinema_id } = req.query
        const seatTypes = await seatTypeObj.getSeatDetails(cinema_id as string)
        return res.status(200).json(seatTypes)
    } catch (error) {
        return next(error)
    }
}

export const insertSeatType = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: SeatTypeProp = matchedData(req)
        await seatTypeObj.insert(data)
        return res.status(200).json({
            message: "Create seat type successfully"
        })
    } catch (error) {
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
        return next(error)
    }
}