import { prisma } from "../lib/prisma";

export interface SnackType {
    name: string
    price: number
    imageUrl: string
    imagePublicId: string
}

class Snack{
    async getAllSnacks(){
        const snacks = await prisma.snack.findMany({
            orderBy:{
                createdAt: 'desc'
            },
            omit:{
                createdAt: true,
                imagePublicId: true
            }
        })
        return snacks
    }

    async getSpecficSnacK(snackId: string){
        const snack = await prisma.snack.findUnique({
            where:{
                id: snackId
            }
        })
        return snack
    }

    async insert(data: SnackType){
        const snack = await prisma.snack.create({
            data:{
                name: data.name,
                price: data.price,
                imageUrl: data.imageUrl,
                imagePublicId: data.imagePublicId
            }
        })
        return snack
    }

    async update(id: string, data: SnackType){
        const snack = await prisma.snack.update({
            where:{
                id: id
            },
            data:{
                name: data.name,
                price: data.price,
                imageUrl: data.imageUrl,
                imagePublicId: data.imagePublicId   
            }
        })
    }

    async delete(id: string){
        const snack = await prisma.snack.delete({
            where:{
                id: id
            }
        })
        return snack
    }
}

export const snackObj = new Snack()