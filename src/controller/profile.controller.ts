import type { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { profileObj } from "../dao/profile.dao.js";

export const getCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const profile = await profileObj.getProfile(userId)
        res.status(200).json(profile)
    } catch (error) {
        return next(error)
    }
}

export const editCustomerProfile = async( req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const { first_name, last_name } = matchedData(req)
        const newProfile = await profileObj.editProfile(userId, first_name, last_name)
        return res.status(200).json({
            message: "Success",
            profile: newProfile
        })
    } catch (error) {
        return next(error)
    }
}

export const getBookingHistory = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const userId = req.user?.id as string
        const page = Number(req.params.page)
        const bookingHistory = await profileObj.getBookingHistory(userId, page)
        return res.status(200).json(bookingHistory)
    } catch (error){
        return next(error)
    }
}
