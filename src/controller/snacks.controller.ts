import type { Request, Response, NextFunction } from "express";
import { snackObj } from "../dao/snacks.dao";
import { matchedData } from "express-validator";
import { uploadFile } from "../utils/fileupload";

export const getAllSnacks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const snacks = await snackObj.getAllSnacks()
        return res.status(200).json(snacks)
    } catch (error) {
        console.error
        return next(error)
    }
}

export const insertSnack = async(req: Request, res: Response, next:NextFunction) =>{
    try {
        const filePath = req.file?.path as string
        const {name, price} = matchedData(req)
        const imageUrl:any = await uploadFile(filePath)
        const snack = await snackObj.insert(name, price, imageUrl.public_id)
        return res.status(200).json({
            snack,
            message: "Success"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const updateSnack = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const filePath = req.file?.path as string
        const { name, price} = matchedData(req)
        const imageUrl:any = await uploadFile(filePath)
        const snack = await snackObj.update(id, name, price, imageUrl)
        return res.status(200).json({
            message: "Success",
            snack
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const deleteSnack = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const snack = await snackObj.delete(id)
        return res.status(200).json({
            message: "Delete snack successfully",
            snack
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}