import { actorObj } from "../dao/actors.dao";
import type { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";

export const getAllActor = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const actors = await actorObj.getActors()
        return res.status(200).json(actors)
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const insertActor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = matchedData(req)
        await actorObj.insert(name)
        return res.status(201).json({
            message: "Add actor successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const updateActor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const { name } = matchedData(req)
        await actorObj.update(id, name)
        return res.status(201).json({
            message: "Update actor successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
} 

export const deleteActor = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        await actorObj.delete(id)
        return res.status(200).json({
            message: "Delete actor successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}