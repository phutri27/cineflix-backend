import signup from './signup.route'
import login from './login.route'
import movies from "./movies.route"
import profile from './profile.route'
import password from "./password.route"
import admin from "./admin/admin-all.route"
import cinema from "./cinema.route"
import screen from "./screen.route"
import showtime from "./showtime.route"
import city from "./city.route"
import seatType from "./seat-type.route"
import booking from "./booking.route"
import snack from './snack.route'
import voucher from './voucher.route'
import checkout from './checkout-session.route'
import webhook from './fulfill-payment.route'
import notifications  from './notification.route'
import seats from './seats.route'
import user from './user.route'
import logout from './logout.route'
import transaction from './transaction.route'

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