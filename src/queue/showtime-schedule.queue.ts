import { Queue } from "bullmq";
import { redisConnection } from "../config/redis-connection.js";

const showtimeQueue = new Queue("showtime-schedule", {
    connection: redisConnection
})

export const initShowtime = async () => {
    await showtimeQueue.upsertJobScheduler(
        'sunday-weekly-showtime-cronjob',
        {
            pattern: "0 0 0 * * *",
        },
        {
            name: 'showtime-schedule-cron-job',
            data: {message: "Initialize showtime"}
        }
    )
}
