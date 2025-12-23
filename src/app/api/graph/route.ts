import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

export async function GET() {
  // Auth check
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  try {
    const userId = auth.user.id;

    // Get only this user's notes
    const nodes = await prisma.note.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        summary: true,
        type: true,
        url: true,
        content: true,
        status: true,
        tags: true,
      },
    });

    // Get edges only between this user's notes
    const nodeIds = nodes.map((n) => n.id);
    const edges = await prisma.edge.findMany({
      where: {
        sourceId: { in: nodeIds },
        targetId: { in: nodeIds },
      },
      select: {
        id: true,
        sourceId: true,
        targetId: true,
        similarity: true,
        explanation: true,
      },
    });

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
  } catch (error: any) {
    logger.error("Error fetching graph data", {
      error: error.message,
      stack: error.stack,
      userId: auth.user.id,
    });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
