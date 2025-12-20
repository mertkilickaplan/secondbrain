import { createClient } from "./server";
import { User } from "@supabase/supabase-js";

/**
 * Require authentication for API routes
 * TEMPORARILY BYPASSED FOR TESTING
 */
export async function requireAuth(): Promise<{
    user: User;
    response?: never;
} | {
    user?: never;
    response: Response;
}> {
    // TODO: Remove this bypass before production
    const mockUser: any = {
        id: "test-user-123",
        email: "test@dev.local",
        aud: "authenticated",
        role: "authenticated",
    };
    return { user: mockUser };

    /* Original code - uncomment for production:
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
        return {
            response: new Response(
                JSON.stringify({ error: "Unauthorized" }),
                {
                    status: 401,
                    headers: { "Content-Type": "application/json" },
                }
            ),
        };
    }

    return { user };
    */
}

/**
 * Get current user (optional auth - returns null if not authenticated)
 */
export async function getOptionalUser(): Promise<User | null> {
    // Temporarily return mock user
    const mockUser: any = {
        id: "test-user-123",
        email: "test@dev.local",
    };
    return mockUser;
}
