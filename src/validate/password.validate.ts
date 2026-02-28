import { body } from "express-validator";
const emptyMsg = "must not be empty"

export const passwordValidate = [
    body("pw")
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
    })
]