import express from 'express'
import { handleValidationErrors } from '../middlewares/validateResult.js'
import { changingPasswordValidate, otpValidate } from '../validate/profile.validate.js'
import { passwordValidate } from '../validate/password.validate.js'
import * as password from "../controller/password.controller.js"
import { emailValidate } from '../validate/email.validate.js'
import { authorizeRoles } from '../middlewares/authorize.js'

const router = express.Router()

router.post("/change", authorizeRoles(["USER", "ADMIN"]),changingPasswordValidate, handleValidationErrors, password.changePassword)

router.post("/forgot/otp", password.getUserEmail, otpValidate, handleValidationErrors, password.confirmOtp)
router.post("/change/otp", password.getUserId, otpValidate, handleValidationErrors, password.confirmOtp)
router.post("/new", passwordValidate, handleValidationErrors, password.newPassword)
router.post("/forgot", emailValidate, handleValidationErrors, password.forgotPassword)
router.post("/forgot/new", passwordValidate, handleValidationErrors, password.newPasswordForForgotPassword)

export default router