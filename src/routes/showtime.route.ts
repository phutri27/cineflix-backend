import { getShowtime } from "../controller/showtimes.controller";
import express from 'express'

const router = express.Router()

router.get('/', getShowtime)

export default router