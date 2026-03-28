import { type RedisClientType } from "redis"
import { Server } from "socket.io" 

export const handleSubcribeInit = async (redisClient: RedisClientType, io: Server) => {
    try {
        await redisClient.configSet("notify-keyspace-events", "Exg")

        const subClient = redisClient.duplicate()
        await subClient.connect()

        const expiredChannel = '__keyevent@0__:expired';
        const delChannel = '__keyevent@0__:del';

        const handleSubcribe = async (message: string, channel: string) => {

            if (message.startsWith(`lock:showTime`)){
                const parts = message.split(':')
                const showtimeId = parts[2]
                const seatId = parts[4]
                io.emit('seat-expired', seatId)
            }
        }
        
        await subClient.subscribe(expiredChannel, handleSubcribe)
        await subClient.subscribe(delChannel, handleSubcribe)
    } catch (error) {
        console.error(error)
    }
}