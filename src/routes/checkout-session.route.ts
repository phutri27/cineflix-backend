import express from 'express'
import { checkoutSession, cancelCheckout } from '../controller/stripe.controller'
import { vnpayCheckout, ipnUrlProccess, getUrlReturn } from '../controller/vnpay.controller'
import { createNoti } from '../controller/notifications.controller'
import { seatLock } from '../controller/seat-lock.controller'
import { calculateAmount } from '../controller/transaction.controller'

const router = express.Router()

router.post("/create-checkout-session", calculateAmount, checkoutSession, seatLock)

router.post("/vnpay-checkout", calculateAmount, vnpayCheckout, seatLock)
router.delete("/:sessionId", cancelCheckout)

router.get("/vnpay-ipn", ipnUrlProccess, createNoti)
router.get("/vnpay-return", getUrlReturn)

export default router