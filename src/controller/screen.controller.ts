import { matchedData } from "express-validator";
import { screenObj } from "../dao/screen.dao";
import type { Request, Response, NextFunction } from "express";

export const getScreenByCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cinema_id = req.params.id as string
        const screens = await screenObj.getScreenByCinema(cinema_id)
        return res.status(200).json(screens)
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const insertScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cinema_id = req.params.cinema_id as string
        const { name } = matchedData(req)
        await screenObj.insertScreen(cinema_id, name)
        return res.status(200).json({
            message: "Create screen successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const updateScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const { name } = matchedData(req)
        await screenObj.updateScreen(id, name)
        return res.status(200).json({
            message: "Update screen successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const deleteScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        await screenObj.deleteScreen(id)
        return res.status(200).json({
            message: "Delete screen successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}