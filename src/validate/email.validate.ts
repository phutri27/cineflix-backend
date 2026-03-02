import { body } from "express-validator";
import { userObj } from "../dao/user.dao";
const emptyMsg = "must not be empty"

export const emailValidate = [
    body("email")
    .notEmpty()
    .withMessage(`Email ${emptyMsg}`)
    .bail()
    .isEmail()
    .withMessage(`Must be email! For example: example@gmail.com`)
    .custom(async (value, {req}) => {
        const result = await userObj.getEmail(req.body.email)
        if (!result){
            throw new Error("Incorect login information")
        }

        return true
    }),
]