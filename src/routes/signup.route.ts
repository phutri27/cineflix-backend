import express from 'express'
import * as signup from "../controller/signup.controller.js"
import { handleValidationErrors } from '../middlewares/validateResult.js'
import { validateSignup } from '../validate/signup.validate.js'
import { passwordValidate } from '../validate/password.validate.js'

const router = express.Router()

router.post("/",validateSignup, passwordValidate, handleValidationErrors, signup.signupPost)

export default router