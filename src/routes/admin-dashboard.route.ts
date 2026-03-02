import express from 'express'
import * as snacks from "../controller/snacks.controller.js"
import * as movies from "../controller/movies.controller.js"
import * as vouchers from "../controller/voucher.controller.js"
import { validateMovie } from "../validate/movies.validate.js"
import { validateSnack } from '../validate/snack.validate.js'
import { validateVoucher } from '../validate/voucher.validate.js'
import { handleValidationErrors } from "../middlewares/validateResult.js"
import { upload } from "../utils/fileupload.js"

const router = express.Router()

router.get("/movies", movies.getAllMovies)
router.post("/movie",upload.single('filename'), validateMovie, handleValidationErrors, movies.insertMovies)
router.put("/movie/:id", upload.single('filename'), validateMovie, handleValidationErrors, movies.updateMovies)
router.delete("/movie/:id", movies.deleteMovie)

router.post("/snacks", upload.single('filename'), validateSnack, handleValidationErrors, snacks.insertSnack)
router.put("/snacks/:id", upload.single('filename'), validateSnack, handleValidationErrors, snacks.updateSnack)
router.delete("/snacks/:id", snacks.deleteSnack)

router.get("/vouchers", vouchers.getAllVouchers)
router.post("/vouchers", validateVoucher, handleValidationErrors, vouchers.insertVoucher)
router.put("/vouchers/:id", validateVoucher, handleValidationErrors, vouchers.updateVoucher)
router.delete("/vouchers/:id", vouchers.deleteVoucher)

export default router