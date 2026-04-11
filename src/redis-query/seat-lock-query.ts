import { redisClient } from "../lib/redis";
import { prisma } from "../lib/prisma";

class SeatLock {
    async lockSeat(showTimeId: string, seatId: string, bookingId: string): Promise<boolean> {
        const lockKey = `lock:showTime:${showTimeId}:seat:${seatId}`
        const result = await redisClient.set(lockKey, bookingId, {expiration: {type: "EX", value: 360}, condition: 'NX'})
            
        if (result){
            const tracker = `tracker:showtimes:${showTimeId}`
            await redisClient.sAdd(tracker, seatId)
            await redisClient.expire(tracker, 86400)    
        }
        return result === "OK"
    }

    async getLockSeatValue(showTimeId: string, seatId: string): Promise<string | null>{
        const lockKey = `lock:showTime:${showTimeId}:seat:${seatId}`
        const result = await redisClient.get(lockKey)
        return result
    }

    async expireSeat(showTimeId: string, seatId: string){
        const lockKey = `lock:showTime:${showTimeId}:seat:${seatId}`
        await redisClient.expire(lockKey, 120)
    }

    async getAllLockedSeat(showTimeId: string){
        const confirmedBookings = await prisma.ticket.findMany({
            where:{
                booking:{
                    AND:[
                        {showtimeId: showTimeId},
                        {status: "PAID"}
                    ]
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