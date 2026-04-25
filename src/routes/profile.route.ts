import express from 'express'
import * as profile from "../controller/profile.controller"
import { handleValidationErrors } from '../middlewares/validateResult'
import { validateProfile, changingPasswordValidate } from '../validate/profile.validate'
import { validateVoucherCodeUser } from '../validate/voucher.validate'

const router = express.Router()

router.get("/", profile.getCustomerProfile)
router.get("/booking_history/:page", profile.getBookingHistory)
router.get("/vouchers", profile.getProfileVouchers)

router.post("/vouchers", validateVoucherCodeUser, handleValidationErrors, profile.insertVoucherIntoProfile)

router.put("/", validateProfile, changingPasswordValidate, handleValidationErrors, profile.editCustomerProfile)

export default router