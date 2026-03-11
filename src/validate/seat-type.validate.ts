import { body } from "express-validator";

const emptyMsg = "must not be empty"

export const seatTypeValidate = [
    body("price")
    .notEmpty()
    .withMessage(`Price ${emptyMsg}`)
    .isNumeric()
    .withMessage(`Price must only be numbers`),

    body("seat_type")
    .notEmpty()
    .withMessage(`Seat type ${emptyMsg}`),

    body("cinema_id")
    .notEmpty()
    .withMessage(`Cinema ${emptyMsg}`)
]