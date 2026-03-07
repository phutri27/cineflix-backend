import express from 'express'
import * as snacks from "../controller/snacks.controller"
import * as movies from "../controller/movies.controller"
import * as vouchers from "../controller/voucher.controller"
import * as cinemas from "../controller/cinema.controller"
import * as screens from "../controller/screen.controller"
import * as seats from "../controller/seat.controller"
import * as seatTypes from "../controller/seat-type.controller"
import * as users from "../controller/user.controller"
import * as actors from "../controller/actor.controller"
import * as directors from "../controller/director.controller"
import * as genres from "../controller/genre.controller"
import { validateMovie } from "../validate/movies.validate"
import { validateSnack } from '../validate/snack.validate'
import { validateVoucher } from '../validate/voucher.validate'
import { validateCinema } from '../validate/cinema.validate'
import { validateScreen } from '../validate/screen.validate'
import { validateFile } from '../validate/files.validate'
import { seatValidate } from '../validate/seat.validate'
import { movieOptionsValidate } from '../validate/movie-options.validate'
import { seatTypeValidate } from '../validate/seat-type.validate'
import { handleValidationErrors } from "../middlewares/validateResult"
import { upload } from "../utils/fileupload"


const router = express.Router()

//Movies
router.get("/movies", movies.getAllMovies)
router.post("/movie",upload.single('filename'), validateFile, validateMovie, handleValidationErrors, movies.insertMovies)
router.put("/movie/:id", upload.single('filename'), validateFile, validateMovie, handleValidationErrors, movies.updateMovies)
router.delete("/movie/:id", movies.deleteMovie)

//Snacks
router.get("/snacks", snacks.getAllSnacks)
router.post("/snacks", upload.single('filename'), validateFile, validateSnack, handleValidationErrors, snacks.insertSnack)
router.put("/snacks/:id", upload.single('filename'), validateFile, validateSnack, handleValidationErrors, snacks.updateSnack)
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

//USer
router.get("/users", users.getAllUser)

//Actor
router.get("/actors", actors.getAllActor)
router.post("/actors", movieOptionsValidate, handleValidationErrors, actors.insertActor)
router.put("/actors/:id", movieOptionsValidate, handleValidationErrors, actors.updateActor)
router.delete("/actors/:id", actors.deleteActor)

//Director
router.get("/directors", directors.getAllDirector)
router.post("/directors", movieOptionsValidate, handleValidationErrors, directors.insertDirector)
router.put("/directors/:id", movieOptionsValidate, handleValidationErrors, directors.updateDirector)
router.delete("/directors/:id", directors.deleteDirector)

//Genres
router.get("/genres", genres.getAllGenres)
router.post("/genres", movieOptionsValidate, handleValidationErrors, genres.insertGenre)
router.put("/genres/:id", movieOptionsValidate, handleValidationErrors, genres.updateGenre)
router.delete("/genres/:id", genres.deleteGenre)

export default router