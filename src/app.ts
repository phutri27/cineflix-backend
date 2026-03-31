import express from "express"
import "dotenv/config"
import cors from "cors"
import passport from 'passport'
import expressSession  from 'express-session'
import "./config/session"
import routes from './routes/index.route'
import { errorHandler } from "./error/error"
import { RedisStore } from "connect-redis"
import { redisClient } from "./lib/redis"
import { type RedisClientType } from "redis"
import { authorizeRoles } from "./middlewares/authorize"
import helmet from "helmet"
import { Server } from "socket.io"
import { createServer } from "http"
import { handleSubcribeInit } from "./pubsub/event-subcribe"
import bodyParser from 'body-parser'

const allowedOrigins = [
    process.env.FRONTEND_ORIGIN as string, 
    process.env.FRONTEND_SUB_ORIGIN as string
];

const app = express()

const httpServer = createServer(app)
const io = new Server(httpServer,{
  cors:{
    origin: allowedOrigins,
    credentials: true
  }
})

app.set("socketio", io)

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

app.use("/webhook", bodyParser.raw({type: 'application/json'}), routes.webhook)
app.use(express.json())

app.use(express.urlencoded({ extended: true })); 
const isProduction = process.env.NODE_ENV === 'production';
app.use(
  expressSession({
    cookie: {
      httpOnly:true,
      secure: isProduction, 
      sameSite:isProduction ? 'none' : 'lax',
      maxAge: 2 * 24 * 60 * 60 * 1000 // ms
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

import "./config/google-oauth2"

app.use("/payment", routes.checkout)
app.use("/api/login", routes.login)
app.use("/api/signup", routes.signup)
app.use("/api/movies", routes.movies)
app.use("/api/customer/profile", authorizeRoles(["USER", "ADMIN"]), routes.profile)
app.use("/api/password", routes.password)
app.use("/api/admin/dashboard", authorizeRoles(["ADMIN"]),routes.admin)
app.use("/api/cinema", routes.cinema)
app.use("/api/showtime", routes.showtime)
app.use("/api/city", routes.city)
app.use("/api/seat-type", routes.seatType)
app.use("/api/booking", routes.booking)
app.use("/api/snacks", routes.snack)
app.use("/api/vouchers", routes.voucher)

app.use(errorHandler)

await handleSubcribeInit(redisClient as RedisClientType, io)

const PORT = process.env.PORT || 3000
const server = httpServer.listen(PORT, () => {
  console.log(`Server successfully running on http://localhost:${PORT}`);
})

server.on('error', (err: any) => {
    console.error(`Failed to start server:`, err);
  
  process.exit(1);
})