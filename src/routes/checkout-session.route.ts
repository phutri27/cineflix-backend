import express from 'express'
import { checkoutSession, cancelCheckout } from '../controller/stripe.controller.js'
import { vnpayCheckout, ipnUrlProccess, getUrlReturn } from '../controller/vnpay.controller.js'
import { createNoti } from '../controller/notifications.controller.js'
import { seatLock } from '../controller/seat-lock.controller.js'
import { calculateAmount } from '../controller/transaction.controller.js'
import { handleValidationErrors } from '../middlewares/validateResult.js'
import { checkoutValidate } from '../validate/checkout.validate.js'

const router = express.Router()

router.post("/create-checkout-session", checkoutValidate, handleValidationErrors,calculateAmount, checkoutSession, seatLock)

router.post("/vnpay-checkout", checkoutValidate, handleValidationErrors, calculateAmount, vnpayCheckout, seatLock)
router.delete("/:sessionId", cancelCheckout)

router.get("/vnpay-ipn", ipnUrlProccess, createNoti)
router.get("/vnpay-return", getUrlReturn)

export default router