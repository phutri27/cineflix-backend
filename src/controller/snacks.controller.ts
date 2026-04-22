import type { Request, Response, NextFunction } from "express";
import { snackObj } from "../dao/snacks.dao";
import { matchedData } from "express-validator";
import { uploadFile, deleteFile } from "../utils/cloudinary-file.util";
import type { SnackType } from "../types/snack-types";

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
    const data = matchedData(req)
    const imageUrl:any = await uploadFile(filePath, "snack_images")
    Object.assign(data, {imageUrl: imageUrl.secure_url, imagePublicId: imageUrl.public_id})
    try {
        const snack = await snackObj.insert(data as SnackType)
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
    const data = matchedData(req)
    const oldSnack = await snackObj.getSpecficSnacK(id)
    let imageUrl: any
    if (filePath) {
        imageUrl = await uploadFile(filePath, "snack_images")
        Object.assign(data, {imageUrl: imageUrl.secure_url, imagePublicId: imageUrl.public_id})
    } else  {
        Object.assign(data, {imageUrl: oldSnack?.imageUrl, imagePublicId: oldSnack?.imagePublicId})
    }
    try {
        const snack = await snackObj.update(id, data as SnackType)
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