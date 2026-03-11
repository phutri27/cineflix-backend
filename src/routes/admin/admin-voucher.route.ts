import express from 'express'
import { validateVoucher } from '../../validate/voucher.validate'
import { handleValidationErrors } from '../../middlewares/validateResult'
import * as vouchers from "../../controller/voucher.controller"

const router = express.Router()

router.get("/", vouchers.getAllVouchers)
router.post("/", validateVoucher, handleValidationErrors, vouchers.insertVoucher)
router.put("/:id", validateVoucher, handleValidationErrors, vouchers.updateVoucher)
router.delete("/:id", vouchers.deleteVoucher)

export default router