import jwt from 'jsonwebtoken';

export interface AccessJwtPayload {
    // Registered claims (standard)
    iss?: string;        // Issuer
    sub: string;         // Subject (usually user ID)
    aud?: string;        // Audience
    exp?: number;        // Expiration time
    nbf?: number;        // Not before
    iat?: number;        // Issued at
    jti?: string;        // JWT ID

    // Custom claims
    username: string;
    email: string | null;
    version: number
}

export interface RefreshJwtPayload {
    sub: string;
    iat?: number;
    exp?: number;
}

export class JwtHelper {
    private readonly accessTokenSecret: string
    private readonly refreshTokenSecret: string
    private readonly issuer: string

    constructor() {
        if (!process.env.ACCESS_TOKEN_SECRET) {
            throw new Error('ACCESS_TOKEN_SECRET environment variable is required but not set');
        }
        if (!process.env.REFRESH_TOKEN_SECRET) {
            throw new Error('REFRESH_TOKEN_SECRET environment variable is required but not set');
        }
        this.accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
        this.refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET
        this.issuer = process.env.JWT_ISSUER || "note-app";
    }

    generateAccessToken(user: { id: string; username: string; email: string | null; version: number}) {
        const payload: AccessJwtPayload = {
            iss: this.issuer,
            sub: user.id,
            iat: Math.floor(Date.now() / 1000),

            // Custom claims
            ...user
        }
        return jwt.sign(payload, this.accessTokenSecret, {
            expiresIn: 60 * 15, // 15 minutes
            algorithm: 'HS256'
        })
    }

    verifyAccessToken(token: string): AccessJwtPayload {
        return jwt.verify(token, this.accessTokenSecret) as AccessJwtPayload
    }

    generateRefreshToken(userId: string) {
        const payload: RefreshJwtPayload = {
            sub: userId,
            iat: Math.floor(Date.now() / 1000)
        }
        return jwt.sign(
            payload,
            this.refreshTokenSecret,
            { expiresIn: '4d' }
        );
    }

    verifyRefreshToken(token: string) {
        return jwt.verify(token, this.refreshTokenSecret) as RefreshJwtPayload;
    }
}

export default new JwtHelper()