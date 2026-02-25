import express from "express"
import * as movies from "../controller/movies.controller.js"
const router = express.Router()

router.get("/coming_movies", movies.getAllComingMovies)
router.get("/showing_movies", movies.getAllShowingMovies)
router.get("/:genre", movies.getMoviesByGenre)
router.get("/:title", movies.getMoviesByTitle)

export default router