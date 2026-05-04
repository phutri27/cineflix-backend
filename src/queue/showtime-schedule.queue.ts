import { Queue } from "bullmq";
import { redisQueueConnection } from "../config/redis-queue-connection.js";

const showtimeQueue = new Queue("showtime-schedule", {
    connection: redisQueueConnection
})

export const initShowtime = async () => {
    await showtimeQueue.upsertJobScheduler(
        'sunday-weekly-showtime-cronjob',
        {
            pattern: "0 0 3 * * *",
        },
        {
            name: 'showtime-schedule-cron-job',
            data: {message: "Initialize showtime"}
        }
    )
}
