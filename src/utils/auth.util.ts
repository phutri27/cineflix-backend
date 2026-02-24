import type { Request, Response, NextFunction } from "express"

export const isAuth = (req: Request, res: Response, next: NextFunction) => {
    if(req.isAuthenticated()){
        return next()
    }
    return res.redirect("/")
}

export const isAdmin = (req: Request, res: Response, next: NextFunction) => {
    if (req.isAuthenticated() && req.user.role){
        return next()
    }
    return res.status(403).json({
        message: "Only admin can access this resources"
    })
}