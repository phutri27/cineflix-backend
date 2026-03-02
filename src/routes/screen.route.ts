import express from 'express'
import * as screens from "../controller/screen.controller.js"
import { handleValidationErrors } from '../middlewares/validateResult.js'


const router = express.Router()

router.get("/:cinema_id", screens.getScreenByCinema)

router.post("/:cinema_id",)

export default router