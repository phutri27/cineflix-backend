import type { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { profileObj } from "../dao/profile.dao.js";
import { isValid } from "../utils/password.util.js";
import { userObj } from "../dao/user.dao.js";
import { sendEmail } from "../service/mail.js";
import { OTPobj } from "../redis-query/otp-query.js";
import { genPassword } from "../utils/password.util.js";
import { resetTokenObj } from "../redis-query/reset-token-query.js";
import { generateSecureToken } from "../service/generateToken.js";

export const getCustomerProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const profile = await profileObj.getProfile(userId)
        res.status(200).json(profile)
    } catch (error) {
        console.error(error)
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
        console.error(error)
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
        console.error(error)
        return next(error)
    }
}

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const { password } = matchedData(req)

        const user = await userObj.findUserById(userId)
        const valid = await isValid(password, user?.hashed_password as string)
        if (valid){
            await sendEmail(user?.email as string, userId)
            return res.status(200).json({
                message: "The OTP has been send to your email. Please check your email!"
            })
        } else{
            return res.status(401).json({
                message: "Wrong password, please try again"
            })
        }
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const confirmOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const { otp } = matchedData(req)
        const savedOTP = await OTPobj.getOTP(userId)
        const valid = otp === savedOTP
        if (valid){
            const resetToken = generateSecureToken(32)

            await OTPobj.deleteOTP(userId)
            await resetTokenObj.saveResetToken(userId, resetToken)
            return res.status(200).json({
                message: "Success",
                resetToken
            })
        }
        return res.status(401).json({
            message: "Wrong otp, please try again"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const newPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user?.id as string
        const { resetToken } = req.body
    
        const { pw } = matchedData(req)
        const savedToken = await resetTokenObj.getResetToken(userId)
        if (!savedToken || resetToken !== savedToken){
            return res.status(401).json({
                message: "Not authorized to do this action"
            })
        }

        const hashed_password = await genPassword(pw) as string
        await userObj.updatePassword(userId, hashed_password)
        await resetTokenObj.delResetToken(userId)
        return res.status(200).json({
            message: "Change password successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}