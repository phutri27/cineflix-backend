import express from 'express'
import * as cinemas from "../controller/cinema.controller.js"
import { getAllCities } from '../controller/city.controller.js'
const router = express.Router()

router.get("/city/:city_id", cinemas.getCinemaByCity)
router.get("/movie/:cinema_id", cinemas.getMovieByCinema)
router.get("/city", getAllCities)

export default router