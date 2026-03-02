import { empty } from "@prisma/client/runtime/client";
import { body } from "express-validator";

const emptyMsg = "must not be empty"

export const validateScreen = [
    body("name").trim()
    .notEmpty()
    .withMessage(`Screen name ${emptyMsg}`)
]