import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function cleanupExpiredTokens() {
    await prisma.refreshToken.deleteMany({
        where: {
            OR: [
                { expiresAt: { lt: new Date() } },
                { isRevoked: true }
            ]
        }
    });
}

// Run cleanup daily
setInterval(cleanupExpiredTokens, 24 * 60 * 60 * 1000);
