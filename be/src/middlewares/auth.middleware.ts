import {NextFunction, Request, Response} from 'express';
import jwtHelperUtil, {AccessJwtPayload} from "../utils/jwt-helper.util";
import jwt from "jsonwebtoken";
import {PrismaClient} from '@prisma/client';
import {UnauthorizedError,} from "../types/errors.type";

const prisma = new PrismaClient()

declare global {
    namespace Express {
        interface Request {
            user?: AccessJwtPayload;
        }
    }
}

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        const error = new UnauthorizedError('No token provided')
        next(error)
    }

    try {
        const decoded = jwtHelperUtil.verifyAccessToken(token!);
        // Check if password has been changed since token was issued (might hit database pretty hard)
        const user = await prisma.user.findFirst({
            where: { id: decoded.sub },
            select: { version: true }
        });
        if (!user || user.version !== decoded.version) {
            const error = new UnauthorizedError('Token invalid due to password change')
            next(error)
        }

        req.user = decoded
        next();
    } catch (err) {
        let definedError: Error
        if (err instanceof jwt.TokenExpiredError) {
            definedError = new UnauthorizedError('Token expired')
        } else if (err instanceof jwt.JsonWebTokenError) {
            definedError = new UnauthorizedError('Invalid session')
        } else {
            console.log(err)
            definedError = new Error()
        }
        next(definedError)
    }
};