import "dotenv/config"
import IORedis from "ioredis"

export const redisWorkerConnection = new IORedis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
    maxRetriesPerRequest: null,
})