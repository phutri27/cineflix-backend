import type {Request, Response, NextFunction} from 'express'
import "dotenv/config"
export const logoutPost = async (req: Request, res: Response, next: NextFunction) => {
    req.logout((err) => {
        if (err)
            next(err)
        req.session.destroy((error) => {
            if (error)
                next(error)
            res.clearCookie('connect.sid', { path: "/" }) 
            res.status(200).json({ logout: true })
        })
    })
}