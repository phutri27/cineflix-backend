import { empty } from "@prisma/client/runtime/client";
import { body } from "express-validator";

const emptyMsg = "must not be empty"

export const validateScreen = [
    body("name").trim()
    .notEmpty()
    .withMessage(`Screen name ${emptyMsg}`),

    body("cinema_id").trim()
    .notEmpty()
    .withMessage(`Cinema id ${emptyMsg}`),

    body("seats").isArray({min: 1})
    .withMessage(`Seats ${emptyMsg}`),

    body("showtimes").isArray({min: 1})
    .withMessage(`Showtimes ${emptyMsg}`)
]