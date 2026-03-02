import { prisma } from "../lib/prisma";

class Screen{
    async getScreenByCinema(cinemaId: string){
        const screens = await prisma.screen.findMany({
            where:{
                cinemaId: cinemaId
            }
        })

        return screens
    }

    async insertScreen(cinemaId: string, name: string){
        await prisma.screen.create({
            data:{
                cinemaId: cinemaId,
                name: name
            }
        })
    }

    async updateScreen(id: string, name: string){
        await prisma.screen.update({
            data:{
                name: name
            },
            where:{
                id: id
            }
        })
    }

    async deleteScreen(id: string){
        await prisma.screen.delete({
            where:{
                id: id
            }
        })
    }
}

export const screenObj = new Screen()