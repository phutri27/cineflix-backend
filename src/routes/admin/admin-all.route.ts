import express from 'express'
import adminMovieRoutes from './admin-movie.route.js'
import adminSnackRoutes from './admin-snack.route.js'
import adminVoucherRoutes from './admin-voucher.route.js'
import adminCinemaRoutes from './admin-cinema.route.js'
import adminCityRoutes from './admin-city.route.js'
import adminScreenRoutes from './admin-screens.js'
import adminSeatRoutes from './admin-seats.js'
import adminSeatTypeRoutes from "./admin-seat-type.js"
import adminActorRoutes from './admin-actor.route.js'
import adminDicrectorRoutes from './admin-director.route.js'
import adminGenreRoutes from './admin-genre.route.js'
import adminUserRoutes from './admin-user.route.js'
import adminShowtimeRoutes from './admin-showtime.route.js'
const adminRouter = express.Router()

adminRouter.use("/movies", adminMovieRoutes)
adminRouter.use("/snacks", adminSnackRoutes)
adminRouter.use("/vouchers", adminVoucherRoutes)
adminRouter.use("/cinemas", adminCinemaRoutes)
adminRouter.use("/cities", adminCityRoutes)
adminRouter.use("/screens", adminScreenRoutes)
adminRouter.use("/seats", adminSeatRoutes)
adminRouter.use("/seat-type", adminSeatTypeRoutes)
adminRouter.use("/actors", adminActorRoutes)
adminRouter.use("/directors", adminDicrectorRoutes)
adminRouter.use("/genres", adminGenreRoutes)
adminRouter.use("/users", adminUserRoutes)
adminRouter.use("/showtimes", adminShowtimeRoutes)

export default adminRouter