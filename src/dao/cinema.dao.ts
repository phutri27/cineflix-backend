import { prisma } from "../lib/prisma";

export interface CinemaTypeProp  {
    name: string
    cityId: number
    address: string
    hotline: string
    seatType: string[]
    movies: string[]
    screens: string[]
}

class Cinema{
    async getCinemaByCity(cityId: number){
        const cinemas = await prisma.cinema.findMany({
            where:{
                cityId: cityId
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
                seatType: {
                    connect: data.seatType.map((id: string) => ({ id }))
                },
                movies: {
                    connect: data.movies.map((id: string) => ({ id }))
                },
                screens: {
                    connect: data.screens.map((id: string) => ({ id }))
                }
            },
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
                seatType: {
                    set: data.seatType.map((id: string) => ({ id }))
                },
                movies: {
                    set: data.movies.map((id: string) => ({ id }))
                },
                screens: {
                    set: data.screens.map((id: string) => ({ id }))
                }
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
}

export const cinemaObj = new Cinema()