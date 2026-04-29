import express from 'express'
import { revenueByCinema, revenueByMovie, revenueByUser } from '../controller/transaction.controller.js'

const router = express.Router()

router.get("/cinemas", revenueByCinema)
router.get("/movies", revenueByMovie)
router.get("/users", revenueByUser)

export default router