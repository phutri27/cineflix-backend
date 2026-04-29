import { redisClient } from "../lib/redis.js"

class ResetToken {
    async saveResetToken(userId: string, resetToken: string){
        await redisClient.set(`resetToken:${userId}`, resetToken, {EX: 300})
    }

    async getResetToken(userId: string){
        const token = await redisClient.get(`resetToken:${userId}`)
        return token 
    }

    async delResetToken(userId: string){
        await redisClient.del(`resetToken:${userId}`)
    }
}

export const resetTokenObj = new ResetToken()