import express from 'express'
import * as showtimes from '../../controller/showtimes.controller.js'
import { handleValidationErrors } from '../../middlewares/validateResult.js'
import { ShowtimeValidation, movieIdValidation, updateShowTimeValidation } from '../../validate/showtime.validate.js'

const router = express.Router()

router.post('/', ShowtimeValidation, movieIdValidation, handleValidationErrors, showtimes.createShowtime)
router.get('/', showtimes.getShowtime)
router.patch('/:id', updateShowTimeValidation, handleValidationErrors, showtimes.updateShowtime)
router.delete('/:id', showtimes.deleteShowtime)

export default router