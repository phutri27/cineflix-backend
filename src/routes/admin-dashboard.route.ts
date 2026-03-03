import express from 'express'
import * as snacks from "../controller/snacks.controller.js"
import * as movies from "../controller/movies.controller.js"
import * as vouchers from "../controller/voucher.controller.js"
import * as cinemas from "../controller/cinema.controller.js"
import * as screens from "../controller/screen.controller.js"
import * as seats from "../controller/seat.controller.js"
import * as seatTypes from "../controller/seat-type.controller.js"
import { validateMovie } from "../validate/movies.validate.js"
import { validateSnack } from '../validate/snack.validate.js'
import { validateVoucher } from '../validate/voucher.validate.js'
import { validateCinema } from '../validate/cinema.validate.js'
import { validateScreen } from '../validate/screen.validate.js'
import { seatValidate } from '../validate/seat.validate'
import { seatTypeValidate } from '../validate/seat-type.validate.js'
import { handleValidationErrors } from "../middlewares/validateResult.js"
import { upload } from "../utils/fileupload.js"

const router = express.Router()

//Movies
router.get("/movies", movies.getAllMovies)
router.post("/movie",upload.single('filename'), validateMovie, handleValidationErrors, movies.insertMovies)
router.put("/movie/:id", upload.single('filename'), validateMovie, handleValidationErrors, movies.updateMovies)
router.delete("/movie/:id", movies.deleteMovie)

//Snacks
router.get("/snacks", snacks.getAllSnacks)
router.post("/snacks", upload.single('filename'), validateSnack, handleValidationErrors, snacks.insertSnack)
router.put("/snacks/:id", upload.single('filename'), validateSnack, handleValidationErrors, snacks.updateSnack)
router.delete("/snacks/:id", snacks.deleteSnack)

//Vouchers
router.get("/vouchers", vouchers.getAllVouchers)
router.post("/vouchers", validateVoucher, handleValidationErrors, vouchers.insertVoucher)
router.put("/vouchers/:id", validateVoucher, handleValidationErrors, vouchers.updateVoucher)
router.delete("/vouchers/:id", vouchers.deleteVoucher)

//Cinema
router.get("/cinema/city/:cinema_id", cinemas.getCinemaByCity)
router.post("/", validateCinema, handleValidationErrors, cinemas.insertCinema)
router.put("/:cinema_id", validateCinema, handleValidationErrors, cinemas.updateCinema)
router.delete("/:cinema_id", cinemas.deleteCinema)

//Screen
router.get("/screen/:cinema_id", screens.getScreenByCinema)
router.post("/screen/:cinema_id", validateScreen, handleValidationErrors, screens.insertScreen)
router.put("/screen/:id", validateScreen, handleValidationErrors, screens.updateScreen)
router.delete("/screen/:id", screens.deleteScreen)

//Seat
router.get("/seat/:screen_id", seats.getAllSeatOfScreen)
router.post("/seat/:screen_id", seatValidate, handleValidationErrors, seats.insertSeat)
router.put("/seat/:id", seatValidate, handleValidationErrors, seats.updateSeat)
router.delete("/seat/:id", seats.deleteSeat)

//Seat type
router.get("/seat-type/:cinema_id", seatTypes.getAllSeatType)
router.post("/seat-type/:cinema_id", seatTypeValidate, handleValidationErrors, seatTypes.insertSeatType)
router.put("/seat-type/:id", seatTypeValidate, handleValidationErrors, seatTypes.updateSeatType)
router.delete("/seat-type/:id", seatTypes.deleteSeatType)

export default router