import type { NextFunction, Request, Response } from "express";
import { genPassword } from "../utils/password.util";
import { userObj } from "../dao/user.dao";
import { matchedData } from "express-validator";
import { profileObj } from "../dao/profile.dao";
import { signupObj } from "../redis-query/signup-query";
import { sendEmail } from "../service/OTPMail.service";
import { OTPobj } from "../redis-query/otp-query";

export const signupPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, pw, first_name, last_name } = matchedData(req)
        const hashed_password = await genPassword(pw) as string
        await signupObj.saveSignupInfo(email, hashed_password, first_name, last_name)
        await sendEmail(email, email)
        return res.status(200).json({
            message: "Please check your email, an OTP is need to complete the signup"
        })
    } catch (error) {
        next(error)
    }
}

export const confirmOtpForSignup = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userCred = req.body.email
        const { otp } = matchedData(req)
        const savedOTP = await OTPobj.getOTP(userCred)
        const valid = otp === savedOTP
        if (valid){
            const inf = await signupObj.getSignupInfo(userCred) as string
            const info = JSON.parse(inf)
            const user = await userObj.createUser(userCred, info.pw as string, info.first_name as string, info.last_name as string)
            await profileObj.createProfile(user.id)
            await signupObj.deleteSignupInfo(userCred)
            await OTPobj.deleteOTP(userCred)
            return res.status(200).json({
                message: "Create account successfully"
            })
        }
        return res.status(401).json({
            message: "Wrong otp, try again"
        })
    } catch (error) {
        return next(error)
    }
} 
