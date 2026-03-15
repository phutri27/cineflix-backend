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
import { authorizeRoles } from "./middlewares/authorize"
import helmet from "helmet"

const app = express()
const allowedOrigins = [
    process.env.FRONTEND_ORIGIN, 
    process.env.FRONTEND_SUB_ORIGIN
];

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

app.use("/api/login", routes.login)
app.use("/api/signup", routes.signup)
app.use("/api/movies", routes.movies)
app.use("/api/customer/profile", authorizeRoles(["USER"]), routes.profile)
app.use("/api/password", routes.password)
app.use("/api/admin/dashboard", authorizeRoles(["ADMIN"]),routes.admin)
app.use("/api/cinema", routes.cinema)
app.use("/api/showtime", routes.showtime)

app.use(errorHandler)

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Server successfully running on http://localhost:${PORT}`);
})

server.on('error', (err: any) => {
    console.error(`Failed to start server:`, err);
  
  process.exit(1);
})