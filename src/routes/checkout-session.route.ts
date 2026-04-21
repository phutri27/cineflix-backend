import express from 'express'
import { checkoutSession, cancelCheckout } from '../controller/stripe.controller'
import { vnpayCheckout, ipnUrlProccess, getUrlReturn } from '../controller/vnpay.controller'
import { createNoti } from '../controller/notifications.controller'
import { seatLock } from '../controller/seat-lock.controller'
import { calculateAmount } from '../controller/transaction.controller'
import { handleValidationErrors } from '../middlewares/validateResult'
import { checkoutValidate } from '../validate/checkout.validate'

const router = express.Router()

router.post("/create-checkout-session", checkoutValidate, handleValidationErrors,calculateAmount, checkoutSession, seatLock)

router.post("/vnpay-checkout", checkoutValidate, handleValidationErrors, calculateAmount, vnpayCheckout, seatLock)
router.delete("/:sessionId", cancelCheckout)

router.get("/vnpay-ipn", ipnUrlProccess, createNoti)
router.get("/vnpay-return", getUrlReturn)

export default router