import express from "express";
import userController from "../controllers/user.controller";
import {validationMiddleware} from "../middlewares/validation.middleware";
import {SignupReqDto} from "../dtos/auth/signup-req.dto";

const router = express.Router()

router.post('/', validationMiddleware(SignupReqDto), userController.signup.bind(userController))

export default router