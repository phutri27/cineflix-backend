import express from 'express'
import { checkoutSession } from '../controller/stripe.controller'
import { seatLock } from '../controller/seat-lock.controller'
const router = express.Router()

router.post("/create-checkout-session", checkoutSession, seatLock)

export default router