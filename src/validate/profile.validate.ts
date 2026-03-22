import { body } from "express-validator";

const emptyMsg = "must not be empty"
const alpha = "must only contain alphabet character"

export const validateProfile = [
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
    .withMessage(`Last name ${alpha}`),

]

export const changingPasswordValidate = [
    body("password")
    .notEmpty()
    .withMessage(`Password ${emptyMsg}`)
]

export const otpValidate = [
    body("otp")
    .notEmpty()
    .withMessage(`OTP ${emptyMsg}`)
]

