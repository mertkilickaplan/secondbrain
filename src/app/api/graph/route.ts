import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
    try {
        const [nodes, edges] = await Promise.all([
            prisma.note.findMany({
                select: {
                    id: true,
                    title: true,
                    summary: true,
                    type: true,
                    url: true,
                    content: true, // MVP için OK, ama büyüyünce kaldırıp note-detail endpoint'e taşı
                    status: true,
                },
            }),
            prisma.edge.findMany({
                select: {
                    id: true,
                    sourceId: true,
                    targetId: true,
                    similarity: true,
                    explanation: true,
                },
            }),
        ]);

        // degree hesapla
        const degree = new Map<string, number>();
        for (const e of edges) {
            degree.set(e.sourceId, (degree.get(e.sourceId) ?? 0) + 1);
            degree.set(e.targetId, (degree.get(e.targetId) ?? 0) + 1);
        }

        return NextResponse.json({
            nodes: nodes.map((n) => ({
                ...n,
                val: Math.max(1, degree.get(n.id) ?? 1),
            })),
            links: edges.map((e) => ({
                id: e.id,
                source: e.sourceId,
                target: e.targetId,
                similarity: e.similarity,
                explanation: e.explanation,
            })),
        });
    } catch (error) {
        console.error("Error fetching graph data:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}