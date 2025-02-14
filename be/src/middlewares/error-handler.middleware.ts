import { Request, Response, NextFunction } from 'express'
import {ServiceError} from "../types/errors.type";

export const errorHandler = (
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    if (error instanceof ServiceError) {
        res.status(error.statusCode).json({
            success: false,
            error: {
                code: error.code,
                message: error.message,
                details: error.details
            }
        })
    } else {
        res.status(500).json({
            success: false,
            error: {
                code: 'INTERNAL_ERROR',
                message: 'An unexpected error occurred'
            }
        })
    }
    console.log(error)
}