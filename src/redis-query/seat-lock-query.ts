import { redisClient } from "../lib/redis";
import { prisma } from "../lib/prisma";

class SeatLock {
    async lockSeat(showTimeId: string, seatId: string, userId: string): Promise<boolean> {
        const lockKey = `lock:showTime:${showTimeId}:seat:${seatId}`
        const result = await redisClient.set(lockKey, userId, {expiration: {type: "EX", value: 300}, condition: 'NX'})
        
        if (result){
            const tracker = `tracker:showtimes:${showTimeId}`
            await redisClient.sAdd(tracker, seatId)
            await redisClient.expire(tracker, 86400)    
        }
        return result === "OK"
    }

    async unlockSeat(showTimeId: string, seatId: string){
        const lockKey = `lock:showTime:${showTimeId}:seat:${seatId}`
        await redisClient.del(lockKey)
    }

    async getAllLockedSeat(showTimeId: string){
        const confirmedBookings = await prisma.ticket.findMany({
            where:{
                showtimeId: showTimeId,
                booking:{
                    status: "CONFIRMED"
                }
            },
            select:{
                seatId: true
            }
        })

        const confirmedSeatIds = confirmedBookings.map((booking) => booking.seatId)

        const trackedSeats = await redisClient.sMembers(`tracker:showtimes:${showTimeId}`)
        let pendingSeats: string[] = []
        if (trackedSeats.length > 0){
            const keysToCheck = trackedSeats.map((seat) => `lock:showTime:${showTimeId}:seat:${seat}`)
            const lockedSeats = await redisClient.mGet(keysToCheck)
            pendingSeats = trackedSeats.filter((seat, index) => lockedSeats[index] !== null)
        }

        const allLockedSeats = [...new Set([...confirmedSeatIds, ...pendingSeats])]
        return allLockedSeats
    }
}

export const seatLockObj = new SeatLock()