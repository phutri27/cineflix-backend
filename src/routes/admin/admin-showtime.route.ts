import express from 'express'
import * as showtimes from '../../controller/showtimes.controller'
import { handleValidationErrors } from '../../middlewares/validateResult'
import { ShowtimeValidation, movieIdValidation } from '../../validate/showtime.validate'

const router = express.Router()

router.post('/', ShowtimeValidation, movieIdValidation, handleValidationErrors, showtimes.createShowtime)
router.get('/', showtimes.getShowtime)
router.put('/', ShowtimeValidation, movieIdValidation, handleValidationErrors, showtimes.updateShowtime)
router.delete('/:id', showtimes.deleteShowtime)

export default router