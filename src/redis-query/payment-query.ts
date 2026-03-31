import { redisClient } from "../lib/redis";

class Payment{
    async setPaymentSession(sessionId: string, userId: string): Promise<boolean> {
        const lockKey = `lock:payment:${sessionId}`
        const result = await redisClient.set(lockKey, userId, {expiration: {type: 'EX', value: 1000 * 60 * 24},condition: 'NX'})

        return result === "OK"
    }
}

export const paymentObj = new Payment()