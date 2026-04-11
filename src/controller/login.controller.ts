import passport from "passport";
import type { Request, Response, NextFunction } from "express";
import "dotenv/config"
export const loginPost = (req: Request, res: Response, next: NextFunction) => {
    passport.authenticate('local', (err: any, user: any, info: any) => {
        if (err){
            return next(err)
        }
        if (!user){
            return res.status(401).json({
                message: "Invalid email or password"
            })
        }

        req.login(user, (err) => {
            if (err){
                return next(err)
            }

            req.session.save((saveErr) => {
                if (saveErr) {
                    return next(saveErr);
                }
                
                return res.status(200).json({
                    message: "Login successfully",
                    user: user
                });
            });
        })
    })(req, res, next)
}

export const googleRedirectToAppilcation = (req: Request, res: Response, next: NextFunction) => {
    return res.redirect(`${process.env.FRONTEND_ORIGIN}`)
}

export const getUserInfoGoogle = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user
    if (!user) {
        return res.end()
    }

    res.status(200).json({user})
}