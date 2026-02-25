import { prisma } from "../lib/prisma";

class Directors {
    async insert(name: string){
        const actor = await prisma.director.create({
            data:{
                name: name
            }
        })

        return actor
    }

    async update(id: string, name: string){
        const actor = await prisma.director.update({
            data:{
                name: name
            },
            where:{
                id: id
            }
        })

        return actor
    }

    async delete(id: string){
        const actor = await prisma.director.delete({
            where:{
                id: id
            }
        })

        return actor
    }
}

export const actorObj = new Directors()
