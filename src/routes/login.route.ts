import express from 'express'
import * as login from "../controller/login.controller.js"

const router = express.Router()

router.post("/", login.loginPost)

export default router