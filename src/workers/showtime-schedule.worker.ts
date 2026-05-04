import { redisConnection } from "../config/redis-connection.js"
import { generateShowtime } from "../service/showtime-schedule.service.js"
import { Worker } from "bullmq"

const showtimeWorker = new Worker("showtime-schedule", async (job) => {
    console.log('[Worker] Generating showtimes...')
    await generateShowtime()
    console.log('[Worker] Showtimes generated')
}, {
    connection: redisConnection
})

showtimeWorker.on('failed', (job, err) => {
    console.error('[Worker] Showtime generation failed:', err.message)
})