import express from "express"
import * as movies from "../../controller/movies.controller"
import { upload } from "../../utils/cloudinary-file.util"
import { validateFile } from "../../validate/files.validate"
import { validateMovie } from "../../validate/movies.validate"
import { handleValidationErrors } from "../../middlewares/validateResult"

const router = express.Router()

router.get("/", movies.getAllMovies)
router.get("/:id", movies.getSpecificMovie)
router.post("/",upload.single('filename'), validateFile, validateMovie, handleValidationErrors, movies.insertMovies)
router.put("/:id", upload.single('filename'), validateMovie, handleValidationErrors, movies.updateMovies)
router.patch("/:id", movies.movieStatus)
router.delete("/:id", movies.deleteMovie)

export default router