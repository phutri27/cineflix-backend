import type { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { isValid } from "../utils/password.util";
import { userObj } from "../dao/user.dao";
import { sendEmail } from "../service/OTPMail.service";
import { OTPobj } from "../redis-query/otp-query";
import { genPassword } from "../utils/password.util";
import { resetTokenObj } from "../redis-query/reset-token-query";
import { generateSecureToken } from "../utils/generateToken.util";

export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCred = req.user?.id as string
        const { password } = matchedData(req)

        const user = await userObj.findUserById(userCred)
        const valid = await isValid(password, user?.hashed_password as string)
        if (valid){
            await sendEmail(user?.email as string, userCred)
            return res.status(200).json({
                message: "The OTP has been send to your email. Please check your email!"
            })
        } else{
            return res.status(401).json({
                message: "Wrong password, please try again"
            })
        }
    } catch (error) {
        return next(error)
    }
}

export const getUserEmail = async (req: Request, res: Response, next: NextFunction) => {
    res.locals.userCred = req.body.email
    next()
}

export const getUserId = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.id
    res.locals.userCred = userId
    next()
}

export const confirmOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCred = res.locals.userCred
        const { otp } = matchedData(req)
        const savedOTP = await OTPobj.getOTP(userCred)
        const valid = otp === savedOTP
        if (valid){
            const resetToken = generateSecureToken(32)
            await OTPobj.deleteOTP(userCred)
            await resetTokenObj.saveResetToken(userCred, resetToken)
            return res.status(200).json({
                message: "Success",
                resetToken,
                userCred
            })
        }
        return res.status(401).json({
            message: "Wrong otp, please try again"
        })
    } catch (error) {
        return next(error)
    }
}

export const forgotPassword = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const { email } = matchedData(req)
        await sendEmail(email, email)
        return res.status(200).json({ 
            message: "The OTP has been send to your email. Please check your email!"
        })
    } catch (error) {
        return next(error)
    }
}

export const newPasswordForForgotPassword = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const { email, resetToken } = req.body
        const { pw } = matchedData(req)
        const savedToken = await resetTokenObj.getResetToken(email)
        console.log(savedToken)
        if (!savedToken || resetToken !== savedToken){
            return res.status(401).json({
                message: "Not authorized to do this action"
            })
        }

        const hashed_password = await genPassword(pw) as string
        await userObj.updatePassword({email}, hashed_password)
        await resetTokenObj.delResetToken(email)
        return res.status(200).json({
            message: "Change password successfully"
        })
    } catch (error) {
        return next(error)
    }
}

export const newPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.user?.id as string
        const { resetToken } = req.body
        const { pw } = matchedData(req)
        const savedToken = await resetTokenObj.getResetToken(id)
        if (!savedToken || resetToken !== savedToken){
            return res.status(401).json({
                message: "Not authorized to do this action"
            })
        }
        const hashed_password = await genPassword(pw) as string
        await userObj.updatePassword({id}, hashed_password)
        await resetTokenObj.delResetToken(id)
        return res.status(200).json({
            message: "Change password successfully"
        })
    } catch (error) {
        return next(error)
    }
}