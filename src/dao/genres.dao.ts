import { prisma } from "../lib/prisma";

class Genres{
    async insert(name: string){
        const genre = await prisma.genre.create({
            data:{
                name: name
            }
        })

        return genre
    }

    async update(name: string, id: string){
        const genre = await prisma.genre.update({
            data:{
                name: name
            },
            where:{
                id: id
            }
        })

        return genre
    }

    async getAllGenres(){
        const genres = await prisma.genre.findMany({
            orderBy:{
                createdAt: 'desc'
            }
        })
        return genres
    }

    async delete(id: string){
        const genre = await prisma.genre.delete({
            where:{
                id: id
            }
        })

        return genre
    }
}

export const genreObj = new Genres()