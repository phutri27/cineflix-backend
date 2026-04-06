import { prisma } from "../lib/prisma";

class Notification{
    async createNoti(title: string, content: string, userId: string){
        const noti = await prisma.notifications.create({
            data:{
                title: title,
                content: content,
                userId: userId
            }
        })
        return noti
    }

    async getAllNoti(userId: string, page: number = 1, limit: number = 5) {
        const skipAmount = (page - 1) * limit
        const totalBookings = await prisma.notifications.count({
            where:{
                userId: userId
            }
        })

        const response = await prisma.notifications.findMany({
            where:{
                userId: userId
            },
            take: limit,
            skip: skipAmount,
            orderBy:{
                createdAt: "desc"
            }
        })

        return {
            data: response, 
            totalItems: totalBookings,
            totalPages: Math.ceil(totalBookings / limit),
            currentPage: page
        }
    }

    async updateNotiStatus(notiId: string){
        const response = await prisma.notifications.update({
            where:{
                id: notiId
            },
            data:{
                readStatus: true
            }
        })  
        return response 
    }

    async deleteNotiQuery(notiId: string){
        const response = await prisma.notifications.delete({
            where:{
                id: notiId
            }
        })
        return response
    }
}

export const notiObj = new Notification()