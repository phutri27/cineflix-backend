import express from 'express'
import * as snacks from "../../controller/snacks.controller"
import { upload } from '../../utils/fileupload'
import { validateFile } from '../../validate/files.validate'
import { validateSnack } from '../../validate/snack.validate'
import { handleValidationErrors } from '../../middlewares/validateResult'

const router = express.Router()

router.get("/", snacks.getAllSnacks)
router.post("/", upload.single('filename'), validateFile, validateSnack, handleValidationErrors, snacks.insertSnack)
router.put("/:id", upload.single('filename'), validateSnack, handleValidationErrors, snacks.updateSnack)
router.delete("/:id", snacks.deleteSnack)

export default router