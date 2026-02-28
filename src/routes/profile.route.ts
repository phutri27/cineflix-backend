import express from 'express'
import * as profile from "../controller/profile.controller.js"
import { handleValidationErrors } from '../middlewares/validateResult.js'
import { validateProfile } from '../validate/profile.validate.js'
import { changingPasswordValidate, otpValidate } from '../validate/profile.validate.js'
import { passwordValidate } from '../validate/password.validate.js'

const router = express.Router()

router.get("/", profile.getCustomerProfile)
router.get("/booking_history/:page", profile.getBookingHistory)

router.post("/change_password", changingPasswordValidate, handleValidationErrors, profile.changePassword)
router.post("/enter_otp", otpValidate, handleValidationErrors, profile.confirmOtp)
router.post("/new_password", passwordValidate, handleValidationErrors, profile.newPassword)

router.put("/edit", validateProfile, handleValidationErrors, profile.editCustomerProfile)


export default router