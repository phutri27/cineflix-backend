import { moviesObj } from "../dao/movies.dao";
import type { NextFunction, Request, Response } from "express";
import { matchedData } from "express-validator";
import { uploadFile } from "../utils/fileupload";
import { deleteFile } from "../utils/fileupload";
import type { movie } from "../dao/movies.dao";
export const getAllComingMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movies = await moviesObj.getAllComingMovies()
        return res.status(200).json(movies)
    } catch (error) {
        return next(error)
    }
}

export const getAllShowingMovies = async (req: Request, res: Response, next: NextFunction) =>{
    try {
        const movies = await moviesObj.getAllShowingMovies()
        return res.status(200).json(movies)
    } catch (error) {
        return next(error)
    }
}

export const getMoviesByGenre = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const genre = req.params.genre_name as string
        const movies = await moviesObj.getMoviesByGenre(genre)
        return res.status(200).json(movies)
    } catch (error) {
        return next(error)
    }
}

export const getMoviesByTitle = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const title = req.params.title_name as string
        const movies = await moviesObj.getMoviesByTitle(title)
        return res.status(200).json(movies)
    } catch (error) {
        return next(error)
    }
}

export const getSpecificMovie = async (req: Request, res: Response, next:NextFunction) => {
    try {
        const id = req.params.id as string
        const movie = await moviesObj.getSpecificMovie(id)
        return res.status(200).json(movie)
    } catch (error) {
        return next(error)
    }
}

export const getAllMovies = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const movies = await moviesObj.getAllMovies()
        return res.status(200).json(movies) 
    } catch (error) {
        return next(error)
    }
}

export const insertMovies = async (req: Request, res: Response, next: NextFunction) => {
    const filePath = req.file?.path as string
    const data = matchedData(req)
    const imageUrl: any = await uploadFile(filePath, "movie_poster")
    Object.assign(data, {posterUrl: imageUrl.secure_url, posterPublicId: imageUrl.public_id})
    try {
        const movie = await moviesObj.insert(data as movie)
        return res.status(200).json(movie)
    } catch (error) {
        await deleteFile(imageUrl.public_id)
        return next(error)
    }
}

export const updateMovies = async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id as string
    const data = matchedData(req)
    const filePath = req.file?.path as string 
    const oldMovie = await moviesObj.getSpecificMovie(id)
    let imageUrl:any
    if (filePath){
        imageUrl = await uploadFile(filePath, "movie_poster")
        Object.assign(data, {posterUrl: imageUrl.secure_url, posterPublicId: imageUrl.public_id})
    } else{
        Object.assign(data, {posterUrl: oldMovie?.posterUrl, posterPublicId: oldMovie?.posterPublicId})
    }
    try {
        const movie = await moviesObj.update(id, data as movie)
        await deleteFile(oldMovie?.posterPublicId as string)
        return res.status(200).json(movie)
    } catch (error) {
        await deleteFile(imageUrl.public_id)
        return next(error)
    }
}

export const deleteMovie = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const movie = await moviesObj.delete(id)
        await deleteFile(movie.posterPublicId)
        return res.status(200).json({
            message: "Delete movie succesfully"
        })
    } catch (error) {
        return next(error)
    }
}
