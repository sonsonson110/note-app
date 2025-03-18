export class ServiceError extends Error {
    constructor(
        message: string,
        public code: string,
        public statusCode: number,
        public details?: any
    ) {
        super(message)
    }
}

export class ValidationError extends ServiceError {
    constructor(message: string, details?: any) {
        super(message, 'VALIDATION_ERROR', 400, details)
    }
}

export class UnauthorizedError extends ServiceError {
    constructor(message: string, details?: any) {
        super(message, 'UNAUTHORIZED_ERROR', 401, details);
    }
}

export class NotFoundError extends ServiceError {
    constructor(message: string, details?: any) {
        super(message, 'NOT_FOUND', 404, details)
    }
}