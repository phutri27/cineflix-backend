import { redisClient } from "../lib/redis";

class OTP{
    async saveOTP(otp: string, userCred: string){
        await redisClient.set(`otp:${userCred}`, otp, {EX:900})
    }

    async getOTP(userId: string){
        const otp = await redisClient.get(`otp:${userId}`)
        return otp
    }

    async deleteOTP(userId: string){
        await redisClient.del(`otp:${userId}`)
    }
}

export const OTPobj = new OTP()