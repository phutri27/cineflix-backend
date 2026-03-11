import express from 'express'
import * as cinemas from "../controller/cinema.controller.js"
import { getAllCities } from '../controller/city.controller.js'
const router = express.Router()

router.get("/", cinemas.getAllCinema)
router.get("/:cinema_id", cinemas.getSpecificCinema)
router.get("/:cinema_id/movies", cinemas.getMovieByCinema)


export default router