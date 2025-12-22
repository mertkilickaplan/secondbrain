import { NextResponse } from 'next/server';

export type ErrorCategory = 'auth' | 'validation' | 'database' | 'network' | 'ai' | 'unknown';

export interface ApiErrorOptions {
    category?: ErrorCategory;
    retryable?: boolean;
    statusCode?: number;
    details?: string;
}

/**
 * Standardized API Error class for consistent error handling
 */
export class ApiError extends Error {
    category: ErrorCategory;
    retryable: boolean;
    statusCode: number;
    details?: string;

    constructor(message: string, options: ApiErrorOptions = {}) {
        super(message);
        this.name = 'ApiError';
        this.category = options.category || 'unknown';
        this.retryable = options.retryable ?? false;
        this.statusCode = options.statusCode || 500;
        this.details = options.details;
    }

    /**
     * Convert error to Next.js Response
     */
    toResponse(): NextResponse {
        return NextResponse.json(
            {
                error: this.message,
                category: this.category,
                retryable: this.retryable,
                details: process.env.NODE_ENV === 'development' ? this.details : undefined,
            },
            { status: this.statusCode }
        );
    }
}

/**
 * Create authentication error (401)
 */
export function createAuthError(message: string = 'Unauthorized'): ApiError {
    return new ApiError(message, {
        category: 'auth',
        statusCode: 401,
        retryable: false,
    });
}

/**
 * Create validation error (400)
 */
export function createValidationError(message: string, details?: string): ApiError {
    return new ApiError(message, {
        category: 'validation',
        statusCode: 400,
        retryable: false,
        details,
    });
}

/**
 * Create database error (500, retryable)
 */
export function createDatabaseError(message: string, details?: string): ApiError {
    return new ApiError(message, {
        category: 'database',
        statusCode: 500,
        retryable: true,
        details,
    });
}

/**
 * Create network error (503, retryable)
 */
export function createNetworkError(message: string = 'Network error'): ApiError {
    return new ApiError(message, {
        category: 'network',
        statusCode: 503,
        retryable: true,
    });
}

/**
 * Create AI service error (500)
 */
export function createAiError(message: string, retryable: boolean = true, details?: string): ApiError {
    return new ApiError(message, {
        category: 'ai',
        statusCode: 500,
        retryable,
        details,
    });
}

/**
 * Handle unknown errors and convert to ApiError
 */
export function handleUnknownError(error: unknown): ApiError {
    if (error instanceof ApiError) {
        return error;
    }

    if (error instanceof Error) {
        return new ApiError('An unexpected error occurred', {
            category: 'unknown',
            statusCode: 500,
            retryable: false,
            details: error.message,
        });
    }

    return new ApiError('An unexpected error occurred', {
        category: 'unknown',
        statusCode: 500,
        retryable: false,
        details: String(error),
    });
}

/**
 * Categorize Prisma errors
 */
export function categorizePrismaError(error: Error): ApiError {
    const message = error.message.toLowerCase();

    if (message.includes('unique constraint')) {
        return createValidationError('Duplicate entry', error.message);
    }

    if (message.includes('foreign key constraint')) {
        return createValidationError('Invalid reference', error.message);
    }

    if (message.includes('connection')) {
        return createDatabaseError('Database connection failed', error.message);
    }

    return createDatabaseError('Database operation failed', error.message);
}
