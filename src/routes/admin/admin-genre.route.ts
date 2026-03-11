import express from 'express'
import * as genres from "../../controller/genre.controller"
import { handleValidationErrors } from '../../middlewares/validateResult'
import { movieOptionsValidate } from '../../validate/movie-options.validate'

const router = express.Router()

router.get("/genres", genres.getAllGenres)
router.post("/genres", movieOptionsValidate, handleValidationErrors, genres.insertGenre)
router.put("/genres/:id", movieOptionsValidate, handleValidationErrors, genres.updateGenre)
router.delete("/genres/:id", genres.deleteGenre)

export default router