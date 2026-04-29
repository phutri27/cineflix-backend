import express from 'express'
import { getAllSnacks } from '../controller/snacks.controller.js'

const router = express.Router()

router.get("/", getAllSnacks)

export default router