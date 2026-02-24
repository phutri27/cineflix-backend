import type { Request, Response, NextFunction } from "express"

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.isAuthenticated()){
        if (req.user.role === "ADMIN"){
            return next()
        }
    }
    return res.status(403).json({
        message: "Only admin can access this resources"
    })
}