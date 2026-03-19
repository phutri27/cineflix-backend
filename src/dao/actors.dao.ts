import { prisma } from "../lib/prisma";

class Actors {
    async getActors(){
        const actors = await prisma.actor.findMany({
            orderBy:{
                createdAt: 'desc'
            }
        })
        return actors
    }

    async insert(name: string){
        const actor = await prisma.actor.create({
            data:{
                name: name
            }
        })

        return actor
    }

    async update(id: string, name: string){
        const actor = await prisma.actor.update({
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
        const actor = await prisma.actor.delete({
            where:{
                id: id
            }
        })

        return actor
    }
}

export const actorObj = new Actors()
