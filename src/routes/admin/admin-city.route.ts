import express from 'express'
import * as cities from "../../controller/city.controller.js"
import { movieOptionsValidate } from '../../validate/movie-options.validate.js'
import { handleValidationErrors } from '../../middlewares/validateResult.js'

const router = express.Router()

router.get("/", cities.getAllCities)
router.post("/", movieOptionsValidate, handleValidationErrors, cities.createCity)
router.put("/:id", movieOptionsValidate, handleValidationErrors,cities.updateCity)
router.delete("/:id", cities.deleteCity)

export default router
