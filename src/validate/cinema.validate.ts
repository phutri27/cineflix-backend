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

export const validateMovieInCinema = [
    body("movieIds")
    .isArray({min: 1})
    .withMessage(`MovieIds must be an array and must contain at least one movie id`)
]