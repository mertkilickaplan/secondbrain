import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";

export const runtime = "nodejs";

export async function GET() {
    // Auth check
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    try {
        // Fetch all notes with their edges
        const notes = await prisma.note.findMany({
            include: {
                outgoingEdges: true,
                incomingEdges: true,
            },
            orderBy: { createdAt: "asc" },
        });

        const edges = await prisma.edge.findMany();

        const exportData = {
            version: "1.0",
            exportedAt: new Date().toISOString(),
            notes: notes.map((note) => ({
                id: note.id,
                content: note.content,
                type: note.type,
                url: note.url,
                title: note.title,
                summary: note.summary,
                topics: note.topics ? JSON.parse(note.topics) : [],
                status: note.status,
                createdAt: note.createdAt.toISOString(),
            })),
            edges: edges.map((edge) => ({
                id: edge.id,
                sourceId: edge.sourceId,
                targetId: edge.targetId,
                similarity: edge.similarity,
                explanation: edge.explanation,
            })),
        };

        return new NextResponse(JSON.stringify(exportData, null, 2), {
            status: 200,
            headers: {
                "Content-Type": "application/json",
                "Content-Disposition": `attachment; filename="secondbrain-export-${new Date().toISOString().split("T")[0]}.json"`,
            },
        });
    } catch (error) {
        console.error("Export error:", error);
        return NextResponse.json({ error: "Export failed" }, { status: 500 });
    }
}
