import express from 'express'
import { getAllLockedSeat } from '../controller/seat-lock.controller.js'
const router = express.Router()

router.get("/", getAllLockedSeat)

export default router