import type { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { isValid } from "../utils/password.util.js";
import { userObj } from "../dao/user.dao.js";
import { sendEmail } from "../service/mail.js";
import { OTPobj } from "../redis-query/otp-query.js";
import { genPassword } from "../utils/password.util.js";
import { resetTokenObj } from "../redis-query/reset-token-query.js";
import { generateSecureToken } from "../service/generateToken.js";

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
        console.error(error)
        return next(error)
    }
}

export const confirmOtp = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCred = req.user?.id as string || req.body.email
        const { otp } = matchedData(req)
        const savedOTP = await OTPobj.getOTP(userCred)
        const valid = otp === savedOTP
        if (valid){
            const resetToken = generateSecureToken(32)

            await OTPobj.deleteOTP(userCred)
            await resetTokenObj.saveResetToken(userCred, resetToken)
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

export const forgotPassword = async (req: Request, res:Response, next: NextFunction) => {
    try {
        const { email } = matchedData(req)
        await sendEmail(email, email)
        return res.status(200).json({ 
            message: "The OTP has been send to your email. Please check your email!"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const newPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCred = req.user?.id as string || req.body.email
        const { resetToken } = req.body
    
        const { pw } = matchedData(req)
        const savedToken = await resetTokenObj.getResetToken(userCred)
        if (!savedToken || resetToken !== savedToken){
            return res.status(401).json({
                message: "Not authorized to do this action"
            })
        }

        const hashed_password = await genPassword(pw) as string
        let cred: any = {id: req.user?.id}
        if (req.body.email){
            cred = {email: req.body.email}
        }
        await userObj.updatePassword(cred, hashed_password)
        await resetTokenObj.delResetToken(userCred)
        return res.status(200).json({
            message: "Change password successfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}