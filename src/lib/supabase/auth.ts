import { createClient } from "./server";
import { User } from "@supabase/supabase-js";

/**
 * Require authentication for API routes
 * Returns the user if authenticated, or throws an unauthorized response
 */
export async function requireAuth(): Promise<{
    user: User;
    response?: never;
} | {
    user?: never;
    response: Response;
}> {
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
}

/**
 * Get current user (optional auth - returns null if not authenticated)
 */
export async function getOptionalUser(): Promise<User | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
}
