import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";
import { decrementNoteCount } from "@/lib/subscription-helpers";
import { logger } from "@/lib/logger";
import { sanitizeInput, sanitizeHtml } from "@/lib/security";

export const runtime = "nodejs";

// DELETE /api/notes/[id] - Delete a note
export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Auth check
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const { id } = await params;

  try {
    // Check if note exists and belongs to user
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    if (note.userId !== auth.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Delete note (edges will cascade delete due to schema)
    await prisma.note.delete({ where: { id } });

    // Decrement note count after successful deletion
    await decrementNoteCount(auth.user.id);
    logger.info("Note deleted", { userId: auth.user.id, noteId: id });

    return NextResponse.json({ ok: true, message: "Note deleted" });
  } catch (error: any) {
    logger.error("Error deleting note", {
      error: error.message,
      stack: error.stack,
      userId: auth.user.id,
      noteId: id,
    });

    let userMessage = "Failed to delete note";

    if (error.message) {
      const msg = error.message.toLowerCase();

      if (msg.includes("not found")) {
        userMessage = "Note not found";
      } else if (msg.includes("database") || msg.includes("prisma")) {
        userMessage = "Database error - please try again";
      } else if (msg.includes("foreign key") || msg.includes("constraint")) {
        userMessage = "Cannot delete - note has dependencies";
      }
    }

    return NextResponse.json(
      {
        error: userMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}

// PATCH /api/notes/[id] - Update a note
export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  // Auth check
  const auth = await requireAuth();
  if (auth.response) return auth.response;

  const { id } = await params;

  try {
    const body = await req.json();
    let { content, title, tags, reprocess } = body as {
      content?: string;
      title?: string;
      tags?: string[];
      reprocess?: boolean;
    };

    // Sanitize inputs
    if (content) {
      content = sanitizeInput(content);
      content = sanitizeHtml(content);
    }
    if (title) {
      title = sanitizeInput(title);
    }

    // Check if note exists and belongs to user
    const note = await prisma.note.findUnique({ where: { id } });
    if (!note) {
      return NextResponse.json({ error: "Note not found" }, { status: 404 });
    }
    if (note.userId !== auth.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Build update data
    const updateData: { content?: string; title?: string; tags?: string; status?: string } = {};

    if (content !== undefined) updateData.content = content;
    if (title !== undefined) updateData.title = title;
    if (tags !== undefined) updateData.tags = JSON.stringify(tags);

    // If reprocess requested, set status to processing
    if (reprocess) {
      updateData.status = "processing";
    }

    const updatedNote = await prisma.note.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(updatedNote);
  } catch (error: any) {
    logger.error("Error updating note", {
      error: error.message,
      stack: error.stack,
      userId: auth.user.id,
      noteId: id,
    });

    let userMessage = "Failed to update note";

    if (error.message) {
      const msg = error.message.toLowerCase();

      if (msg.includes("not found")) {
        userMessage = "Note not found";
      } else if (msg.includes("database") || msg.includes("prisma")) {
        userMessage = "Database error - please try again";
      } else if (msg.includes("validation")) {
        userMessage = "Invalid data provided";
      }
    }

    return NextResponse.json(
      {
        error: userMessage,
        details: process.env.NODE_ENV === "development" ? error.message : undefined,
      },
      { status: 500 }
    );
  }
}
