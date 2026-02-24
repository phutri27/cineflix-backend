import type { Request, Response, NextFunction } from "express"

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if(req.isAuthenticated()){
        return next()
    }
    return res.status(403).json({
        message: "Fobidden, you cannot access this route"
    })
}