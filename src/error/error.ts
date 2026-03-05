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

    if (err.http_code || err.message.include("Resource")){
        statusCode = 502
        message = "There was an issue communicating with the cloud image server."
    }

    if (err.message && err.message.includes('Redis')) {
        statusCode = 503;
        message = "The caching service is currently down.";
    }

    return res.status(statusCode).json({
        status: "error",
        message: message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}