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


router.post("/movie",upload.single('filename'), validateMovie, handleValidationErrors, movies.insertMovies)

router.put("/movie/:id", upload.single('filename'), validateMovie, handleValidationErrors, movies.updateMovies)

router.delete("/movie/:id", movies.deleteMovie)
export default router