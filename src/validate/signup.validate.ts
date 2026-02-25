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
    body("pw").trim()
    .notEmpty().withMessage(`Password ${emptyMsg}`)
    .bail()
    .isLength({min: 8}).withMessage("Password must be at least 8 character")
    .isLength({max: 25}).withMessage("Password must not exceed 25 characters")
    .custom((value: string, {req}) => {
        if (/\d/.test(value) == false 
        || /[A-Z]/.test(value) == false 
        || /[a-z]/.test(value) == false 
        || /\p{P}/gu.test(value) == false){
            throw new Error("Password must contain combining uppercase/lowercase letters, at least one special character (.,?@...) and one number (0-9)")
        }
        return true
    }),

    body("confirmPw").trim()
    .notEmpty().withMessage(`Password ${emptyMsg}`)
    .bail()
    .custom((value: string, {req}) => {
        if(value !== req.body.pw){
            return Promise.reject("Password does not match")
        }
        return true
    }),

    body("first_name").trim()
    .notEmpty()
    .bail()
    .withMessage(`First name ${emptyMsg}`)
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage(`First name ${alpha}`),

    body("last_name").trim()
    .notEmpty()
    .bail()
    .withMessage(`Last name ${emptyMsg}`)
    .isAlpha('en-US', { ignore: ' ' })
    .withMessage(`Last name ${alpha}`)

]