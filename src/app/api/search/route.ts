import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
    // Auth check
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("q")?.trim().toLowerCase();

        if (!query || query.length < 2) {
            return NextResponse.json({ results: [] });
        }

        // Search in title, content, summary, and topics
        const notes = await prisma.note.findMany({
            where: {
                OR: [
                    { title: { contains: query } },
                    { content: { contains: query } },
                    { summary: { contains: query } },
                    { topics: { contains: query } },
                    { tags: { contains: query } },
                ],
            },
            select: {
                id: true,
                title: true,
                summary: true,
                status: true,
            },
            take: 10, // Limit results
        });

        return NextResponse.json({ results: notes });
    } catch (error) {
        console.error("Error searching notes:", error);
        return NextResponse.json({ error: "Search failed" }, { status: 500 });
    }
}
