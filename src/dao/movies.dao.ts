import { prisma } from "../lib/prisma";

class Movies {
    async getAllComingMovies(){
        const currentDate = new Date()
        const movies = await prisma.movie.findMany({
            where:{
                premiereDate: {
                    gt: currentDate
                }
            },
            orderBy:{
                premiereDate: 'asc'
            }
        })
        return movies
    }

    async getAllShowingMovies(){
        const currentDate = new Date()
        const movies = await prisma.movie.findMany({
            where: {
                premiereDate: {
                    lte: currentDate
                }
            },
        })
        return movies
    }

    async getMoviesByGenre(genre: string){
        const movies = await prisma.movie.findMany({
            where:{
                genres:{
                    some:{
                        genre:{
                            name: genre
                        }
                    }
                }
            }
        })
    }

    async getMoviesByTitle(title: string){
        const movie = await prisma.movie.findMany({
            where:{
                title:title
            }
        })
        return movie
    }

    async insert(title: string, plot: string, posterUrl: string, duration: number, premiereDate: Date, rated: string){
        const movie = await prisma.movie.create({
            data:{
                title: title,
                plot: plot,
                posterUrl: posterUrl,
                durationMin: duration,
                premiereDate: premiereDate,
                rated: rated
            }
        })

        return movie
    }

    async update(id: string, title: string, plot: string, posterUrl: string, duration: number, premiereDate: Date, rated: string){
        const movie = await prisma.movie.update({
            data:{
                title: title,
                plot: plot,
                posterUrl: posterUrl,
                durationMin: duration,
                premiereDate: premiereDate,
                rated: rated
            },
            where:{
                id: id
            }
        })

        return movie
    }

    async delete(id: string){
        const movie = await prisma.movie.delete({
            where:{
                id: id
            }
        })
        return movie
    }
}

export const moviesObj = new Movies()