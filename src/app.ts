import express from "express"
import "dotenv/config"
import cors from "cors"
import passport from 'passport'
import expressSession  from 'express-session'
import routes from './routes/index.route.js'
import { errorHandler } from "./error/error.js"
import { RedisStore } from "connect-redis"
import { redisClient } from "./lib/redis.js"
import { type RedisClientType } from "redis"
import { authorizeRoles } from "./middlewares/authorize.js"
import helmet from "helmet"
import { Server } from "socket.io"
import { createServer } from "http"
import { handleSubcribeInit } from "./pubsub/event-subcribe.js"
import bodyParser from 'body-parser'
import { limiter } from "./service/rate-limit.service.js"
import { initShowtime } from "./queue/showtime-schedule.queue.js"

const allowedOrigins = [
  process.env.FRONTEND_ORIGIN as string, 
];

const app = express()

const httpServer = createServer(app)
const io = new Server(httpServer,{
  cors:{
    origin: allowedOrigins,
    credentials: true
  },
  connectionStateRecovery: {}
})

app.set("socketio", io)
io.on("connection", (socket) => {
  socket.on("join-room", (userId) => {
    socket.join(userId)
  })

  socket.on("leave-room", (userId) => {
    socket.leave(userId)
  })

})

app.use(helmet())
app.use(cors({
    origin: (origin, callback) => {
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
}))
app.set('trust proxy', 1)
app.use("/api/webhook", bodyParser.raw({type: 'application/json'}), routes.webhook)
app.use(express.json())

app.use(express.urlencoded({ extended: true })); 
app.use(
  expressSession({
    cookie: {
      httpOnly:true,
      secure: true, 
      sameSite: 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000
    },
    secret: process.env.SECRET_KEY as string,
    resave: false,
    saveUninitialized: false,
    store: new RedisStore({
      client: redisClient,
      prefix: "sess:"
    })
  })
);

app.use(passport.initialize())
app.use(passport.session())

import "./config/session.js"
import "./config/google-oauth2.js"

app.use("/api/payment", routes.checkout)
app.use("/api/login", limiter, routes.login)
app.use("/api/signup", limiter, routes.signup)
app.use("/api/movies", routes.movies)
app.use("/api/customer/profile", authorizeRoles(["USER", "ADMIN"]), routes.profile)
app.use("/api/password", limiter, routes.password)
app.use("/api/admin/dashboard", authorizeRoles(["ADMIN"]),routes.admin)
app.use("/api/cinema", routes.cinema)
app.use("/api/showtime", routes.showtime)
app.use("/api/city", routes.city)
app.use("/api/seat-type", routes.seatType)
app.use("/api/booking", routes.booking)
app.use("/api/snacks", routes.snack)
app.use("/api/vouchers", routes.voucher)
app.use("/api/notifications", routes.notifications)
app.use("/api/seats", routes.seats)
app.use("/api/user", routes.user)
app.use("/api/logout", routes.logout)
app.use("/api/transaction", routes.transaction)

app.use(errorHandler)

await handleSubcribeInit(redisClient as RedisClientType, io)

const PORT = process.env.PORT || 3000
const server = httpServer.listen(PORT, async () => {
  console.log(`Server successfully running on http://localhost:${PORT}`);
  await initShowtime()
})

server.on('error', (err: any) => {
    console.error(`Failed to start server:`, err);
  
  process.exit(1);
})