import { redisClient } from "../lib/redis.js";

class OTP{
    async saveOTP(otp: string, userCred: string){
        await redisClient.set(`otp:${userCred}`, otp, {EX:900})
    }

    async getOTP(userCred: string){
        const otp = await redisClient.get(`otp:${userCred}`)
        return otp
    }

    async deleteOTP(userCred: string){
        await redisClient.del(`otp:${userCred}`)
    }
}

export const OTPobj = new OTP()