import express from 'express'
import { movieOptionsValidate } from '../../validate/movie-options.validate.js'
import { handleValidationErrors } from '../../middlewares/validateResult.js'
import * as actors from "../../controller/actor.controller.js"
const router = express.Router()

router.get("/", actors.getAllActor)
router.post("/", movieOptionsValidate, handleValidationErrors, actors.insertActor)
router.put("/:id", movieOptionsValidate, handleValidationErrors, actors.updateActor)
router.delete("/:id", actors.deleteActor)

export default router