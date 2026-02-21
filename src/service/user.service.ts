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
}

export const userObj = new User()