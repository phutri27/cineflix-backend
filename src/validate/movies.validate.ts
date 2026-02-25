import { body } from "express-validator";
import { moviesObj } from "../dao/movies.dao";

const emptyMsg = "must not be empty"

export const validateMovie = [
    body("title").trim()
    .notEmpty()
    .withMessage(`Title ${emptyMsg}`),

    body("plot").trim()
    .notEmpty()
    .withMessage(`Plot ${emptyMsg}`),

    body("duration")
    .notEmpty()
    .withMessage(`Duration ${emptyMsg}`)
    .custom((value, {req}) => {
        if (value <= 0){
            throw new Error("Duration cannot be lower or equal to 0")
        }
        return true
    }),

    body("premiere_date")
    .notEmpty()
    .withMessage(`Premiere date ${emptyMsg}`),

    body("rated")
    .notEmpty()
    .withMessage(`Rating ${emptyMsg}`)
]