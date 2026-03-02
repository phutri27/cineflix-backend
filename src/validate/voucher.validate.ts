import { body } from "express-validator";

const emptyMsg = "must not be empty"
const dateType = "must only of date type"

export const validateVoucher = [
    body("name").trim()
    .notEmpty()
    .withMessage(`Voucher name ${emptyMsg}`),

    body("reductAmount")
    .notEmpty()
    .withMessage(`Reduce amount ${emptyMsg}`)
    .isNumeric()
    .withMessage(`Reduce amount must only be number`),

    body("startAt")
    .notEmpty()
    .withMessage(`Start date ${emptyMsg}`)
    .isDate()
    .withMessage(`Start date ${dateType}`),

    body("expireAt")
    .notEmpty()
    .withMessage(`Expire date ${emptyMsg}`)
    .isDate()
    .withMessage(`Expire date ${dateType}`),

    body("activation_code")
    .notEmpty()
    .withMessage(`Activation code ${emptyMsg}`)
]