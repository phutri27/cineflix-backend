import type { Request, Response, NextFunction } from "express"
import { Prisma } from "../../generated/prisma/client"
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.error(err)
    let statusCode = err.statusCode || 500
    let message = "Internal server error"

    if (err instanceof Prisma.PrismaClientKnownRequestError){
        switch (err.code) {
            case "P2000":
                statusCode = 416
                message = err.message
                break;
            case "P2002":
                statusCode = 409
                message = err.message
                break;
            case "P2005":
                statusCode = 404
                message = err.message
                break;
            case "P2020":
                statusCode = 416
                message = err.message
                break
        }
    }

    return res.status(statusCode).json({
        status: "error",
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}