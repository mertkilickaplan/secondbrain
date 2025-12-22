import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";

export const runtime = "nodejs";

// GET /api/tags - Get all unique tags for the current user
export async function GET(_req: Request) {
    // Auth check
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    try {
        // Fetch all notes for this user
        const notes = await prisma.note.findMany({
            where: { userId: auth.user.id },
            select: { tags: true },
        });

        // Extract and deduplicate tags
        const tagSet = new Set<string>();

        for (const note of notes) {
            if (note.tags) {
                try {
                    const parsedTags = JSON.parse(note.tags);
                    if (Array.isArray(parsedTags)) {
                        parsedTags.forEach(tag => {
                            if (typeof tag === 'string' && tag.trim()) {
                                tagSet.add(tag.trim());
                            }
                        });
                    }
                } catch (e) {
                    // Skip invalid JSON
                    console.warn("Invalid tags JSON:", note.tags);
                }
            }
        }

        // Convert to array and sort alphabetically
        const uniqueTags = Array.from(tagSet).sort((a, b) =>
            a.toLowerCase().localeCompare(b.toLowerCase())
        );

        return NextResponse.json({ tags: uniqueTags });
    } catch (error: any) {
        console.error("Error fetching tags:", error);

        return NextResponse.json({
            error: "Failed to fetch tags",
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}
