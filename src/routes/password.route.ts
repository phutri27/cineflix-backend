import express from 'express'
import { handleValidationErrors } from '../middlewares/validateResult'
import { changingPasswordValidate, otpValidate } from '../validate/profile.validate'
import { passwordValidate } from '../validate/password.validate'
import * as password from "../controller/password.controller"
import { emailValidate } from '../validate/email.validate'
import { authorizeRoles } from '../middlewares/authorize'

const router = express.Router()

router.post("/change", authorizeRoles(["USER", "ADMIN"]),changingPasswordValidate, handleValidationErrors, password.changePassword)

router.post("/forgot/otp", password.getUserEmail, otpValidate, handleValidationErrors, password.confirmOtp)
router.post("/change/otp", password.getUserId, otpValidate, handleValidationErrors, password.confirmOtp)
router.post("/new", passwordValidate, handleValidationErrors, password.newPassword)
router.post("/forgot", emailValidate, handleValidationErrors, password.forgotPassword)
router.post("/forgot/new", passwordValidate, handleValidationErrors, password.newPasswordForForgotPassword)

export default router