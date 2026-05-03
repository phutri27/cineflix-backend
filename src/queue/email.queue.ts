import { Queue, Worker, type Job } from "bullmq"
import { sendTicketEmail } from "../service/ticket-mail.service.js"
import { sendOTPEmail } from "../service/OTPMail.service.js"
import { type TicketResponse } from "../types/ticket-types.js"
import "dotenv/config"

const redisConnection = {
    host: process.env.REDIS_HOST || 'localhost',
    port: Number(process.env.REDIS_PORT) || 6379,
}

const emailQueue = new Queue('emails', {
    connection: redisConnection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: 1000,
        removeOnFail: 5000,
    }
})

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
    connection: redisConnection,
    concurrency: 3,
})

emailWorker.on('completed', (job) => {
    console.log(`[Email] ${job.name} sent`)
})

emailWorker.on('failed', (job, err) => {
    console.error(`[Email] ${job?.name} failed:`, err.message)
})

export const queueTicketEmail = async (userEmail: string, tickets: TicketResponse[], bookingId: string) => {
    await emailQueue.add("ticket", {
        userEmail,
        tickets,
        bookingId
    })
}

export const queueOTPEmail = async (userEmail: string, userCred: string) => {
    await emailQueue.add("otp", {
        userEmail,
        userCred
    })
}
