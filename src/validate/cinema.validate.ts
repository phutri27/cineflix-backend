import { body } from "express-validator";

const emptyMsg = "must not be empty"

export const validateCinema = [
    body("name").trim()
    .notEmpty()
    .withMessage(`Cinema name ${emptyMsg}`),

    body("city_id")
    .notEmpty()
    .withMessage(`City name ${emptyMsg}`),

    body("address")
    .notEmpty()
    .withMessage(`Cinema address ${emptyMsg}`),

    body("hotline")
    .notEmpty()
    .withMessage(`Cinema hotline ${emptyMsg}`),

    body("seatType")
    .notEmpty()
    .withMessage(`Cinema seat type ${emptyMsg}`),

    body("movies")
    .notEmpty()
    .withMessage(`Cinema movies ${emptyMsg}`),

    body("screens")
    .notEmpty()
    .withMessage(`Cinema screens ${emptyMsg}`)
]