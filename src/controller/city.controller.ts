import type {Request, Response, NextFunction} from 'express';
import { cityObj } from '../dao/city.dao.js';

export const getAllCities = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cities = await cityObj.findAll();
        res.status(200).json(cities);
    } catch (error) {
        next(error);
    }
}

export const createCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name } = req.body;
        const city = await cityObj.create(name);
        res.status(201).json(city);
    } catch (error) {
        next(error)
    }
}

export const updateCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const city = await cityObj.update(Number(id), name);
        res.status(200).json(city);
    } catch (error) {
        next(error)
    }
}

export const deleteCity = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        await cityObj.delete(Number(id));
        res.status(204).send();
    } catch (error) {
        next(error)
    }
}   