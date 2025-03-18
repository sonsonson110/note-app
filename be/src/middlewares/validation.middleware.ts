import {Request, Response, NextFunction} from "express";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {ValidationError} from "../types/errors.type";

export function validationMiddleware(type: any) {
    return async (req: Request, res: Response, next: NextFunction) => {
        const dtoInstance = plainToInstance(type, req.body);
        const errors = await validate(dtoInstance, {validationError: {target: false}});

        if (errors.length > 0) {
            const errorResponse: ValidationError = new ValidationError(
                "Validation failed. Please re-check your input",
                errors
            )
            next(errorResponse)
        }
        next()
    };
}
