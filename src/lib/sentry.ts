/**
 * Sentry Error Tracking Configuration
 * 
 * Optional error tracking with Sentry.
 * Only enabled if NEXT_PUBLIC_SENTRY_DSN is set.
 */

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;
const IS_PRODUCTION = process.env.NODE_ENV === 'production';

// Check if Sentry is enabled
export const isSentryEnabled = Boolean(SENTRY_DSN);

/**
 * Initialize Sentry (placeholder)
 * 
 * To enable Sentry:
 * 1. Install: npm install @sentry/nextjs
 * 2. Run: npx @sentry/wizard@latest -i nextjs
 * 3. Set NEXT_PUBLIC_SENTRY_DSN in environment variables
 */
export function initSentry() {
    if (!isSentryEnabled) {
        console.log('ℹ️ Sentry is not configured. Error tracking disabled.');
        return;
    }

    // Sentry initialization would go here
    // This is a placeholder for when you install @sentry/nextjs
    console.log('✅ Sentry initialized');
}

/**
 * Capture exception
 * Falls back to console.error if Sentry not configured
 */
export function captureException(error: Error | unknown, context?: Record<string, any>) {
    if (isSentryEnabled) {
        // Sentry.captureException(error, { extra: context });
        console.error('Sentry would capture:', error, context);
    } else {
        console.error('Error:', error, context);
    }
}

/**
 * Capture message
 * Falls back to console.log if Sentry not configured
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) {
    if (isSentryEnabled) {
        // Sentry.captureMessage(message, { level, extra: context });
        console.log(`Sentry would capture message (${level}):`, message, context);
    } else {
        console.log(`[${level}]`, message, context);
    }
}

/**
 * Set user context
 */
export function setUser(user: { id: string; email?: string; username?: string } | null) {
    if (isSentryEnabled) {
        // Sentry.setUser(user);
        console.log('Sentry would set user:', user);
    }
}

/**
 * Add breadcrumb
 */
export function addBreadcrumb(message: string, category?: string, data?: Record<string, any>) {
    if (isSentryEnabled) {
        // Sentry.addBreadcrumb({ message, category, data });
        console.log('Sentry breadcrumb:', { message, category, data });
    }
}

/**
 * Performance monitoring
 */
export function startTransaction(name: string, op: string) {
    if (isSentryEnabled) {
        // return Sentry.startTransaction({ name, op });
        console.log('Sentry transaction start:', { name, op });
        return {
            finish: () => console.log('Sentry transaction finish:', name),
        };
    }
    return {
        finish: () => { },
    };
}

// Export placeholder for when Sentry is installed
export const Sentry = {
    captureException,
    captureMessage,
    setUser,
    addBreadcrumb,
    startTransaction,
};
