import express from "express"
import * as movies from "../controller/movies.controller.js"
import { validateMovie } from "../validate/movies.validate.js"
import { handleValidationErrors } from "../middlewares/validateResult.js"
import { upload } from "../utils/fileupload.js"
const router = express.Router()

router.get("/coming_movies", movies.getAllComingMovies)
router.get("/showing_movies", movies.getAllShowingMovies)
router.get("/genre/:genre_name", movies.getMoviesByGenre)
router.get("/title/:title_name", movies.getMoviesByTitle)
router.get("/movie/:id", movies.getSpecificMovie)

export default router