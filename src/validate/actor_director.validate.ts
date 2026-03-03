import { body } from "express-validator";

export const validateActorDirector = [
    body("name").trim()
    .notEmpty()
    .withMessage("Name must not be empty")
    .isAlpha()
    .withMessage("Name must only be numbers")
]