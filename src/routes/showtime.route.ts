import { getShowtimeByDateAndCity, getSpecificShowtime } from "../controller/showtimes.controller.js";
import express from 'express'

const router = express.Router()

router.get("/:id", getSpecificShowtime)
router.get('/', getShowtimeByDateAndCity)

export default router