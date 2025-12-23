import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchUrlTitle } from "@/lib/urlMetadata";
import { noteContentSchema, validateOrError } from "@/lib/validation";
import { checkRateLimit } from "@/lib/rateLimit";
import { requireAuth } from "@/lib/supabase/auth";
import { canCreateNote, incrementNoteCount, canUseAI } from "@/lib/subscription-helpers";
import { logger } from "@/lib/logger";
import { sanitizeInput, sanitizeHtml } from "@/lib/security";

export const runtime = "nodejs";

export async function POST(req: Request) {
    // Rate limit check
    const rateLimitResult = checkRateLimit(req);
    if (!rateLimitResult.allowed) {
        return rateLimitResult.response;
    }

    // Auth check
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    // Subscription check - can user create a note?
    const canCreate = await canCreateNote(auth.user.id);
    if (!canCreate) {
        logger.warn('User hit note limit', { userId: auth.user.id });
        return NextResponse.json({
            error: "Note limit reached",
            message: "You've reached your free tier limit. Upgrade to Premium for unlimited notes!",
            code: "LIMIT_REACHED",
            upgradeUrl: "/app" // Will show upgrade modal in frontend
        }, { status: 402 }); // 402 Payment Required
    }

    try {
        const body = await req.json();
        let { content, type = "text", url } = body as {
            content?: string;
            type?: "text" | "url";
            url?: string;
        };

        // Sanitize inputs
        if (content) {
            content = sanitizeInput(content);
            content = sanitizeHtml(content);
        }
        if (url) {
            url = sanitizeInput(url);
        }

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

        // Check if user has AI access
        const hasAI = await canUseAI(auth.user.id);
        const initialStatus = hasAI ? "processing" : "ready";

        const note = await prisma.note.create({
            data: {
                userId: auth.user.id,
                content: type === "url" ? (content ?? "") : content!,
                type,
                url: type === "url" ? url : null,
                title: title ?? "New Note",
                status: initialStatus,
            },
        });

        // Increment note count after successful creation
        await incrementNoteCount(auth.user.id);
        logger.info('Note created', {
            userId: auth.user.id,
            noteId: note.id,
            status: initialStatus,
            type
        });

        return NextResponse.json(note, { status: 201 });
    } catch (error: any) {
        logger.error('Error creating note', {
            error: error.message,
            stack: error.stack,
            userId: auth.user.id
        });

        // Provide user-friendly error messages
        let userMessage = "Failed to create note";

        if (error.message) {
            const msg = error.message.toLowerCase();

            if (msg.includes("unique") || msg.includes("duplicate")) {
                userMessage = "Note already exists";
            } else if (msg.includes("database") || msg.includes("prisma")) {
                userMessage = "Database error - please try again";
            } else if (msg.includes("network")) {
                userMessage = "Network error - check your connection";
            }
        }

        return NextResponse.json({
            error: userMessage,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined
        }, { status: 500 });
    }
}