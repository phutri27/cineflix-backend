import express from 'express'
import { validateScreen } from '../../validate/screen.validate.js'
import { handleValidationErrors } from '../../middlewares/validateResult.js'
import * as screens from "../../controller/screen.controller.js"
const router = express.Router()

router.get("/", screens.getScreenByCinema)
router.post("/", validateScreen, handleValidationErrors, screens.insertScreen)
router.put("/:id", validateScreen, handleValidationErrors, screens.updateScreen)
router.delete("/:id", screens.deleteScreen)

export default router