import express from 'express'
import { seatTypeValidate } from '../../validate/seat-type.validate'
import { handleValidationErrors } from '../../middlewares/validateResult'
import * as seatTypes from "../../controller/seat-type.controller"

const router = express.Router()

router.get("/", seatTypes.getAllSeatType)
router.post("/", seatTypeValidate, handleValidationErrors, seatTypes.insertSeatType)
router.put("/:id", seatTypeValidate, handleValidationErrors, seatTypes.updateSeatType)
router.delete("/:id", seatTypes.deleteSeatType)

export default router