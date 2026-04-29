import express from 'express'
import * as directors from "../../controller/director.controller.js"
import { handleValidationErrors } from '../../middlewares/validateResult.js'
import { movieOptionsValidate } from '../../validate/movie-options.validate.js'

const router = express.Router()

router.get("/", directors.getAllDirector)
router.post("/", movieOptionsValidate, handleValidationErrors, directors.insertDirector)
router.put("/:id", movieOptionsValidate, handleValidationErrors, directors.updateDirector)
router.delete("/:id", directors.deleteDirector)

export default router