import { type RedisClientType } from "redis"
import { Server } from "socket.io" 
import { stripe } from "../controller/stripe.controller"
import { bookingObj } from "../dao/booking.dao"
import { seatLockObj } from "../redis-query/seat-lock-query"
import { transactionObj } from "../dao/transaction.dao"

export const handleSubcribeInit = async (redisClient: RedisClientType, io: Server) => {
    try {
        await redisClient.configSet("notify-keyspace-events", "Exg")

        const subClient = redisClient.duplicate()
        await subClient.connect()

        const expiredChannel = '__keyevent@0__:expired';
        const delChannel = '__keyevent@0__:del';

        const handleSubcribe = async (message: string, channel: string) => {
            if (message.startsWith(`lock:showTime`) && channel.startsWith('__keyevent@0__:expired')){
                const parts = message.split(':')
                const showtimeId = parts[2]
                const seatId = parts[4]
                io.emit('seat-expired', seatId)
            }
            if (message.startsWith(`lock:cs`)){
                const parts = message.split(':')
                const sessionId = parts[2]
                const data = await transactionObj.getCancelTransaction(sessionId!)
                const bookingId = data?.bookingId
                if (data?.status === "PENDING"){
                    if (data.provider === "Stripe"){
                        const session = await stripe.checkout.sessions.retrieve(sessionId!);
                        if (session.status === 'complete') {
                            return; 
                        }
                        if (session.status === 'open') {
                            await stripe.checkout.sessions.expire(sessionId!);
                        }
                    }
                    await transactionObj.updateTransactionStatus(data.id, "CANCELLED")
                }
                if (channel.startsWith('__keyevent@0__:expired') && data?.booking.status === "PENDING"){
                    await bookingObj.updateBookingStatus(bookingId!, "CANCELLED")
                    await transactionObj.updateTransactionWhenBookingExpire(bookingId!)
                }
            }
        }
        
        await subClient.subscribe(expiredChannel, handleSubcribe)
        await subClient.subscribe(delChannel, handleSubcribe)
    } catch (error) {
        console.error(error)
    }
}