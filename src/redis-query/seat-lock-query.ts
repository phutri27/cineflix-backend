import { redisClient } from "../lib/redis";

class SeatLock {
    async lockSeat(showTimeId: string, seatId: string, userId: string): Promise<boolean | undefined> {
        const lockKey = `lock:showTime:${showTimeId}:seat:${seatId}`
        const result = await redisClient.set(lockKey, userId, {expiration: {type: "EX", value: 300}, condition: 'NX'})
        return result === "OK"
    }

    async unlockSeat(showTimeId: string, seatId: string){
        const lockKey = `lock:showTime:${showTimeId}:seat:${seatId}`
        await redisClient.del(lockKey)
    }
}

export const seatLockObj = new SeatLock()