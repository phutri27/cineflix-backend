import { body } from "express-validator";

export const movieOptionsValidate = [
    body("name").trim()
    .notEmpty()
    .withMessage("Name must not be empty")
    .bail()
    .matches(/^[\p{L}\s\-]+$/u)
    .withMessage("Name must only be letters")
]