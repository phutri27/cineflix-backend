import { userObj } from "../dao/user.dao";
import type { Request, Response, NextFunction } from "express";

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userObj.findAllUserAdmin()
        return res.status(200).json(users)
    } catch (error) {
        return next(error)
    }
}