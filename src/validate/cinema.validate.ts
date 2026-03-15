import { body } from "express-validator";

const emptyMsg = "must not be empty"

export const validateCinema = [
    body("name").trim()
    .notEmpty()
    .withMessage(`Cinema name ${emptyMsg}`),

    body("address")
    .notEmpty()
    .withMessage(`Cinema address ${emptyMsg}`),

    body("hotline")
    .notEmpty()
    .withMessage(`Cinema hotline ${emptyMsg}`),
]