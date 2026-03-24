import express from 'express'
import { getAllSeatType } from '../controller/seat-type.controller'
const router = express.Router()

router.get("/", getAllSeatType)

export default router