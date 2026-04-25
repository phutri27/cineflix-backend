import express from "express"
import * as movies from "../controller/movies.controller"
const router = express.Router()

router.get("/", movies.getAllMovies)
router.get("/:id", movies.getSpecificMovie)

export default router