import type { deleteMovie } from "../controller/movies.controller";
import { prisma } from "../lib/prisma";

export interface CinemaTypeProp  {
    name: string
    cityId: number
    address: string
    hotline: string
}

class Cinema{
    async getCinemaByCity(cityId: number){
        const cinemas = await prisma.cinema.findMany({
            where:{
                cityId: cityId
            },
            orderBy:{
                createdAt: 'desc'
            }
        })
        return cinemas
    }

    async getMovieByCinema(cinemaId: string){
        const movies = await prisma.cinema.findMany({
            where:{
                id: cinemaId
            },
            include:{
                movies:{
                    select:{
                        title: true,
                        posterUrl: true,
                        rated: true,
                        showtimes:{
                            select:{
                                startTime: true
                            }
                        }
                    }
                }
            }
        })
        return movies
    }

    async getAllCinemas(){
        const cinemas = await prisma.cinema.findMany()
        return cinemas
    }

    async getSpecificCinema(id: string){
        const cinema = await prisma.cinema.findUnique({
            where:{
                id: id
            },
            include:{
                movies: {
                    select:{
                        id: true,
                        title: true,
                        posterUrl: true
                    }
                },
                seatType: {
                    select:{
                        id: true,
                        seat_type: true,
                        price: true,
                        cinemaId: true
                    }
                },
                screens: {
                    select:{
                        id: true,
                        name: true,
                        cinemaId: true
                    }
                }
            }
        })
        return cinema
    }

    async insertCinema(data: CinemaTypeProp){
        await prisma.cinema.create({
            data:{
                name: data.name,
                cityId: data.cityId,
                address: data.address,
                hotline: data.hotline,
            },
        })
    }

    async updateCinemaWithMovie(cinemaId: string, movieIdData: string[]){
        await prisma.cinema.update({
            where:{
                id: cinemaId
            },
            data:{
                movies: {
                    connect: movieIdData.map((id: string) => ({id}))
                }
            }
        })
    }

    async deleteMovieInCinema(cinemaId: string, movieId: string){
        await prisma.cinema.update({
            where:{
                id: cinemaId
            },
            data:{
                movies: {
                    disconnect: {
                        id: movieId
                    }
                }
            }
        })
    }

    async updateCinema(id: string, data: CinemaTypeProp){
        await prisma.cinema.update({
            where:{
                id: id
            },
            data:{
                name: data.name,
                cityId: data.cityId,
                address: data.address,
                hotline: data.hotline,
            }
        })
    }

    async deleteCinema(id: string){
        await prisma.cinema.delete({
            where:{
                id: id
            }
        })
    }

    async getCinemaSpecific(id: string, date: Date){
        const endOfDay = new Date(date.setHours(date.getHours()))
        endOfDay.setHours(23, 59, 59, 999);

        const today = new Date()
        today.setHours(0, 0, 0, 0)
        
        if (today.getTime() === date.getTime()){
            date = new Date()
        }
        const response = await prisma.cinema.findUnique({
            where:{
                id: id
            },
            include:{
                movies:{
                    where:{
                        showtimes:{
                            some:{
                                startTime:{
                                    gte: new Date(date),
                                    lte: endOfDay,
                                },
                                isCancelled: false
                            }
                        }
                    },
                    select:{
                        id: true,
                        title:true,
                        rated:true,
                        posterUrl: true,
                        showtimes:{
                            where:{
                                screen:{
                                    cinemaId: id
                                },
                                startTime:{
                                    gte: new Date(date),
                                    lte: endOfDay
                                },
                                isCancelled: false
                            },
                            select:{
                                id: true,
                                startTime: true,
                                screen:{
                                    select:{
                                        name: true
                                    }
                                }
                            },
                            orderBy: {
                                startTime: 'asc'
                            }
                        }
                    }
                },
                seatType:{
                    where:{
                        NOT: {
                            seat_type: "EMPTY"
                        }
                    },
                    select:{
                        id: true,
                        price: true,
                        seat_type: true
                    },
                }
            }
        })

        const filteredMovies = response?.movies.filter((movie) => movie.showtimes.length > 0)
        Object.assign(response!, {movies: filteredMovies})
        return response
    }
}

export const cinemaObj = new Cinema()