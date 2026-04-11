import express from 'express'
import { verifyUserId } from "../controller/user.controller";

const router = express.Router()

router.get("/", verifyUserId)

export default router