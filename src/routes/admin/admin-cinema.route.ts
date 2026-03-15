import express from 'express'
import * as cinemas from "../../controller/cinema.controller"
import { validateCinema } from '../../validate/cinema.validate'
import { handleValidationErrors } from '../../middlewares/validateResult'
import type { Request, Response } from "express"
const router = express.Router()

router.get("/", cinemas.getAllCinema)
router.post("/",validateCinema, handleValidationErrors, cinemas.insertCinema)
router.put("/:cinema_id", validateCinema, handleValidationErrors, cinemas.updateCinema)
router.delete("/:cinema_id", cinemas.deleteCinema)

export default router