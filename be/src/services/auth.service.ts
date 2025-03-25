import {BaseService} from "./abstractions/base.service";
import {LoginReqDto} from "../dtos/auth/login-req.dto";
import {UnauthorizedError, ValidationError} from "../types/errors.type";
import passwordHashHelper, {PasswordHashHelper} from "../utils/password-hash-helper.util";
import jwtHelper, {AccessJwtPayload, JwtHelper, RefreshJwtPayload} from "../utils/jwt-helper.util";
import jwt from "jsonwebtoken";
import {ChangePasswordReqDto} from "../dtos/auth/change-password-req.dto";

export class AuthService extends BaseService {
    private passwordHashHelper: PasswordHashHelper
    private jwtHelper: JwtHelper

    constructor() {
        super();
        this.passwordHashHelper = passwordHashHelper
        this.jwtHelper = jwtHelper
    }

    async login(dto: LoginReqDto) {
        // Check for login credential
        const user = await this.prisma.user.findFirst({
            where: {username: {equals: dto.username}},
        })
        if (user === null) {
            throw new ValidationError("Username is not found")
        }
        const isPasswordMatch = await this.passwordHashHelper.verify(dto.password, user.passwordHash)
        if (!isPasswordMatch) {
            throw new ValidationError("Username or password is incorrect")
        }
        const accessToken = this.jwtHelper.generateAccessToken({
            id: user.id,
            username: user.username,
            email: user.email,
            version: user.version
        })
        const refreshToken = this.jwtHelper.generateRefreshToken(user.id)
        // Store user's refresh token
        await this.prisma.refreshToken.create({
            data: {
                token: refreshToken,
                userId: user.id,
                expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
            }
        });
        return {
            accessToken: accessToken,
            refreshToken: refreshToken
        }
    }

    async refresh(refreshToken: string) {
        // Verify the refresh token
        let payload: RefreshJwtPayload
        try {
            payload = this.jwtHelper.verifyRefreshToken(refreshToken);
        } catch (err) {
            if (err instanceof jwt.TokenExpiredError) {
                throw new UnauthorizedError('Session expired')
            }
            if (err instanceof jwt.JsonWebTokenError) {
                throw new UnauthorizedError('Invalid session')
            }
        }
        // Check if token exists and is not revoked
        const storedToken = await this.prisma.refreshToken.findUnique({
            where: {
                userId: payload!.sub,
                token: refreshToken,
                isRevoked: false,
                expiresAt: {gt: new Date()}
            },
            include: {user: true}
        });

        if (!storedToken || !storedToken.user) {
            throw new UnauthorizedError('Invalid refresh token');
        }

        // Generate new access token
        const accessToken = this.jwtHelper.generateAccessToken(storedToken.user);
        return {accessToken}
    }

    async logout(refreshToken?: string | null) {
        if (!refreshToken) return

        await this.prisma.refreshToken.update({
            where: {token: refreshToken},
            data: {isRevoked: true}
        })
    }

    async changePassword(dto: ChangePasswordReqDto, userObj: AccessJwtPayload, refreshToken: string) {
        // Both password must not identical
        if (dto.newPassword === dto.oldPassword) {
            throw new ValidationError('New password must not be the same with old one')
        }

        // Get user with both password and current sessions
        const user = await this.prisma.user.findUnique({
            where: {id: userObj.sub},
            select: {passwordHash: true}
        });
        if (!user) throw new ValidationError('Account does not exist')
        // Verify old password
        const isOldPasswordMatch = await this.passwordHashHelper.verify(dto.oldPassword, user.passwordHash)
        if (!isOldPasswordMatch) throw new ValidationError("Old password is incorrect")
        // Generate new password hash
        const newPasswordHash = await this.passwordHashHelper.generate(dto.newPassword)

        await this.prisma.$transaction([
            // Update user new password hash
            this.prisma.user.update({
                where: {id: userObj.sub},
                data: {passwordHash: newPasswordHash, version: { increment: 1 }}
            }),
            // Keep current session refresh token, revoke others
            this.prisma.refreshToken.updateMany({
                where: {
                    userId: userObj.sub,
                    isRevoked: false,
                    expiresAt: {gte: new Date()},
                    token: {not: refreshToken}
                },
                data: {isRevoked: true}
            }),
        ])
    }
}

export default new AuthService()