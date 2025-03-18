import { Request, Response, NextFunction } from 'express'
import { ValidationError } from '../types/errors.type'
import { validate as uuidValidate } from 'uuid'

// Create a middleware factory that takes the parameter name
export const validateUUIDParams = (...paramNames: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        for (const paramName of paramNames) {
            const paramValue = req.params[paramName]

            if (!uuidValidate(paramValue)) {
                const error = new ValidationError(
                    `Invalid UUID format for ${paramName}`
                )
                next(error)
            }
        }

        next()
    }
}
