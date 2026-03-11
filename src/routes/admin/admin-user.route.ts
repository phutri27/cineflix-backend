import express from 'express'
import * as users from "../../controller/user.controller"
const router = express.Router()

router.get("/users", users.getAllUser)

export default router