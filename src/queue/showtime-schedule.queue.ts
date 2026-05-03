import { generateShowtime } from "../service/showtime-schedule.service.js";
import { Queue, Worker } from "bullmq";
import "dotenv/config"

const redisConnection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
}

const showtimeQueue = new Queue("showtime-schedule", {
    connection: redisConnection
})

export const initShowtime = async () => {
    await showtimeQueue.upsertJobScheduler(
        'sunday-weekly-showtime-cronjob',
        {
            pattern: "0 0 0 * * 7",
            startDate: new Date(2026, 5, 9)
        },
        {
            name: 'showtime-schedule-cron-job',
            data: {message: "Initialize showtime"}
        }
    )
}

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