import express from "express"
import * as movies from "../controller/movies.controller.js"
const router = express.Router()

router.get("/movies", movies.getAllMovies)
router.get("/movie/:id", movies.getSpecificMovie)

export default router