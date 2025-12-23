import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { analyzeNote, generateEmbedding, explainConnection } from "@/lib/ai";
import { cosineSimilarity } from "@/lib/utils";
import { requireAuth } from "@/lib/supabase/auth";
import { canUseAI } from "@/lib/subscription-helpers";

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

    // Check if user has AI access
    const hasAI = await canUseAI(auth.user.id);
    if (!hasAI) {
        console.log(`[SUBSCRIPTION] User ${auth.user.id} attempted AI processing without access`);
        return NextResponse.json({
            error: "AI features not available",
            message: "AI-powered analysis is a Premium feature. Upgrade to unlock smart connections and summaries!",
            code: "AI_NOT_AVAILABLE"
        }, { status: 403 });
    }

    try {
        const note = await prisma.note.findUnique({ where: { id } });
        if (!note) {
            return NextResponse.json({ error: "Note not found" }, { status: 404 });
        }
        if (note.userId !== auth.user.id) {
            return NextResponse.json({ error: "Forbidden" }, { status: 403 });
        }

        // Idempotency / concurrency guard:
        // - If already ready -> return 200 (do nothing)
        // - If processing AND already has analysis data -> skip (genuinely in progress)
        // - If processing but NO analysis -> proceed (initial call after note creation)
        // - If error -> allow retry
        if (note.status === "ready") {
            return NextResponse.json({ ok: true, status: "ready", message: "Already processed" });
        }

        // Check if genuinely processing (has topics/summary already being set)
        const hasExistingAnalysis = note.topics && note.summary;
        if (note.status === "processing" && hasExistingAnalysis) {
            return NextResponse.json(
                { ok: true, status: "processing", message: "Already processing" },
                { status: 202 }
            );
        }

        console.log("[PROCESS] Starting processing for note:", id, "status:", note.status);

        // Keep status as processing (it's already set on creation)
        if (note.status !== "processing") {
            await prisma.note.update({
                where: { id },
                data: { status: "processing" },
            });
        }

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
        console.log("[PROCESS] Starting AI analysis for note:", id);
        const analysis = await analyzeNote(baseText);
        console.log("[PROCESS] AI analysis complete:", analysis);

        // Keep embedding input short & stable
        const embedInput = `Title: ${analysis.title}\nSummary: ${analysis.summary}\nTopics: ${(analysis.topics ?? []).join(", ")}`;
        console.log("[PROCESS] Generating embedding...");
        const embedding = await generateEmbedding(embedInput);
        console.log("[PROCESS] Embedding generated, length:", embedding.length);

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

        // Calculate topic similarity as fallback
        const srcTopicsArray = parseTopics(noteAfterAI.topics);

        for (const other of allOtherNotes) {
            let sim = 0;

            // Try embedding similarity first
            const otherEmb = parseEmbedding(other.embedding);
            if (embedding.length > 0 && otherEmb && otherEmb.length > 0) {
                sim = clamp01(cosineSimilarity(embedding, otherEmb));
            } else {
                // Fallback to topic similarity with word-level matching
                const otherTopicsArray = parseTopics(other.topics);
                if (srcTopicsArray.length > 0 && otherTopicsArray.length > 0) {
                    // Extract all words from topics for fuzzy matching
                    const srcWords = new Set(
                        srcTopicsArray.flatMap(t => t.toLowerCase().split(/\s+/))
                    );
                    const otherWords = new Set(
                        otherTopicsArray.flatMap(t => t.toLowerCase().split(/\s+/))
                    );

                    // Count word intersections
                    const intersection = [...srcWords].filter(w => otherWords.has(w)).length;
                    const union = new Set([...srcWords, ...otherWords]).size;
                    sim = union > 0 ? intersection / union : 0;

                    // Boost if there's direct topic containment
                    for (const src of srcTopicsArray) {
                        for (const other of otherTopicsArray) {
                            if (src.toLowerCase().includes(other.toLowerCase()) ||
                                other.toLowerCase().includes(src.toLowerCase())) {
                                sim = Math.max(sim, 0.5); // Strong match
                            }
                        }
                    }
                }
            }

            if (sim > 0.3) { // Lower threshold for topic similarity
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
    } catch (error: any) {
        console.error("Error processing note:", error);

        // Categorize error types for better user feedback
        let userMessage = "Processing failed";
        let errorCategory = "unknown";

        if (error.message) {
            const msg = error.message.toLowerCase();

            if (msg.includes("api key") || msg.includes("authentication")) {
                userMessage = "AI service configuration error";
                errorCategory = "auth";
            } else if (msg.includes("timeout") || msg.includes("timed out")) {
                userMessage = "AI service timeout - please retry";
                errorCategory = "timeout";
            } else if (msg.includes("quota") || msg.includes("rate limit")) {
                userMessage = "AI service quota exceeded - try again later";
                errorCategory = "quota";
            } else if (msg.includes("network") || msg.includes("fetch")) {
                userMessage = "Network error - check your connection";
                errorCategory = "network";
            } else if (msg.includes("not found") || msg.includes("404")) {
                userMessage = "AI model not available";
                errorCategory = "model";
            } else {
                userMessage = "AI processing failed - please retry";
                errorCategory = "processing";
            }
        }

        // Update note status with user-friendly error message
        try {
            await prisma.note.update({
                where: { id },
                data: {
                    status: "error",
                    summary: userMessage
                }
            });
        } catch (dbError) {
            console.error("Failed to update note status:", dbError);
        }

        // Return detailed error in development, generic in production
        return NextResponse.json({
            error: userMessage,
            category: errorCategory,
            details: process.env.NODE_ENV === 'development' ? error.message : undefined,
            retryable: ["timeout", "network", "quota"].includes(errorCategory)
        }, { status: 500 });
    }
}