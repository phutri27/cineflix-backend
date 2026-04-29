import express from 'express'
import * as users from "../../controller/user.controller.js"
const router = express.Router()

router.get("/", users.getAllUser)

export default router