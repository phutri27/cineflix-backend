import { redisClient } from "../lib/redis.js";

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
    }

    async getSignupInfo(key: string){
        const info = await redisClient.get(key)
        return info
    }

    async deleteSignupInfo(key: string){
        await redisClient.del(key)
    }
}

export const signupObj = new Signup()