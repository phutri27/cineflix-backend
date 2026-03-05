import { prisma } from "../lib/prisma";

class Snack{
    async getAllSnacks(){
        const snacks = await prisma.snack.findMany()
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

    async insert(name: string, price: number, imageUrl: string){
        const snack = await prisma.snack.create({
            data:{
                name: name,
                price: price,
                imageUrl: imageUrl
            }
        })
        return snack
    }

    async update(id: string, name: string, price: number, imageUrl: string){
        const snack = await prisma.snack.update({
            where:{
                id: id
            },
            data:{
                name: name,
                price: price,
                imageUrl: imageUrl
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