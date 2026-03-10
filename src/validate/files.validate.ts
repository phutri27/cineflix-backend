import { body } from "express-validator";

const emptyErr = "must not be empty"
export const validateFile = [
body("filename")
    .custom((value, {req}) => {
        if (!req.file){
            throw new Error(`File ${emptyErr}`)
        }
        if (req.file.size > 10 * 1024 * 1024){
            throw new Error(`File too large, maximum file size of 10MB`)
        }
        return true
    })
]