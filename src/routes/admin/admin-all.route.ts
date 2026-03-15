import express from 'express'
import adminMovieRoutes from './admin-movie.route'
import adminSnackRoutes from './admin-snack.route'
import adminVoucherRoutes from './admin-voucher.route'
import adminCinemaRoutes from './admin-cinema.route'
import adminCityRoutes from './admin-city.route'
import adminScreenRoutes from './admin-screens'
import adminSeatRoutes from './admin-seats'
import adminSeatTypeRoutes from "./admin-seat-type"
import adminActorRoutes from './admin-actor.route'
import adminDicrectorRoutes from './admin-director.route'
import adminGenreRoutes from './admin-genre.route'
import adminUserRoutes from './admin-user.route'
import adminShowtimeRoutes from './admin-showtime.route'
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