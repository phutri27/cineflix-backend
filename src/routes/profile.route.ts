import express from 'express'
import * as profile from "../controller/profile.controller.js"
import { handleValidationErrors } from '../middlewares/validateResult.js'
import { validateProfile } from '../validate/profile.validate.js'


const router = express.Router()

router.get("/", profile.getCustomerProfile)
router.get("/booking_history/:page", profile.getBookingHistory)

router.put("/edit", validateProfile, handleValidationErrors, profile.editCustomerProfile)


export default router