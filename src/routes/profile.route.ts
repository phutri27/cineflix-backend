import express from 'express'
import * as profile from "../controller/profile.controller.js"
import { handleValidationErrors } from '../middlewares/validateResult.js'
import { validateProfile, changingPasswordValidate } from '../validate/profile.validate.js'


const router = express.Router()

router.get("/", profile.getCustomerProfile)
router.get("/booking_history/:page", profile.getBookingHistory)

router.put("/", validateProfile, changingPasswordValidate, handleValidationErrors, profile.editCustomerProfile)

export default router