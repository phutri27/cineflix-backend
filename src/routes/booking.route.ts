import express from 'express'
import { bookingValidation, statusValidate } from '../validate/booking.validate'
import * as bookings from "../controller/booking.controller"
import { handleValidationErrors } from '../middlewares/validateResult'
import { unlockSeat } from '../controller/seat-lock.controller'

const router = express.Router()

router.get("/", bookings.getBookingInfo)
router.get("/seats", bookings.getAllLockedSeat)
router.post("/", bookingValidation , handleValidationErrors, bookings.createBooking)
router.patch("/:id/status", statusValidate, handleValidationErrors, bookings.updateBookingStatus)
router.post("/:id", bookings.deleteBooking, unlockSeat)

export default router