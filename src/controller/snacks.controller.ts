import type { Request, Response, NextFunction } from "express";
import { snackObj } from "../dao/snacks.dao";
import { matchedData } from "express-validator";
import { uploadFile, deleteFile } from "../utils/fileupload";

export const getAllSnacks = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const snacks = await snackObj.getAllSnacks()
        return res.status(200).json(snacks)
    } catch (error) {
        return next(error)
    }
}

export const insertSnack = async(req: Request, res: Response, next:NextFunction) =>{
    const filePath = req.file?.path as string
    const {name, price} = matchedData(req)
    const imageUrl:any = await uploadFile(filePath)
    try {
        const snack = await snackObj.insert(name, price, imageUrl.public_id)
        return res.status(200).json({
            snack,
            message: "Success"
        })
    } catch (error) {
        await deleteFile(imageUrl.public_id)
        return next(error)
    }
}

export const updateSnack = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string
    const filePath = req.file?.path as string
    const { name, price} = matchedData(req)
    const imageUrl:any = await uploadFile(filePath)
    try {
        const oldSnack = await snackObj.getSpecficSnacK(id)
        const snack = await snackObj.update(id, name, price, imageUrl.public_id)
        await deleteFile(oldSnack?.imageUrl as string)
        return res.status(200).json({
            message: "Success",
            snack
        })
    } catch (error) {
        await deleteFile(imageUrl.public_id)
        return next(error)
    }
}

export const deleteSnack = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const snack = await snackObj.delete(id)
        await deleteFile(snack.imageUrl as string)
        return res.status(200).json({
            message: "Delete snack successfully",
            snack
        })
    } catch (error) {
        return next(error)
    }
}