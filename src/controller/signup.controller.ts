import type { NextFunction, Request, Response } from "express";
import { matchedData, validationResult, Result} from 'express-validator'
import { validateSignup } from "../validate/signup.validate.js";
import { genPassword } from "../utils/password.util";
import { userObj } from "../dao/user.dao";

export const signupPost = [
    ...validateSignup,
    async (req: Request, res: Response, next: NextFunction) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()){
            const result: Result<string> = errors.formatWith(error => error.msg as string)
            return res.status(400).json({errors: result.array()})
        }
        try {
            const { email, pw, first_name, last_name } = matchedData(req)
            const hashed_password = await genPassword(pw)
            await userObj.createUser(email, hashed_password as string, first_name, last_name)
            return res.status(200).json({
                message: "Create account succesfully"
            })
        } catch (error) {
            console.error(error)
            next(error)
        }
    }
]