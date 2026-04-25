import express from 'express'
import * as screens from "../controller/screen.controller"

const router = express.Router()

router.get("/:cinema_id", screens.getScreenByCinema)

export default router