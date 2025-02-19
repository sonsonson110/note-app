import express from 'express'
import authController from '../controllers/auth.controller'
import { validationMiddleware } from '../middlewares/validation.middleware'
import { LoginReqDto } from '../dtos/auth/login-req.dto'
import { ChangePasswordReqDto } from '../dtos/auth/change-password-req.dto'
import { authenticateToken } from '../middlewares/auth.middleware'

const router = express.Router()

router.post(
    '/login',
    validationMiddleware(LoginReqDto),
    authController.login.bind(authController)
)
router.post('/refresh', authController.refresh.bind(authController))
router.post('/logout', authController.logout.bind(authController))
router.put(
    '/password',
    [validationMiddleware(ChangePasswordReqDto), authenticateToken],
    authController.changePassword.bind(authController)
)

export default router
