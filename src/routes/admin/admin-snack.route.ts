import express from 'express'
import * as snacks from "../../controller/snacks.controller.js"
import { upload } from '../../utils/cloudinary-file.util.js'
import { validateFile } from '../../validate/files.validate.js'
import { validateSnack } from '../../validate/snack.validate.js'
import { handleValidationErrors } from '../../middlewares/validateResult.js'

const router = express.Router()

router.get("/", snacks.getAllSnacks)
router.post("/", upload.single('filename'), validateFile, validateSnack, handleValidationErrors, snacks.insertSnack)
router.put("/:id", upload.single('filename'), validateSnack, handleValidationErrors, snacks.updateSnack)
router.delete("/:id", snacks.deleteSnack)

export default router