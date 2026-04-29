import express from 'express'
import * as genres from "../../controller/genre.controller.js"
import { handleValidationErrors } from '../../middlewares/validateResult.js'
import { movieOptionsValidate } from '../../validate/movie-options.validate.js'

const router = express.Router()

router.get("/", genres.getAllGenres)
router.post("/", movieOptionsValidate, handleValidationErrors, genres.insertGenre)
router.put("/:id", movieOptionsValidate, handleValidationErrors, genres.updateGenre)
router.delete("/:id", genres.deleteGenre)

export default router