import { matchedData } from "express-validator";
import { cinemaObj, type CinemaTypeProp } from "../dao/cinema.dao";
import type { Request, Response, NextFunction } from "express";
export const getMovieByCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cinemaId = req.params.cinema_id as string
        const movies = await cinemaObj.getMovieByCinema(cinemaId)
        return res.status(200).json(movies)
    } catch (error) {
        return next(error)
    }
}

export const getAllCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { city_id, cinemaId, date } = req.query
        if (cinemaId && date && city_id){
            const cinema = await cinemaObj.getCinemaSpecific(cinemaId.toString(), new Date(date as string))
            return res.status(200).json(cinema)
        }
        if (city_id){
            const cinemas = await cinemaObj.getCinemaByCity(Number(city_id))
            return res.status(200).json(cinemas)
        }
        if (cinemaId){
            const cinema = await cinemaObj.getSpecificCinema(cinemaId as string)
            return res.status(200).json(cinema)
        }
        const cinemas = await cinemaObj.getAllCinemas()
        return res.status(200).json(cinemas)
    } catch (error) {
        return next(error)
    }
}

export const insertCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: CinemaTypeProp = matchedData(req)
        const { cityId } = req.body
        Object.assign(data, {cityId})
        await cinemaObj.insertCinema(data)
        return res.status(200).json({
            message: "Add cinema success"
        })
    } catch (error) {
        return next(error)
    }
}

export const updateCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const {cinema_id, movieId} = req.params
        if ( movieId ){
            await cinemaObj.deleteMovieInCinema(String(cinema_id), String(movieId))
            return res.status(200).json({
                message: "Delete movie in cinema successfully"
            })
        }

        const data: CinemaTypeProp = matchedData(req)
        await cinemaObj.updateCinema(String(cinema_id), data)
        return res.status(200).json({
            message: "Update cinema successfully"
        })
    } catch (error) {
        return next(error)
    }
}

export const handleMovieCinema = async (req: Request, res: Response, next: NextFunction) => {
    try{
        const cinema_id = req.params.cinema_id as string
        const { movieIds }  = matchedData(req)
        await cinemaObj.updateCinemaWithMovie(cinema_id, movieIds)
        return res.status(200).json({
            message: "Update movies in cinema successfully"
        })
    } catch (error){
        return next(error)
    }
}

export const deleteCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cinema_id = req.params.cinema_id as string
        await cinemaObj.deleteCinema(cinema_id)
        return res.status(200).json({
            message: "Delete cinema successfully"
        })
    } catch (error) {
        return next(error)
    }
}