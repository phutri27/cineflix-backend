import { sendTicketEmail } from "../service/ticket-mail.service.js"
import { sendOTPEmail } from "../service/OTPMail.service.js"
import { Worker, type Job } from "bullmq"
import { redisWorkerConnection } from "../config/redis-worker-connection.js"
const emailWorker = new Worker('emails', async (job: Job) => {
    switch (job.name) {
        case 'ticket':
            await sendTicketEmail(job.data)
            break
        case 'otp':
            await sendOTPEmail(job.data)
            break
        default:
            throw new Error(`Unknown email type: ${job.name}`)
    }
}, {
    connection: redisWorkerConnection,
    concurrency: 3,
})

emailWorker.on('completed', (job) => {
    console.log(`[Email] ${job.name} sent`)
})

emailWorker.on('failed', (job, err) => {
    console.error(`[Email] ${job?.name} failed:`, err.message)
})
