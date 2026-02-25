import { validationResult, Result} from 'express-validator'
import type { NextFunction, Request, Response } from "express";

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const result: Result<string> = errors.formatWith(error => error.msg as string);
        return res.status(400).json({ errors: result.array() });
    }
    next(); 
};