import { createClient } from "./server";
import { User } from "@supabase/supabase-js";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";

/**
 * Require authentication for API routes
 * Uses mock user in development, real Supabase auth in production
 */
export async function requireAuth(): Promise<
  | {
      user: User;
      response?: never;
    }
  | {
      user?: never;
      response: Response;
    }
> {
  // Development bypass - remove for stricter dev testing
  if (IS_DEVELOPMENT && process.env.USE_MOCK_AUTH === "true") {
    const mockUser: User = {
      id: "test-user-123",
      email: "test@dev.local",
      aud: "authenticated",
      role: "authenticated",
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
    };
    return { user: mockUser };
  }

  // Production: Real Supabase authentication
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return {
      response: new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }),
    };
  }

  return { user };
}

/**
 * Get current user (optional auth - returns null if not authenticated)
 */
export async function getOptionalUser(): Promise<User | null> {
  // Development bypass
  if (IS_DEVELOPMENT && process.env.USE_MOCK_AUTH === "true") {
    return {
      id: "test-user-123",
      email: "test@dev.local",
      aud: "authenticated",
      role: "authenticated",
      app_metadata: {},
      user_metadata: {},
      created_at: new Date().toISOString(),
    } as User;
  }

  // Production: Real Supabase authentication
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}
