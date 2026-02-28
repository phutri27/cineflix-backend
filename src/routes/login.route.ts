import express from 'express'
import * as login from "../controller/login.controller.js"
import passport from 'passport'


const router = express.Router()

router.get("/auth/google", passport.authenticate('google'))
router.get("/auth/google/callback", passport.authenticate('google', { failureRedirect: "http://localhost:5173/login", session: true}), login.googleRedirectToAppilcation)

router.post("/", login.loginPost)

export default router