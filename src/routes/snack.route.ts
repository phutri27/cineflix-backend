import express from 'express'
import { getAllSnacks } from '../controller/snacks.controller'

const router = express.Router()

router.get("/", getAllSnacks)

export default router