import express from "express"
import "dotenv/config"
import cors from "cors"
import passport from 'passport'
import expressSession  from 'express-session'
import "../src/config/session.js"
import routes from '../src/routes/index.route.js'
import { errorHandler } from "../src/error/error.js"
import { RedisStore } from "connect-redis"
import { redisClient } from "../src/lib/redis.js"
import { authorizeRoles } from "../src/middlewares/authorize.js"
const app = express()
app.use(cors())
app.use(express.json())

app.use(express.urlencoded({ extended: true })); 

app.use(
  expressSession({
    cookie: {
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
 
app.use("/api/login", routes.login)
app.use("/api/signup", routes.signup)
app.use("/api/movies", routes.movies)
app.use("/api/customer/profile", authorizeRoles(["USER"]), routes.profile)
app.use(errorHandler)

export default app