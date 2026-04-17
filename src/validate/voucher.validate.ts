import { empty } from "@prisma/client/runtime/client";
import { body } from "express-validator";

const emptyMsg = "must not be empty"
const dateType = "must only of date type"

export const validateVoucher = [
    body("name").trim()
    .notEmpty()
    .withMessage(`Voucher name ${emptyMsg}`),

    body("reduceAmount")
    .notEmpty()
    .withMessage(`Reduce amount ${emptyMsg}`)
    .isInt({ gt: 0 })
    .withMessage(`Reduce amount must only be number and greater than 0`),


    body("startAt")
    .notEmpty()
    .withMessage(`Start date ${emptyMsg}`)
    .isDate()
    .withMessage(`Start date ${dateType}`),

    body("expireAt")
    .notEmpty()
    .withMessage(`Expire date ${emptyMsg}`)
    .isDate()
    .withMessage(`Expire date ${dateType}`)
    .custom((value, {req}) => {
        const startAt = new Date(req.body.startAt)
        const expireAt = new Date(value)
        if(startAt >= expireAt){
            throw new Error("Expire date must be after start date")
        }
        return true
    }),

    body("quantity")
    .notEmpty()
    .withMessage(`Quantity ${emptyMsg}`)
    .isNumeric()
    .withMessage(`Quantity must only be number`),

    body("maxUsed")
    .notEmpty()
    .withMessage(`Maximum time used ${emptyMsg}`)
    .isInt({ gt: 0})
    .withMessage(`Maximum time used must only be number and greater than 0`)
]

export const validateVoucherActivationCode = [
    body("activationCode").trim()
    .notEmpty()
    .withMessage(`Activation code ${emptyMsg}`)
]


export const validateVoucherCodeUser = [
    body("voucher_code").trim()
    .notEmpty()
    .withMessage(`Voucher code ${emptyMsg}`),
]