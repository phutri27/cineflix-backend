import express from 'express'
import * as cinemas from "../../controller/cinema.controller.js"
import { validateCinema, validateMovieInCinema } from '../../validate/cinema.validate.js'
import { handleValidationErrors } from '../../middlewares/validateResult.js'

const router = express.Router()

router.get("/", cinemas.getAllCinema)
router.post("/",validateCinema, handleValidationErrors, cinemas.insertCinema)

router.put("/movies/:cinema_id/:movieId", cinemas.updateCinema)

router.put("/movies/:cinema_id", validateMovieInCinema, handleValidationErrors, cinemas.handleMovieCinema)

router.put("/:cinema_id", validateCinema, handleValidationErrors, cinemas.updateCinema)
router.delete("/:cinema_id", cinemas.deleteCinema)

export default router