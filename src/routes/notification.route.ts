import express from 'express'
import * as notis from '../controller/notifications.controller'

const router = express.Router()

router.get("/", notis.getUserNotis)
router.patch("/:id", notis.updateNoti)
router.delete("/:id", notis.deleteNoti)

export default router