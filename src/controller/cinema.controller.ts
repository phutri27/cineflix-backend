import { matchedData } from "express-validator";
import { cinemaObj, type CinemaTypeProp } from "../dao/cinema.dao";
import type { Request, Response, NextFunction } from "express";
export const getMovieByCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cinemaId = req.params.cinema_id as string
        const movies = await cinemaObj.getMovieByCinema(cinemaId)
        return res.status(200).json(movies)
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const getAllCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { city_id } = req.query
        if (city_id){
            const cinemas = await cinemaObj.getCinemaByCity(Number(city_id))
            return res.status(200).json(cinemas)
        }
        const cinemas = await cinemaObj.getAllCinemas()
        return res.status(200).json(cinemas)
    } catch (error) {
        return next(error)
    }
}

export const getSpecificCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cinema_id = req.params.cinema_id as string
        const cinema = await cinemaObj.getSpecificCinema(cinema_id)
        return res.status(200).json(cinema)
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const insertCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const data: CinemaTypeProp = matchedData(req)
        await cinemaObj.insertCinema(data)
        return res.status(200).json({
            message: "Add cinema success"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const updateCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cinema_id = req.params.cinema_id as string
        const data: CinemaTypeProp = matchedData(req)
        await cinemaObj.updateCinema(cinema_id, data)
        return res.status(200).json({
            message: "Update cinema successfully"
        })
    } catch (error) {
        console.error(error)
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
        console.error(error)
        return next(error)
    }
}