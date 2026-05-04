import express from 'express'
import * as signup from "../controller/signup.controller.js"
import { handleValidationErrors } from '../middlewares/validateResult.js'
import { validateSignup } from '../validate/signup.validate.js'
import { passwordValidate } from '../validate/password.validate.js'
import { otpValidate } from '../validate/profile.validate.js'

const router = express.Router()

router.post("/",validateSignup, passwordValidate, handleValidationErrors, signup.signupPost)
router.post("/otp", otpValidate, handleValidationErrors, signup.confirmOtpForSignup)
router.post("/otp-resend", signup.resendSignUpOtp)

export default router