import { prisma } from "../lib/prisma";

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

    async insertCinema(name: string, cityId: number){
        await prisma.cinema.create({
            data:{
                name: name,
                cityId: cityId
            }
        })
    }

    async updateCinema(id: string, name: string, cityId: number){
        await prisma.cinema.update({
            where:{
                id: id
            },
            data:{
                name: name,
                cityId: cityId
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