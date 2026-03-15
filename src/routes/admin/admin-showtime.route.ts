import express from 'express'
import * as showtimes from '../../controller/showtimes.controller'
import { handleValidationErrors } from '../../middlewares/validateResult'
import { createShowtimeValidation, updateShowtimeValidation } from '../../validate/showtime.validate'

const router = express.Router()

router.post('/', createShowtimeValidation, handleValidationErrors, showtimes.createShowtime)
router.get('/', showtimes.getShowtime)
router.put('/', updateShowtimeValidation, handleValidationErrors, showtimes.updateShowtime)
router.delete('/:id', showtimes.deleteShowtime)

export default router