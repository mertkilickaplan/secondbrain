import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase/auth";
import { getUsageStats } from "@/lib/subscription-helpers";

export const runtime = "nodejs";

// GET /api/subscription/usage - Get usage statistics
export async function GET() {
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    try {
        const stats = await getUsageStats(auth.user.id);
        return NextResponse.json(stats);
    } catch (error: any) {
        console.error("Error fetching usage stats:", error);
        return NextResponse.json({
            error: "Failed to fetch usage statistics",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
