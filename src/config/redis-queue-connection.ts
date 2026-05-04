import "dotenv/config"

export const redisQueueConnection = {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT) || 6379,
}