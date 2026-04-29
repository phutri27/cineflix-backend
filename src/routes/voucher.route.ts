import express from 'express'
import { activateVouchers } from '../controller/voucher.controller.js'
import { handleValidationErrors } from '../middlewares/validateResult.js'
import { validateVoucherCodeUser } from '../validate/voucher.validate.js'

const router = express.Router()

router.post("/", validateVoucherCodeUser,handleValidationErrors, activateVouchers)

export default router