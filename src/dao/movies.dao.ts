import { prisma } from "../lib/prisma";

export const movieWithDetailsInclude = {
    genres:{
        select:{
            name: true
        }
    },
    directors: {
        select:{
            name: true
        }
    },
    actors: {
        select: {
            name: true
        }
    }
};


class Movies {
    async getAllMovies(){
        const movies = await prisma.movie.findMany({
            include: movieWithDetailsInclude
        })

        return movies
    }

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
                }
            },
            include: movieWithDetailsInclude
        })
        return movies
    }

    async getMoviesByGenre(genre: string){
        const movies = await prisma.movie.findMany({
            where:{
                genres:{
                    some:{
                        name: genre
                    }
                }
            },
            include: movieWithDetailsInclude
        })
        return movies
    }

    async getMoviesByTitle(title: string){
        const movies = await prisma.movie.findMany({
            where:{
                title:title
            },
            include: movieWithDetailsInclude
        })
        return movies
    }

    async getSpecificMovie(movieId: string){
        const movie = await prisma.movie.findUnique({
            where:{
                id: movieId
            }
        })
        return movie
    }

    async insert(title: string, plot: string, posterUrl: string, duration: number, premiereDate: Date, rated: string,
        genre_option: string[], actors: string[], directors: string[]
    ){
        const movie = await prisma.movie.create({
            data:{
                title: title,
                plot: plot,
                posterUrl: posterUrl,
                durationMin: duration,
                premiereDate: premiereDate,
                rated: rated,
                genres: {
                    connect: genre_option.map((id: string) => ({ id }))
                },
                actors: {
                    connect: actors.map((id: string) => ({ id }))
                },
                directors: {
                    connect: directors.map((id: string) => ({ id }))
                }
            }
        })

        return movie
    }

    async update(id: string, title: string, plot: string, posterUrl: string, duration: number, premiereDate: Date, rated: string,
        genre_option: string[], actors: string[], directors: string[]){
        const movie = await prisma.movie.update({
            data:{
                title: title,
                plot: plot,
                posterUrl: posterUrl,
                durationMin: duration,
                premiereDate: premiereDate,
                rated: rated,
                genres: {
                    connect: genre_option.map((id: string) => ({ id }))
                },
                actors: {
                    connect: actors.map((id: string) => ({ id }))
                },
                directors: {
                    connect: directors.map((id: string) => ({ id }))
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

}

export const moviesObj = new Movies()