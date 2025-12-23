import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/supabase/auth";
import { getUserSubscription, upgradeToPremium, downgradeToFree } from "@/lib/subscription-helpers";

export const runtime = "nodejs";

// GET /api/subscription - Get current subscription
export async function GET() {
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    try {
        const subscription = await getUserSubscription(auth.user.id);
        return NextResponse.json(subscription);
    } catch (error: any) {
        console.error("Error fetching subscription:", error);
        return NextResponse.json({
            error: "Failed to fetch subscription",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// POST /api/subscription - Upgrade to premium
// Note: This is a placeholder for payment integration
// In production, this would integrate with Stripe/PayPal
export async function POST() {
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    try {
        // TODO: Add payment processing here
        // For now, this is a manual upgrade endpoint
        const subscription = await upgradeToPremium(auth.user.id);

        console.log(`[SUBSCRIPTION] User ${auth.user.id} upgraded to premium`);
        return NextResponse.json({
            subscription,
            message: "Successfully upgraded to Premium!"
        });
    } catch (error: any) {
        console.error("Error upgrading subscription:", error);
        return NextResponse.json({
            error: "Failed to upgrade subscription",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}

// DELETE /api/subscription - Downgrade to free
export async function DELETE() {
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    try {
        const subscription = await downgradeToFree(auth.user.id);

        console.log(`[SUBSCRIPTION] User ${auth.user.id} downgraded to free`);
        return NextResponse.json({
            subscription,
            message: "Downgraded to Free tier"
        });
    } catch (error: any) {
        console.error("Error downgrading subscription:", error);
        return NextResponse.json({
            error: "Failed to downgrade subscription",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
