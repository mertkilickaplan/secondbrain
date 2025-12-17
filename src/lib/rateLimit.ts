// Simple in-memory rate limiter (IP-based)
// For production, use Redis or a proper rate limiter

interface RateLimitEntry {
    count: number;
    resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of store.entries()) {
        if (entry.resetTime < now) {
            store.delete(key);
        }
    }
}, 5 * 60 * 1000);

export interface RateLimitConfig {
    limit: number;       // Max requests
    windowMs: number;    // Time window in ms
}

const defaultConfig: RateLimitConfig = {
    limit: 100,          // 100 requests
    windowMs: 60 * 1000, // per minute
};

export function rateLimit(
    identifier: string,
    config: RateLimitConfig = defaultConfig
): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const entry = store.get(identifier);

    if (!entry || entry.resetTime < now) {
        // New window
        store.set(identifier, {
            count: 1,
            resetTime: now + config.windowMs,
        });
        return {
            allowed: true,
            remaining: config.limit - 1,
            resetIn: config.windowMs,
        };
    }

    if (entry.count >= config.limit) {
        // Rate limited
        return {
            allowed: false,
            remaining: 0,
            resetIn: entry.resetTime - now,
        };
    }

    // Increment count
    entry.count++;
    return {
        allowed: true,
        remaining: config.limit - entry.count,
        resetIn: entry.resetTime - now,
    };
}

// Get IP from request (works with Next.js)
export function getClientIP(request: Request): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        return forwarded.split(",")[0].trim();
    }
    return "unknown";
}

// Middleware helper for API routes
export function checkRateLimit(
    request: Request,
    config?: RateLimitConfig
): { allowed: boolean; response?: Response } {
    const ip = getClientIP(request);
    const result = rateLimit(ip, config);

    if (!result.allowed) {
        return {
            allowed: false,
            response: new Response(
                JSON.stringify({
                    error: "Too Many Requests",
                    retryAfter: Math.ceil(result.resetIn / 1000),
                }),
                {
                    status: 429,
                    headers: {
                        "Content-Type": "application/json",
                        "Retry-After": String(Math.ceil(result.resetIn / 1000)),
                        "X-RateLimit-Remaining": "0",
                    },
                }
            ),
        };
    }

    return { allowed: true };
}
