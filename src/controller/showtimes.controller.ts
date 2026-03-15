import type { Request, Response, NextFunction } from "express";
import { matchedData } from "express-validator";
import { showtimeObj, type ShowtimeProp } from "../dao/showtimes.dao";

export const createShowtime = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const datas: ShowtimeProp[]= matchedData(req);
        await showtimeObj.createShowtime(datas);
        res.status(201).json({ message: "Showtime created successfully" });
    } catch (error) {
        next(error);
    }
}

export const getShowtime = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { movieId, screenId } = req.query;
        const showtimes = await showtimeObj.getShowtime(movieId as string, screenId as string);
        res.status(200).json(showtimes);
    } catch (error) {
        next(error);
    }   
}

export const updateShowtime = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { movieId, screenId } = req.query;
        const { startTime } = matchedData(req);
        await showtimeObj.updateShowtime(movieId as string, screenId as string, startTime);
        res.status(200).json({ message: "Showtime updated successfully" });
    } catch (error) {
        next(error);
    }
}

export const deleteShowtime = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = req.params.id as string;
        await showtimeObj.deleteShowTime(id);
        res.status(200).json({ message: "Showtime deleted successfully" });
    } catch (error) {
        next(error);
    }
}

