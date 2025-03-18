import { Prisma } from '@prisma/client'
import { v4 as uuidv4 } from 'uuid'
import { SignupReqDto } from '../dtos/auth/signup-req.dto'
import { ServiceError, ValidationError } from '../types/errors.type'
import { PasswordHashHelper } from '../utils/password-hash-helper.util'
import { BaseService } from './abstractions/base.service'

export class UserService extends BaseService {
    private passwordHashHelper: PasswordHashHelper

    constructor() {
        super()
        this.passwordHashHelper = new PasswordHashHelper()
    }

    async signup(dto: SignupReqDto) {
        // Check for duplicate email or username
        const conditions: Prisma.UserWhereInput[] = []
        conditions.push({
            username: { equals: dto.username, mode: 'insensitive' },
        })
        if (dto.email) {
            conditions.push({
                username: { equals: dto.email, mode: 'insensitive' },
            })
        }
        const whereSameUsernameOrEmail: Prisma.UserWhereInput = {
            OR: conditions,
        }
        const usernameOrEmailPassed = await this.prisma.user.count({
            where: whereSameUsernameOrEmail,
        })
        if (usernameOrEmailPassed != 0) {
            throw new ValidationError('Username or email has been taken')
        }
        // Persist
        const passwordHash = await this.passwordHashHelper.generate(
            dto.password
        )
        try {
            await this.prisma.user.create({
                data: {
                    id: uuidv4(),
                    username: dto.username,
                    passwordHash: passwordHash,
                    email: dto.email,
                },
            })
        } catch (err) {
            throw new ServiceError('Failed to create user', 'DB_ERROR', 500)
        }
    }
}

export default new UserService()
