import express from 'express'
import * as seats from "../../controller/seat.controller.js"
import { seatValidate } from '../../validate/seat.validate.js'
import { handleValidationErrors } from "../../middlewares/validateResult.js"

const router = express.Router()

router.get("/", seats.getAllSeatOfScreen)
router.post("/", seatValidate, handleValidationErrors, seats.insertSeat)
router.put("/:id", seatValidate, handleValidationErrors, seats.updateSeat)
router.delete("/:id", seats.deleteSeat)

export default router