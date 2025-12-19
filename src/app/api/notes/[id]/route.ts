import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";

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

        return NextResponse.json({ ok: true, message: "Note deleted" });
    } catch (error) {
        console.error("Error deleting note:", error);
        return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
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
        const { content, title, tags, reprocess } = body as {
            content?: string;
            title?: string;
            tags?: string[];
            reprocess?: boolean;
        };

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
    } catch (error) {
        console.error("Error updating note:", error);
        return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
    }
}
