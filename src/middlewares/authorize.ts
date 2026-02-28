import type { Request, Response, NextFunction } from "express"

export const authorizeRoles = (allowedRoles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        if (!req.user){
            return res.status(401).json({message: "You must be logged in"})
        }

        if (!allowedRoles.includes(req.user.role)){
            return res.status(401).json({message: "Not authorized to access this route"})
        }

        return next()
    }
}