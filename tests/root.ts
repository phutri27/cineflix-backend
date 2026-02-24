import express from "express"
import routes from "../src/routes/index.route.js"

const app = express()

app.use(express.urlencoded({ extended: true }))
app.use("/api/login", routes.login)
app.use("/api/signup", routes.signup)

export default app