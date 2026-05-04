import express from 'express'
import { seatTypeValidate, seatTypePriceValidate } from '../../validate/seat-type.validate.js'
import { handleValidationErrors } from '../../middlewares/validateResult.js'
import * as seatTypes from "../../controller/seat-type.controller.js"

const router = express.Router()

router.get("/", seatTypes.getAllSeatType)
router.post("/", seatTypePriceValidate, seatTypeValidate, handleValidationErrors, seatTypes.insertSeatType)
router.put("/:id", seatTypePriceValidate, handleValidationErrors, seatTypes.updateSeatType)
router.delete("/:id", seatTypes.deleteSeatType)

export default router 