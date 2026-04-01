import express from 'express'
import { checkoutSession, cancelCheckout } from '../controller/stripe.controller'
import { vnpayCheckout, ipnUrlProccess, getUrlReturn } from '../controller/vnpay.controller'
import { seatLock } from '../controller/seat-lock.controller'
const router = express.Router()

router.post("/create-checkout-session", checkoutSession, seatLock)
router.post("/vnpay-checkout", vnpayCheckout, seatLock)
router.delete("/:sessionId", cancelCheckout)

router.get("/vnpay-ipn", ipnUrlProccess)
router.get("/vnpay-return", getUrlReturn)

export default router