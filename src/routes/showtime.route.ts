import { getShowtimeByDateAndCity } from "../controller/showtimes.controller";
import express from 'express'

const router = express.Router()

router.get('/', getShowtimeByDateAndCity)

export default router