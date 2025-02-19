import authService, {AuthService} from "../services/auth.service";
import {NextFunction, Request, Response} from "express";
import {LoginReqDto} from "../dtos/auth/login-req.dto";
import {UnauthorizedError} from "../types/errors.type";
import {ChangePasswordReqDto} from "../dtos/auth/change-password-req.dto";

export class AuthController {
    constructor(private authService: AuthService) {
    }

    async login(req: Request, resp: Response, next: NextFunction) {
        const dto: LoginReqDto = req.body
        try {
            const result = await this.authService.login(dto)
            resp.cookie('refreshToken', result.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 4 * 24 * 60 * 60 * 1000 // 4 days
            })
            resp.status(200).json({accessToken: result.accessToken})
        } catch (error) {
            next(error)
        }
    }

    async refresh(req: Request, resp: Response, next: NextFunction) {
        // Extract refresh token from cookies
        const refreshToken = req.cookies.refreshToken
        if (!refreshToken) {
            next(new UnauthorizedError('Refresh token required'))
        }
        try {
            const result = await this.authService.refresh(refreshToken)
            resp.status(200).json(result)
        } catch (error) {
            next(error)
        }
    }

    async logout(req: Request, resp: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken
            await this.authService.logout(refreshToken)
            resp.clearCookie('refreshToken')
            resp.status(200).json({message: 'Logout successfully'})
        } catch (error) {
            next(error)
        }
    }

    async changePassword(req: Request, resp: Response, next: NextFunction) {
        try {
            const refreshToken = req.cookies.refreshToken
            const dto: ChangePasswordReqDto = req.body
            await this.authService.changePassword(dto, req.user!, refreshToken)
            resp.status(200).json()
        } catch (error) {
            next(error)
        }
    }
}

export default new AuthController(authService)