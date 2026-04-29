import signup from './signup.route.js'
import login from './login.route.js'
import movies from "./movies.route.js"
import profile from './profile.route.js'
import password from "./password.route.js"
import admin from "./admin/admin-all.route.js"
import cinema from "./cinema.route.js"
import screen from "./screen.route.js"
import showtime from "./showtime.route.js"
import city from "./city.route.js"
import seatType from "./seat-type.route.js"
import booking from "./booking.route.js"
import snack from './snack.route.js'
import voucher from './voucher.route.js'
import checkout from './checkout-session.route.js'
import webhook from './fulfill-payment.route.js'
import notifications  from './notification.route.js'
import seats from './seats.route.js'
import user from './user.route.js'
import logout from './logout.route.js'
import transaction from './transaction.route.js'

export default {
    signup,
    login,
    movies,
    profile,
    password,
    admin,
    cinema,
    screen,
    showtime,
    city,
    seatType,
    booking,
    snack,
    voucher,
    checkout,
    webhook,
    notifications,
    seats,
    user,
    logout,
    transaction
}