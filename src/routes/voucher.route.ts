import express from 'express'
import { activateVouchers } from '../controller/voucher.controller'
import { handleValidationErrors } from '../middlewares/validateResult'
import { validateVoucherCodeUser } from '../validate/voucher.validate'

const router = express.Router()

router.post("/", validateVoucherCodeUser, handleValidationErrors, activateVouchers)

export default router