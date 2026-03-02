import { body } from "express-validator";

const emptyMsg = "must not be empty"

export const validateCinema = [
    body("name").trim()
    .notEmpty()
    .withMessage(`Cinema name ${emptyMsg}`),

    body("city_id")
    .notEmpty()
    .withMessage(`City name ${emptyMsg}`)
]