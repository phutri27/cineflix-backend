import { body } from "express-validator"; 
import { userObj } from "../dao/user.dao.js";

const emptyMsg = "must not be empty"
const alpha = "must only contain alphabet character"

export const validateSignup =[
    body("email")
    .notEmpty()
    .withMessage(`Email ${emptyMsg}`)
    .bail()
    .isEmail()
    .withMessage(`Must be email! For example: example@gmail.com`)
    .custom(async (value, {req}) => {
        const result = await userObj.getEmail(value)
        if (result){
            throw new Error("Email has been taken")
        }
        return true
    }),

    body("first_name").trim()
    .notEmpty()
    .bail()
    .withMessage(`First name ${emptyMsg}`)
    .matches(/^[\p{L}\s\-]+$/u)
    .withMessage(`First name ${alpha}`),

    body("last_name").trim()
    .notEmpty()
    .bail()
    .withMessage(`Last name ${emptyMsg}`)
    .matches(/^[\p{L}\s\-]+$/u)
    .withMessage(`Last name ${alpha}`)
]