import { Queue} from "bullmq"
import { type TicketResponse } from "../types/ticket-types.js"
import { redisQueueConnection } from "../config/redis-queue-connection.js"

const emailQueue = new Queue('emails', {
    connection: redisQueueConnection,
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


