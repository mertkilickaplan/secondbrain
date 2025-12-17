import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchUrlTitle } from "@/lib/urlMetadata";
import { noteContentSchema, validateOrError, sanitize } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";

export const runtime = "nodejs";

export async function POST(req: Request) {
    // Rate limit check
    const rateLimitResult = checkRateLimit(req);
    if (!rateLimitResult.allowed) {
        return rateLimitResult.response;
    }

    try {
        const body = await req.json();
        const { content, type = "text", url } = body as {
            content?: string;
            type?: "text" | "url";
            url?: string;
        };

        // Validate text content
        if (type === "text") {
            const validation = validateOrError(noteContentSchema, { content });
            if (!validation.success) {
                return NextResponse.json({ error: validation.error }, { status: 400 });
            }
        }

        // Validate URL
        if (type === "url") {
            if (!url) return NextResponse.json({ error: "URL required" }, { status: 400 });
            try { new URL(url); } catch {
                return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
            }
        }

        let title: string | null = null;
        if (type === "url" && url) {
            title = (await fetchUrlTitle(url)) ?? new URL(url).hostname ?? "Untitled Link";
        }

        const note = await prisma.note.create({
            data: {
                content: sanitize(type === "url" ? (content ?? "") : content!),
                type,
                url: type === "url" ? url : null,
                title: title ?? "New Note",
                status: "processing",
            },
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error) {
        console.error("Error creating note:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}