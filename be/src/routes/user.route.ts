import express from "express";
import userController from "../controllers/user.controller";
import {validationMiddleware} from "../middlewares/validation.middleware";
import {RegisterReqDto} from "../dtos/auth/register-req.dto";

const router = express.Router()

router.post('/', validationMiddleware(RegisterReqDto), userController.register.bind(userController))

export default router