import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";
import { canUseAI } from "@/lib/subscription-helpers";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";

// Delay between processing notes to avoid rate limits
const PROCESS_DELAY_MS = 2000;

async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * POST /api/notes/process-pending
 * Processes all unprocessed notes sequentially with consistent error handling.
 * If any note fails due to quota, ALL remaining notes are marked with same error.
 */
export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const hasAI = await canUseAI(auth.user.id);
  if (!hasAI) {
    return NextResponse.json({ error: "AI features not available" }, { status: 403 });
  }

  try {
    // Find notes that need AI processing
    const unprocessedNotes = await prisma.note.findMany({
      where: {
        userId: auth.user.id,
        OR: [
          { summary: null, status: { in: ["ready", "processing"] } },
          { status: "error" }, // Include errors for retry
        ],
      },
      select: { id: true },
      orderBy: { createdAt: "asc" }, // Process oldest first
    });

    if (unprocessedNotes.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No notes to process",
        processed: 0,
        failed: 0,
      });
    }

    const noteIds = unprocessedNotes.map((n) => n.id);

    // First, mark all as processing for consistent state
    await prisma.note.updateMany({
      where: { id: { in: noteIds } },
      data: { status: "processing" },
    });

    logger.info("Starting sequential note processing", {
      userId: auth.user.id,
      count: noteIds.length,
    });

    let processed = 0;
    let failed = 0;
    let lastError: string | null = null;

    // Process notes sequentially
    for (const noteId of noteIds) {
      try {
        // Call the process endpoint for this note
        const baseUrl = request.headers.get("origin") || "http://localhost:3000";
        const processResponse = await fetch(`${baseUrl}/api/notes/${noteId}/process`, {
          method: "POST",
          headers: {
            cookie: request.headers.get("cookie") || "",
          },
        });

        if (processResponse.ok) {
          processed++;
          logger.info("Note processed successfully", { noteId });
        } else {
          const errorData = await processResponse.json().catch(() => ({}));
          lastError = errorData.error || "Processing failed";

          // If quota error, the process endpoint already marked all notes as error
          if (errorData.category === "quota") {
            logger.warn("Quota limit hit, stopping batch processing", {
              noteId,
              processed,
              remaining: noteIds.length - processed - 1,
            });
            failed = noteIds.length - processed;
            break; // Stop processing, all remaining are already marked as error
          }

          failed++;
        }
      } catch (error: any) {
        logger.error("Error processing note", { noteId, error: error.message });
        lastError = error.message;
        failed++;

        // On network/fetch error, mark remaining as error and stop
        const remainingIds = noteIds.slice(noteIds.indexOf(noteId));
        await prisma.note.updateMany({
          where: { id: { in: remainingIds } },
          data: { status: "error", summary: "Processing interrupted" },
        });
        break;
      }

      // Delay between notes to avoid rate limits
      if (noteIds.indexOf(noteId) < noteIds.length - 1) {
        await delay(PROCESS_DELAY_MS);
      }
    }

    logger.info("Sequential processing completed", {
      userId: auth.user.id,
      processed,
      failed,
    });

    return NextResponse.json({
      success: failed === 0,
      message:
        failed === 0
          ? `Successfully processed ${processed} notes`
          : `Processed ${processed} notes, ${failed} failed`,
      processed,
      failed,
      lastError,
    });
  } catch (error: any) {
    logger.error("Error in batch processing", {
      error: error.message,
      userId: auth.user.id,
    });

    // Mark all processing notes as error for consistency
    await prisma.note.updateMany({
      where: { userId: auth.user.id, status: "processing" },
      data: { status: "error", summary: "Processing failed" },
    });

    return NextResponse.json(
      { error: "Failed to process notes", details: error.message },
      { status: 500 }
    );
  }
}
