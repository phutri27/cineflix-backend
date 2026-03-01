import { redisClient } from "../lib/redis";

class Signup{
    async saveSignupInfo(email: string, hashed_password: string, first_name: string, last_name: string){
        const payload = JSON.stringify({
            pw: hashed_password,
            first_name: first_name,
            last_name: last_name
        });
        const result = await redisClient.set(email, payload, {
            EX: 900,
            NX: true
        });
        
        if (!result) {
            throw new Error("An OTP has already been sent to this email. Please check your inbox or wait 15 minutes to try again.");
        }
    }

    async getSignupInfo(key: string){
        const info = await redisClient.get(key)
        return info
    }
}

export const signupObj = new Signup()