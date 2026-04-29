import { userObj } from "../dao/user.dao.js";
import type { Request, Response, NextFunction } from "express";

export const getAllUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await userObj.findAllUserAdmin()
        return res.status(200).json(users)
    } catch (error) {
        return next(error)
    }
}

export const verifyUserId = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.query
        const result = await userObj.findUserById(userId as string)
        if (result) {
            return res.status(200).json({ isLogin: true})
        }
        return res.status(200).json({ isLogin: false })
    } catch (error) {
        next(error)
    }
} 