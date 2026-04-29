import express from 'express'
import { checkoutPost } from '../controller/stripe.controller.js'
import { createNoti } from '../controller/notifications.controller.js'
const router = express.Router()

router.post("/", checkoutPost, createNoti)

export default router