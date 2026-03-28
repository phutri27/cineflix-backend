import express from 'express'
import { checkoutSession } from '../payment/stripe'

const router = express.Router()

router.post("/", checkoutSession)

export default router