import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

interface ImportNote {
    id?: string;
    content: string;
    type: "text" | "url";
    url?: string | null;
    title?: string | null;
    summary?: string | null;
    topics?: string[];
    status?: string;
    createdAt?: string;
}

interface ImportEdge {
    sourceId: string;
    targetId: string;
    similarity: number;
    explanation: string;
}

interface ImportData {
    version?: string;
    notes: ImportNote[];
    edges?: ImportEdge[];
}

export async function POST(req: Request) {
    try {
        const data: ImportData = await req.json();

        if (!data.notes || !Array.isArray(data.notes)) {
            return NextResponse.json({ error: "Invalid import format" }, { status: 400 });
        }

        const idMap = new Map<string, string>(); // old ID -> new ID
        let importedNotes = 0;
        let importedEdges = 0;

        // Import notes
        for (const note of data.notes) {
            const oldId = note.id;

            const newNote = await prisma.note.create({
                data: {
                    content: note.content || "",
                    type: note.type || "text",
                    url: note.url || null,
                    title: note.title || "Imported Note",
                    summary: note.summary || null,
                    topics: note.topics ? JSON.stringify(note.topics) : null,
                    status: note.status === "ready" ? "ready" : "processing",
                },
            });

            if (oldId) {
                idMap.set(oldId, newNote.id);
            }
            importedNotes++;
        }

        // Import edges (if provided and notes have matching IDs)
        if (data.edges && Array.isArray(data.edges)) {
            for (const edge of data.edges) {
                const newSourceId = idMap.get(edge.sourceId);
                const newTargetId = idMap.get(edge.targetId);

                if (newSourceId && newTargetId) {
                    const [sourceId, targetId] = [newSourceId, newTargetId].sort();

                    try {
                        await prisma.edge.create({
                            data: {
                                sourceId,
                                targetId,
                                similarity: edge.similarity || 0.8,
                                explanation: edge.explanation || "Imported connection",
                            },
                        });
                        importedEdges++;
                    } catch {
                        // Edge might already exist, skip
                    }
                }
            }
        }

        return NextResponse.json({
            ok: true,
            imported: {
                notes: importedNotes,
                edges: importedEdges,
            },
        });
    } catch (error) {
        console.error("Import error:", error);
        return NextResponse.json({ error: "Import failed" }, { status: 500 });
    }
}
