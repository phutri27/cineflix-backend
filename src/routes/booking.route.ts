import express from 'express'
import * as bookings from "../controller/booking.controller.js"

const router = express.Router()

router.get("/", bookings.getBookingInfo)
export default router