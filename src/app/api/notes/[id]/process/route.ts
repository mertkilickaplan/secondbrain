import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeNote, generateEmbedding, explainConnection } from "@/lib/ai";
import { cosineSimilarity } from "@/lib/utils";
import { requireAuth } from "@/lib/supabase/auth";

export const runtime = "nodejs";

type Params = { id: string };

function parseEmbedding(emb: string | null): number[] | null {
    if (!emb) return null;
    try {
        const v = JSON.parse(emb);
        return Array.isArray(v) ? v : null;
    } catch {
        return null;
    }
}

function parseTopics(topics: string | null): string[] {
    if (!topics) return [];
    try {
        const v = JSON.parse(topics);
        return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
    } catch {
        return [];
    }
}

function clamp01(x: number) {
    if (Number.isNaN(x)) return 0;
    return Math.max(-1, Math.min(1, x));
}

export async function POST(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    // Auth check
    const auth = await requireAuth();
    if (auth.response) return auth.response;

    const { id } = await params;

    try {
        const note = await prisma.note.findUnique({ where: { id } });
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }
        if (note.userId !== auth.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Idempotency / concurrency guard:
        // - If already processing -> return 202
        // - If already ready -> return 200 (do nothing)
        // - If error -> allow retry
        if (note.status === "processing") {
            return NextResponse.json(
                { ok: true, status: "processing", message: "Already processing" },
                { status: 202 }
            );
        }

        if (note.status === "ready") {
            // Optional: you could still recompute edges if you want, but MVP = idempotent no-op
            return NextResponse.json({ ok: true, status: "ready", message: "Already processed" });
        }

        // Set processing early (so UI can reflect it + prevents double-processing)
        await prisma.note.update({
            where: { id },
            data: { status: "processing" },
        });

        // Build analysis input robustly for URL notes
        const baseText =
            note.type === "url"
                ? `URL Note\nTitle: ${note.title ?? ""}\nURL: ${note.url ?? ""}\nUserText: ${note.content ?? ""}`
                : note.content ?? "";

        if (!baseText || baseText.trim().length < 3) {
            // Not enough content to analyze; mark error (or keep processing -> error)
            await prisma.note.update({ where: { id }, data: { status: "error" } });
            return NextResponse.json(
                { error: "Not enough content to process" },
                { status: 400 }
            );
        }

        // 1) Analyze + Embedding
        const analysis = await analyzeNote(baseText);

        // Keep embedding input short & stable
        const embedInput = `Title: ${analysis.title}\nSummary: ${analysis.summary}\nTopics: ${(analysis.topics ?? []).join(", ")}`;
        const embedding = await generateEmbedding(embedInput);

        // 2) Update note fields (but don't overwrite good URL title)
        const shouldOverwriteTitle =
            note.type !== "url" || !note.title || note.title.trim().length < 3;

        const noteAfterAI = await prisma.note.update({
            where: { id },
            data: {
                title: shouldOverwriteTitle ? analysis.title : note.title,
                summary: analysis.summary,
                topics: JSON.stringify(analysis.topics ?? []),
                embedding: JSON.stringify(embedding),
                // status NOT set to ready yet
            },
        });

        // 3) Similarity against existing notes that have embeddings
        const allOtherNotes = await prisma.note.findMany({
            where: {
                id: { not: id },
                embedding: { not: null },
                status: "ready",
            },
            select: {
                id: true,
                title: true,
                summary: true,
                topics: true,
                embedding: true,
            },
        });

        const candidates: Array<{ other: (typeof allOtherNotes)[number]; sim: number }> = [];

        for (const other of allOtherNotes) {
            const otherEmb = parseEmbedding(other.embedding);
            if (!otherEmb) continue;

            const sim = clamp01(cosineSimilarity(embedding, otherEmb));
            if (sim > 0.75) {
                candidates.push({ other, sim });
            }
        }

        candidates.sort((a, b) => b.sim - a.sim);
        const topK = 5;
        const top = candidates.slice(0, topK);

        // Prepare compact texts for explanation (use title+summary+topics only)
        const srcTopics = parseTopics(noteAfterAI.topics).join(", ");
        const sourceText = `Title: ${noteAfterAI.title ?? ""}\nSummary: ${noteAfterAI.summary ?? ""}\nTopics: ${srcTopics}`;

        const edges = [];

        for (const { other, sim } of top) {
            const [sourceId, targetId] = [noteAfterAI.id, other.id].sort();

            const tgtTopics = parseTopics(other.topics).join(", ");
            const targetText = `Title: ${other.title ?? ""}\nSummary: ${other.summary ?? ""}\nTopics: ${tgtTopics}`;

            // If explanation fails for one edge, don't fail the whole job
            let explanation = "";
            try {
                explanation = await explainConnection(sourceText, targetText);
            } catch (e) {
                console.warn("explainConnection failed:", e);
                explanation = "Semantically related.";
            }

            const edge = await prisma.edge.upsert({
                where: { sourceId_targetId: { sourceId, targetId } },
                update: {
                    similarity: sim,
                    explanation,
                },
                create: {
                    sourceId,
                    targetId,
                    similarity: sim,
                    explanation,
                },
            });

            edges.push(edge);
        }

        // 4) Mark as ready LAST
        const finalNote = await prisma.note.update({
            where: { id },
            data: { status: "ready" },
        });

        return NextResponse.json({ ok: true, note: finalNote, edges });
    } catch (error) {
        console.error("Error processing note:", error);

        // Best-effort status update (avoid throwing if note deleted)
        try {
            await prisma.note.update({ where: { id }, data: { status: "error" } });
        } catch { }

        return NextResponse.json({ error: "Processing Failed" }, { status: 500 });
    }
}