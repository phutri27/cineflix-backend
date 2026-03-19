import express from 'express'
import { getAllCities} from "../controller/city.controller.js"

const router = express.Router()

router.get("/", getAllCities)

export default router