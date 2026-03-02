import { matchedData } from "express-validator";
import { cinemaObj } from "../dao/cinema.dao";
import type { Request, Response, NextFunction } from "express";

export const getCinemaByCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cityId = Number(req.params.city_id)
        const cinemas = await cinemaObj.getCinemaByCity(cityId)
        return res.status(200).json(cinemas)
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

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

export const insertCinema = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, city_id } = matchedData(req)
        await cinemaObj.insertCinema(name, Number(city_id))
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
        const {name, city_id} = matchedData(req)
        await cinemaObj.updateCinema(cinema_id, name, Number(city_id))
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