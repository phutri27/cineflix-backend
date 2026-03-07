import { body } from "express-validator";
const emptyMsg = "must not be empty"

export const seatValidate = [
    body("row").trim()
    .notEmpty()
    .withMessage(`Row ${emptyMsg}`)
    .isAlpha()
    .withMessage(`Row must only be letters`),

    body("seat_typeId")
    .notEmpty()
    .withMessage(`Seat type ${emptyMsg}`),

    body("number")
    .notEmpty()
    .withMessage(`Seat number ${emptyMsg}`)
    .isInt()
    .withMessage(`Seat number must only be numbers`),

]