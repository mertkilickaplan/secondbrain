import { AuthError } from '@supabase/supabase-js';

/**
 * Provider information for an email address
 */
export interface ProviderInfo {
    exists: boolean;
    providers: string[];
    hint?: string;
}

/**
 * Rate limiter for authentication attempts
 */
export class RateLimiter {
    private attempts: Map<string, number[]> = new Map();
    private readonly maxAttempts: number;
    private readonly windowMs: number;

    constructor(maxAttempts: number = 5, windowMs: number = 60000) {
        this.maxAttempts = maxAttempts;
        this.windowMs = windowMs;
    }

    /**
     * Check if an action is allowed for a given key
     */
    isAllowed(key: string): boolean {
        const now = Date.now();
        const attempts = this.attempts.get(key) || [];

        // Remove old attempts outside the window
        const recentAttempts = attempts.filter(time => now - time < this.windowMs);

        if (recentAttempts.length >= this.maxAttempts) {
            return false;
        }

        // Record this attempt
        recentAttempts.push(now);
        this.attempts.set(key, recentAttempts);

        return true;
    }

    /**
     * Get remaining cooldown time in seconds
     */
    getCooldownSeconds(key: string): number {
        const attempts = this.attempts.get(key) || [];
        if (attempts.length === 0) return 0;

        const oldestAttempt = Math.min(...attempts);
        const cooldownEnd = oldestAttempt + this.windowMs;
        const remaining = Math.max(0, cooldownEnd - Date.now());

        return Math.ceil(remaining / 1000);
    }

    /**
     * Reset attempts for a key
     */
    reset(key: string): void {
        this.attempts.delete(key);
    }
}

/**
 * Parse Supabase auth errors into user-friendly messages
 */
export function parseAuthError(error: AuthError | Error | null): {
    message: string;
    suggestion?: string;
    action?: 'signin' | 'google' | 'reset-password' | 'retry';
} {
    if (!error) {
        return { message: 'An unknown error occurred' };
    }

    const errorMessage = error.message.toLowerCase();

    // Invalid credentials - could be wrong password or OAuth-only account
    if (errorMessage.includes('invalid login credentials') ||
        errorMessage.includes('invalid credentials')) {
        return {
            message: 'Invalid email or password',
            suggestion: 'This email might be registered with Google. Try signing in with Google instead.',
            action: 'google'
        };
    }

    // Email not confirmed
    if (errorMessage.includes('email not confirmed')) {
        return {
            message: 'Please verify your email',
            suggestion: 'Check your inbox for the confirmation link we sent you.',
            action: 'retry'
        };
    }

    // User already registered
    if (errorMessage.includes('user already registered') ||
        errorMessage.includes('already registered')) {
        return {
            message: 'This email is already registered',
            suggestion: 'Try signing in instead, or use "Forgot Password" if you don\'t remember your password.',
            action: 'signin'
        };
    }

    // Password too short
    if (errorMessage.includes('password') && errorMessage.includes('short')) {
        return {
            message: 'Password must be at least 6 characters',
            suggestion: 'Please choose a longer password.',
            action: 'retry'
        };
    }

    // Invalid email format
    if (errorMessage.includes('invalid email')) {
        return {
            message: 'Invalid email format',
            suggestion: 'Please enter a valid email address.',
            action: 'retry'
        };
    }

    // Rate limit exceeded
    if (errorMessage.includes('rate limit') || errorMessage.includes('too many requests')) {
        return {
            message: 'Too many attempts',
            suggestion: 'Please wait a moment before trying again.',
            action: 'retry'
        };
    }

    // Network errors
    if (errorMessage.includes('network') || errorMessage.includes('fetch')) {
        return {
            message: 'Network error',
            suggestion: 'Please check your internet connection and try again.',
            action: 'retry'
        };
    }

    // Default fallback
    return {
        message: error.message,
        suggestion: 'Please try again or contact support if the problem persists.',
        action: 'retry'
    };
}

/**
 * Check if an email exists and which providers it's registered with
 * Note: This uses a privacy-preserving approach that doesn't expose
 * whether an email is registered until after a sign-in attempt
 */
export async function checkEmailProvider(
    email: string,
    supabase: any
): Promise<ProviderInfo> {
    try {
        // We can't directly check if an email exists (security/privacy)
        // Instead, we'll provide hints based on sign-in attempts
        // This is a placeholder - actual detection happens during auth flow

        // For now, return a default response
        // Real detection will happen in the sign-up/sign-in flow
        return {
            exists: false,
            providers: [],
        };
    } catch (error) {
        console.error('Error checking email provider:', error);
        return {
            exists: false,
            providers: [],
        };
    }
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate password strength
 */
export function validatePassword(password: string): {
    valid: boolean;
    errors: string[];
} {
    const errors: string[] = [];

    if (password.length < 6) {
        errors.push('Password must be at least 6 characters');
    }

    if (password.length > 72) {
        errors.push('Password must be less than 72 characters');
    }

    return {
        valid: errors.length === 0,
        errors
    };
}
