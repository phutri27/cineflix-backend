import { prisma } from "../lib/prisma";
import type { movie } from "../types/movie-types";

export const movieWithDetailsInclude = {
    genres:{
        select:{
            id: true,
            name: true
        }
    },
    directors: {
        select:{
            id: true,
            name: true
        }
    },
    actors: {
        select: {
            id: true,   
            name: true
        }
    }
};


class Movies {
    async getAllMovies(){
        const movies = await prisma.movie.findMany({
            where:{
                isActive: true
            },
            orderBy:{
                premiereDate: "desc"
            },
            include: {
                ...movieWithDetailsInclude,
                showtimes:{
                    include:{
                        _count:{
                            select:{
                                bookings: true
                            }
                        }
                    }
                }
            }
        })

        return movies
    }

    async getAllComingMovies(){
        const currentDate = new Date()
        const movies = await prisma.movie.findMany({
            where:{
                premiereDate: {
                    gt: currentDate
                },
                isActive: true
            },
            orderBy:{
                premiereDate: 'asc'
            },
            include: movieWithDetailsInclude
        })
        return movies
    }

    async getAllShowingMovies(){
        const currentDate = new Date()
        const movies = await prisma.movie.findMany({
            where: {
                premiereDate: {
                    lte: currentDate
                },
                isActive: true
            },
            include: movieWithDetailsInclude
        })
        return movies
    }

    async getUnactiveMovies(){
        const movies = await prisma.movie.findMany({
            where:{
                isActive: false
            },
            include: movieWithDetailsInclude
        })
        return movies
    }

    async getMoviesByTitle(title: string){
        const movies = await prisma.movie.findMany({
            where:{
                title:{
                    contains: title,
                    mode: 'insensitive'
                },
                isActive:true
            },
            include: movieWithDetailsInclude
        })
        return movies
    }

    async getSpecificMovie(movieId: string){
        const movie = await prisma.movie.findUnique({
            where:{
                id: movieId,
                isActive: true
            },
            include: movieWithDetailsInclude
        })
        return movie
    }

    async insert(data: movie){
        const movie = await prisma.movie.create({
            data:{
                title: data.title,
                plot: data.plot,
                posterUrl: data.posterUrl,
                posterPublicId: data.posterPublicId,
                durationMin: Number(data.duration),
                premiereDate: new Date(data.premiere_date),
                rated: data.rated,
                trailerUrl: data.trailerUrl,
                genres: {
                    connect: data.genre_option.map((id: string) => ({ id }))
                },
                actors: {
                    connect: data.actors.map((id: string) => ({ id }))
                },
                directors: {
                    connect: data.directors.map((id: string) => ({ id }))
                }
            }
        })

        return movie
    }

    async update(id: string, data: movie){
        const movie = await prisma.movie.update({
            data:{
                title: data.title,
                plot: data.plot,
                posterUrl: data.posterUrl,
                posterPublicId: data.posterPublicId,
                durationMin: Number(data.duration),
                trailerUrl: data.trailerUrl,
                premiereDate: new Date(data.premiere_date),
                rated: data.rated,
                genres: {
                    set: data.genre_option.map((id: string) => ({ id }))
                },
                actors: {
                    set: data.actors.map((id: string) => ({ id }))
                },
                directors: {
                    set: data.directors.map((id: string) => ({ id }))
                }
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

    async movieStatus(id: string, isActive: boolean){
        await prisma.movie.update({
            where:{
                id: id
            },
            data:{
                isActive: isActive
            }
        })
    }
}

export const moviesObj = new Movies()