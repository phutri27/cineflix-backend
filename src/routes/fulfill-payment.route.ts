import express from 'express'
import { checkoutPost } from '../controller/stripe.controller'
import { createNoti } from '../controller/notifications.controller'
const router = express.Router()

router.post("/", checkoutPost, createNoti)

export default router