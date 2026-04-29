import { directorObj } from "../dao/directors.dao.js";
import type { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";

export const getAllDirector = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const directors = await directorObj.getDirectors()
        return res.status(200).json(directors)
    } catch (error) {
        return next(error)
    }
}

export const insertDirector = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = matchedData(req)
        await directorObj.insert(name)
        return res.status(200).json({
            message: "Add director successfully"
        })
    } catch (error) {
        return next(error)
    }
}

export const updateDirector = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const { name } = matchedData(req)
        await directorObj.update(id, name)
        return res.status(200).json({
            message: "Update director successfully"
        })
    } catch (error) {
        return next(error)
    }
} 

export const deleteDirector = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        await directorObj.delete(id)
        return res.status(200).json({
            message: "Delete director successfully"
        })
    } catch (error) {
        return next(error)
    }
}