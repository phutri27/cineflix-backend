import { matchedData } from "express-validator";
import { screenObj } from "../dao/screen.dao";
import type { Request, Response, NextFunction } from "express";
import type { ScreenTypeProp } from "../dao/screen.dao";
export const getScreenByCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { cinema_id, screen_id }= req.query
        if (screen_id){
            const screen = await screenObj.getScreenById(screen_id as string)
            return res.status(200).json(screen)
        }
        const screens = await screenObj.getScreenByCinema(cinema_id as string)
        return res.status(200).json(screens)
    } catch (error) {
        return next(error)
    }
}

export const insertScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: ScreenTypeProp = matchedData(req)
        await screenObj.insertScreen(data)
        return res.status(200).json({
            message: "Create screen successfully"
        })
    } catch (error) {
        return next(error)
    }
}

export const updateScreen = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const data: ScreenTypeProp = matchedData(req)
        await screenObj.updateScreen(id, data)
        return res.status(200).json({
            message: "Update screen successfully"
        })
    } catch (error) {
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
        return next(error)
    }
}