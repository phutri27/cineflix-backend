import { rateLimit } from 'express-rate-limit'
import { RedisStore } from 'rate-limit-redis'
import { redisClient } from '../lib/redis'

export const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 25,
    store: new RedisStore({
        sendCommand: (...args: string[]) => redisClient.sendCommand(args)
    }),
    message: { errors: 'Too many requests, please try again later.' },
    standardHeaders: true,
	legacyHeaders: false,
	ipv6Subnet: 56,
})