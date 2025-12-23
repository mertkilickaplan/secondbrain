import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase/auth";
import { upgradeToPremium, downgradeToFree, getUserSubscription } from "@/lib/subscription-helpers";

export const runtime = "nodejs";

// Simple admin key check
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || "change-this-in-production";

function isAdmin(request: Request): boolean {
    const authHeader = request.headers.get("authorization");
    return authHeader === `Bearer ${ADMIN_KEY}`;
}

// POST /api/admin/subscription - Upgrade user to premium
export async function POST(req: Request) {
    // Check admin authorization
    if (!isAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { userId, action } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: "userId required" }, { status: 400 });
        }

        if (action === "upgrade") {
            const subscription = await upgradeToPremium(userId);
            console.log(`[ADMIN] Upgraded user ${userId} to premium`);
            return NextResponse.json({
                success: true,
                message: `User ${userId} upgraded to premium`,
                subscription
            });
        } else if (action === "downgrade") {
            const subscription = await downgradeToFree(userId);
            console.log(`[ADMIN] Downgraded user ${userId} to free`);
            return NextResponse.json({
                success: true,
                message: `User ${userId} downgraded to free`,
                subscription
            });
        } else {
            return NextResponse.json({ error: "Invalid action. Use 'upgrade' or 'downgrade'" }, { status: 400 });
        }
    } catch (error: any) {
        console.error("Admin subscription error:", error);
        return NextResponse.json({
            error: "Failed to update subscription",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// GET /api/admin/subscription?userId=xxx - Get user subscription
export async function GET(req: Request) {
    // Check admin authorization
    if (!isAdmin(req)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ error: "userId required" }, { status: 400 });
        }

        const subscription = await getUserSubscription(userId);
        return NextResponse.json(subscription);
    } catch (error: any) {
        console.error("Admin get subscription error:", error);
        return NextResponse.json({
            error: "Failed to get subscription",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
