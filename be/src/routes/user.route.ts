import express from "express";
import userController from "../controllers/user.controller";
import {validationMiddleware} from "../middlewares/validation.middleware";
import {RegisterReqDto} from "../dtos/auth/register-req.dto";
import {authenticateToken} from "../middlewares/auth.middleware";

const router = express.Router()

router.get('/me', authenticateToken,userController.getInfo.bind(userController))
router.post('/', validationMiddleware(RegisterReqDto), userController.register.bind(userController))

export default router