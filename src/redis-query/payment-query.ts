import { redisClient } from "../lib/redis";

class Payment{
    async setPaymentSession(sessionId: string, userId: string): Promise<boolean> {
        const lockKey = `lock:payment:${sessionId}`
        const result = await redisClient.set(lockKey, userId, {expiration: {type: 'EX', value: 86400},condition: 'NX'})
        return result === "OK"
    }

    async setCheckoutSession(sessionId: string, userId: string) {
        const lockKey = `lock:cs:${sessionId}`
        await redisClient.set(lockKey, userId, {expiration: {type: 'EX', value: 300}})
    }

    async deleteCheckoutSession(sessionId: string) {
        const lockKey =`lock:cs:${sessionId}`
        await redisClient.del(lockKey)
    }
}

export const paymentObj = new Payment()