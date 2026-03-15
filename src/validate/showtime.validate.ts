import { body } from "express-validator";

export const createShowtimeValidation = [
    body("startTime").isISO8601().toDate().withMessage("Start time must be a valid date"),
    body("movieId").isString().withMessage("Movie ID must be a string"),
    body("screenId").isString().withMessage("Screen ID must be a string")
]

export const updateShowtimeValidation = [
    body("startTime").isISO8601().toDate().withMessage("Start time must be a valid date")
]

