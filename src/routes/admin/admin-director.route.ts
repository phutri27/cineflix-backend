import express from 'express'
import * as directors from "../../controller/director.controller"
import { handleValidationErrors } from '../../middlewares/validateResult'
import { movieOptionsValidate } from '../../validate/movie-options.validate'

const router = express.Router()

router.get("/", directors.getAllDirector)
router.post("/", movieOptionsValidate, handleValidationErrors, directors.insertDirector)
router.put("/:id", movieOptionsValidate, handleValidationErrors, directors.updateDirector)
router.delete("/:id", directors.deleteDirector)

export default router