import { body } from "express-validator"; 
const emptyMsg = "must not be empty"

export const validateSnack = [
    body("name").trim()
    .notEmpty()
    .withMessage(`Snack name ${emptyMsg}`),
    
    body("price")
    .notEmpty()
    .withMessage(`Price ${emptyMsg}`)
    .isNumeric()
    .withMessage(`Price must only be numbers`)
]