import express from "express"
import * as movies from "../../controller/movies.controller.js"
import { upload } from "../../utils/cloudinary-file.util.js"
import { validateFile } from "../../validate/files.validate.js"
import { validateMovie } from "../../validate/movies.validate.js"
import { handleValidationErrors } from "../../middlewares/validateResult.js"

const router = express.Router()

router.get("/", movies.getAllMovies)
router.get("/:id", movies.getSpecificMovie)
router.post("/",upload.single('filename'), validateFile, validateMovie, handleValidationErrors, movies.insertMovies)
router.put("/:id", upload.single('filename'), validateMovie, handleValidationErrors, movies.updateMovies)
router.patch("/:id", movies.movieStatus)
router.delete("/:id", movies.deleteMovie)

export default router