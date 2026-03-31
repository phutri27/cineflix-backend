import express from 'express'
import { checkoutPost } from '../controller/stripe.controller'
const router = express.Router()

router.post("/", checkoutPost)

export default router