import express from 'express'
import { bookingValidation, statusValidate } from '../validate/booking.validate'
import * as bookings from "../controller/booking.controller"
import { handleValidationErrors } from '../middlewares/validateResult'

const router = express.Router()

router.post("/", bookingValidation , handleValidationErrors, bookings.createBooking)
router.patch("/:id/status", statusValidate, handleValidationErrors, bookings.updateBookingStatus)
router.delete("/:id", bookings.deleteBooking)

export default router