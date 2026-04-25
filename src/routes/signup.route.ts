import express from 'express'
import * as signup from "../controller/signup.controller"
import { handleValidationErrors } from '../middlewares/validateResult'
import { validateSignup } from '../validate/signup.validate'
import { passwordValidate } from '../validate/password.validate'
import { otpValidate } from '../validate/profile.validate'

const router = express.Router()

router.post("/",validateSignup, passwordValidate, handleValidationErrors, signup.signupPost)
router.post("/otp", otpValidate, handleValidationErrors, signup.confirmOtpForSignup)

export default router