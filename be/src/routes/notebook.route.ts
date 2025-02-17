import express, {NextFunction, Request, Response} from "express";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = express.Router()

router.get('/', authenticateToken, (req: Request, resp: Response, next: NextFunction) => {
    resp.status(200).json()
})

export default router