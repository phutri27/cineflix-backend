import { moviesObj } from "../dao/movies.dao";
import type { NextFunction, Request, Response } from "express";
import { matchedData, validationResult, Result } from "express-validator";

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
        const genre = req.params.genre as string
        const movies = await moviesObj.getMoviesByGenre(genre)
        return res.status(200).json(movies)
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

export const getMoviesByTitle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const title = req.params.title as string
        const movies = await moviesObj.getMoviesByTitle(title)
        return res.status(200).json(movies)
    } catch (error) {
        console.log(error)
        return next(error)
    }
}

export const insertAndUpdateMovies = async (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()){
        const result: Result<string> = errors.formatWith(error => error.msg as string)
        return res.status(400).json({errors: result.array()})
    }
    
    
    const { title, plot, duration, premiere_date, rated } = matchedData(req)
    try {
        
    } catch (error) {
        
    }
}

