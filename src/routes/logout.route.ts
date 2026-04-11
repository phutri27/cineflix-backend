import express from 'express'
import { logoutPost } from "../controller/logout.controller";

const router = express.Router()

router.post("/", logoutPost)

export default router