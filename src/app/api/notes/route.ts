import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { fetchUrlTitle } from "@/lib/urlMetadata";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { content, type = "text", url } = body as {
            content?: string;
            type?: "text" | "url";
            url?: string;
        };

        if (type === "text" && (!content || !content.trim())) {
            return NextResponse.json({ error: "Content required" }, { status: 400 });
        }

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
                content: type === "url" ? (content ?? "") : content!,   // URL notunda content = user note
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