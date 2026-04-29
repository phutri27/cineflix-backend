import { prisma } from "../lib/prisma.js";

class Directors {
    async getDirectors(){
        const directors = await prisma.director.findMany({
            orderBy:{
                createdAt: 'desc'
            }
        })
        return directors
    }

    async insert(name: string){
       await prisma.director.create({
            data:{
                name: name
            }
        })
    }

    async update(id: string, name: string){
        await prisma.director.update({
            data:{
                name: name
            },
            where:{
                id: id
            }
        })
    }

    async delete(id: string){
         await prisma.director.delete({
            where:{
                id: id
            }
        })
    }
}

export const directorObj = new Directors()
