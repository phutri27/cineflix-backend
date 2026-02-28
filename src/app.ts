import express from "express"
import "dotenv/config"
import cors from "cors"
import passport from 'passport'
import expressSession  from 'express-session'
import "./config/session.js"
import routes from './routes/index.route.js'
import { errorHandler } from "./error/error.js"
import { RedisStore } from "connect-redis"
import { redisClient } from "./lib/redis.js"
import { authorizeRoles } from "./middlewares/authorize.js"
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
app.use("/api/password", routes.password)

app.use(errorHandler)

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
  console.log(`Server successfully running on http://localhost:${PORT}`);
})

server.on('error', (err: any) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`Error: Port ${PORT} is already in use. Please kill the process or change the port.`);
  } else {
    console.error(`Failed to start server:`, err);
  }
  
  process.exit(1);
})