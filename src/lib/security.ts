/**
 * Security Utilities
 * 
 * Provides security helpers for:
 * - Input sanitization
 * - XSS prevention
 * - CSRF token generation/validation
 */

import crypto from 'crypto';

/**
 * Sanitize HTML to prevent XSS attacks
 * Removes potentially dangerous HTML tags and attributes
 */
export function sanitizeHtml(input: string): string {
    if (!input) return '';

    // Remove script tags and their content
    let sanitized = input.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

    // Remove event handlers (onclick, onerror, etc.)
    sanitized = sanitized.replace(/on\w+\s*=\s*["'][^"']*["']/gi, '');
    sanitized = sanitized.replace(/on\w+\s*=\s*[^\s>]*/gi, '');

    // Remove javascript: protocol
    sanitized = sanitized.replace(/javascript:/gi, '');

    // Remove data: protocol (can be used for XSS)
    sanitized = sanitized.replace(/data:text\/html/gi, '');

    return sanitized;
}

/**
 * Sanitize user input for database queries
 * Note: Prisma already prevents SQL injection, but this adds an extra layer
 */
export function sanitizeInput(input: string): string {
    if (!input) return '';

    // Trim whitespace
    let sanitized = input.trim();

    // Remove null bytes
    sanitized = sanitized.replace(/\0/g, '');

    // Limit length to prevent DoS
    const MAX_LENGTH = 10000;
    if (sanitized.length > MAX_LENGTH) {
        sanitized = sanitized.substring(0, MAX_LENGTH);
    }

    return sanitized;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate URL format
 */
export function isValidUrl(url: string): boolean {
    try {
        const parsed = new URL(url);
        return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
        return false;
    }
}

/**
 * Generate CSRF token
 */
export function generateCsrfToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

/**
 * Validate CSRF token
 */
export function validateCsrfToken(token: string, expectedToken: string): boolean {
    if (!token || !expectedToken) return false;

    // Constant-time comparison to prevent timing attacks
    return crypto.timingSafeEqual(
        Buffer.from(token),
        Buffer.from(expectedToken)
    );
}

/**
 * Generate secure random string
 */
export function generateSecureRandom(length: number = 32): string {
    return crypto.randomBytes(length).toString('base64url');
}

/**
 * Hash sensitive data (for comparison, not for passwords)
 */
export function hashData(data: string): string {
    return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Rate limit key generator
 */
export function getRateLimitKey(identifier: string, endpoint: string): string {
    return `ratelimit:${endpoint}:${hashData(identifier)}`;
}

/**
 * Validate content length
 */
export function validateContentLength(content: string, maxLength: number = 10000): boolean {
    return content.length <= maxLength;
}

/**
 * Escape special characters for regex
 */
export function escapeRegex(str: string): string {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Check if string contains only safe characters
 */
export function isSafeString(str: string): boolean {
    // Allow alphanumeric, spaces, and common punctuation
    const safePattern = /^[a-zA-Z0-9\s.,!?'"()\-_@#$%&*+=:;/<>[\]{}|\\~`]+$/;
    return safePattern.test(str);
}

/**
 * Remove potentially dangerous file extensions
 */
export function sanitizeFilename(filename: string): string {
    // Remove path traversal attempts
    let sanitized = filename.replace(/\.\./g, '');

    // Remove dangerous extensions
    const dangerousExtensions = ['.exe', '.bat', '.cmd', '.sh', '.php', '.asp', '.jsp'];
    dangerousExtensions.forEach(ext => {
        sanitized = sanitized.replace(new RegExp(ext + '$', 'i'), '.txt');
    });

    return sanitized;
}
