import express from 'express'
import * as signup from "../controller/signup.controller.js"

const router = express.Router()

router.post("/", signup.signupPost)

export default router