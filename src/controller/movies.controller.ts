import { moviesObj } from "../dao/movies.dao";
import type { NextFunction, Request, Response } from "express";
import { matchedData, validationResult, Result } from "express-validator";
import { validateMovie } from "../validate/movies.validate";
import { uploadFile } from "../utils/fileupload";

export const getAllComingMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movies = await moviesObj.getAllComingMovies()
        return res.status(200).json(movies)
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const getAllShowingMovies = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const movies = await moviesObj.getAllShowingMovies()
        return res.status(200).json(movies)
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const getMoviesByGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genre = req.params.genre_name as string
        const movies = await moviesObj.getMoviesByGenre(genre)
        return res.status(200).json(movies)
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

export const getMoviesByTitle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const title = req.params.title_name as string
        const movies = await moviesObj.getMoviesByTitle(title)
        return res.status(200).json(movies)
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

export const insertMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const filePath = req.file?.path as string
        const { title, plot, duration, genre_option, actors, directors, premiere_date, rated } = matchedData(req)
        const imageUrl: any = await uploadFile(filePath)
        const movie = await moviesObj.insert(title, plot, imageUrl.public_id, duration, premiere_date, rated,
            genre_option, actors, directors
        )
        return res.status(200).json(movie)
    } catch (error) {
        console.error(error)
        return next(error)
    }
}

export const updateMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const filePath = req.file?.path as string
        const { title, plot, duration, genre_option, actors, directors, premiere_date, rated } = matchedData(req)
        const imageUrl: any = await uploadFile(filePath)
        const movie = await moviesObj.update(id, title, plot, imageUrl.public_id, duration, premiere_date, rated,
            genre_option, actors, directors
        )
    } catch (error) {
        
    }
}

export const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const movie = await moviesObj.delete(id)
        return res.status(200).json({
            message: "Delete movie succesfully"
        })
    } catch (error) {
        console.error(error)
        return next(error)
    }
}
