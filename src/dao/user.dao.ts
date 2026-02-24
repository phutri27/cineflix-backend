import { prisma } from "../lib/prisma";

class User {
    async findUserById(userId: string){
        const user = await prisma.user.findUnique({
            where: {
                id: userId
            },
            select:{
                id: true,
                email: true,
                role: true
            }
        })
        return user
    }

    async getEmail (email: string){
        const user = await prisma.user.findUnique({
            where:{
                email: email
            }
        })
        return user
    }

    async createUser(email: string, hashed_password: string, first_name: string, last_name: string){
        const user = await prisma.user.create({
            data:{
                email: email,
                hashed_password: hashed_password,
                first_name: first_name,
                last_name: last_name
            }
        })
        return user
    }
}

export const userObj = new User()