import type { NextFunction, Request, Response } from "express";
import { genPassword } from "../utils/password.util";
import { userObj } from "../dao/user.dao";
import { matchedData } from "express-validator";
import { profileObj } from "../dao/profile.dao";

export const signupPost = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, pw, first_name, last_name } = matchedData(req)
        const hashed_password = await genPassword(pw)
        const user = await userObj.createUser(email, hashed_password as string, first_name, last_name)
        await profileObj.createProfile(user.id)
        return res.status(200).json({
            message: "Create account succesfully"
        })
    } catch (error) {
        console.error(error)
        next(error)
    }
}
