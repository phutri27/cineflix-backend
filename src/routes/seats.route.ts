import express from 'express'
import { expireSeatPayment } from '../controller/transaction.controller'
import { getAllLockedSeat } from '../controller/seat-lock.controller'
const router = express.Router()

router.post("/", expireSeatPayment)
router.get("/", getAllLockedSeat)

export default router