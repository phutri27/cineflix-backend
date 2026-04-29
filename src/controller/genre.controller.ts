import { matchedData } from "express-validator"
import type { Request, Response, NextFunction } from "express"
import { genreObj } from "../dao/genres.dao.js"
export const getAllGenres = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const genres = await genreObj.getAllGenres()
        return res.status(200).json(genres)
    } catch (err) {
        return next(err)
    }
}

export const insertGenre = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const data = matchedData(req)
        const genre = await genreObj.insert(data.name)
        return res.status(201).json(genre)
    } catch (err) {
        return next(err)
    }
}

export const updateGenre = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const data = matchedData(req)
        const genre = await genreObj.update(data.name, id)
        return res.status(200).json(genre)
    } catch (err) {
        return next(err)
    }
}

export const deleteGenre = async(req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string
        const genre = await genreObj.delete(id)
        return res.status(200).json(genre)
    } catch (err) {
        return next(err)
    }
}
