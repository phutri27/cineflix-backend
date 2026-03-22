import type { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { profileObj } from "../dao/profile.dao.js";
import { isValid } from "../utils/password.util.js";
import bcrypt from 'bcrypt'

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
        const { password, first_name, last_name } = matchedData(req)
        const userHashedpassword = await profileObj.getPasswordByUserId(userId)
        const valid = await isValid(password, userHashedpassword as string)
        if (!valid){
            return res.status(400).json({
                message: "Incorrect password"
            })
        }
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
