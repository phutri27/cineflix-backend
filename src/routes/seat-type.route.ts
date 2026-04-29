import express from 'express'
import { getAllSeatType } from '../controller/seat-type.controller.js'
const router = express.Router()

router.get("/", getAllSeatType)

export default router