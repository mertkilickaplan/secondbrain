/**
 * Graph API Tests
 * Tests for /api/graph endpoint
 */

import { GET } from "../route";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";
import { NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/lib/db");
jest.mock("@/lib/supabase/auth");

describe("/api/graph GET", () => {
  const mockUserId = "test-user-123";

  beforeEach(() => {
    jest.clearAllMocks();

    (requireAuth as jest.Mock).mockResolvedValue({
      user: { id: mockUserId },
      response: null,
    });
  });

  it("should fetch graph data successfully", async () => {
    const mockNotes = [
      {
        id: "note-1",
        title: "Note 1",
        summary: "Summary 1",
        type: "text",
        url: null,
        content: "Content 1",
        status: "ready",
        tags: null,
      },
      {
        id: "note-2",
        title: "Note 2",
        summary: "Summary 2",
        type: "text",
        url: null,
        content: "Content 2",
        status: "ready",
        tags: null,
      },
    ];

    const mockEdges = [
      {
        id: "edge-1",
        sourceId: "note-1",
        targetId: "note-2",
        similarity: 0.8,
        explanation: "Related topics",
      },
    ];

    (prisma.note.findMany as jest.Mock).mockResolvedValue(mockNotes);
    (prisma.edge.findMany as jest.Mock).mockResolvedValue(mockEdges);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.nodes).toHaveLength(2);
    expect(data.links).toHaveLength(1);
    expect(data.nodes[0]).toHaveProperty("val");
    expect(data.links[0]).toMatchObject({
      source: "note-1",
      target: "note-2",
      similarity: 0.8,
    });
  });

  it("should filter notes by user ID", async () => {
    (prisma.note.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.edge.findMany as jest.Mock).mockResolvedValue([]);

    await GET();

    expect(prisma.note.findMany).toHaveBeenCalledWith({
      where: { userId: mockUserId },
      select: expect.any(Object),
    });
  });

  it("should calculate node degrees correctly", async () => {
    const mockNotes = [
      {
        id: "note-1",
        title: "N1",
        summary: "",
        type: "text",
        url: null,
        content: "",
        status: "ready",
        tags: null,
      },
      {
        id: "note-2",
        title: "N2",
        summary: "",
        type: "text",
        url: null,
        content: "",
        status: "ready",
        tags: null,
      },
      {
        id: "note-3",
        title: "N3",
        summary: "",
        type: "text",
        url: null,
        content: "",
        status: "ready",
        tags: null,
      },
    ];

    const mockEdges = [
      { id: "e1", sourceId: "note-1", targetId: "note-2", similarity: 0.8, explanation: "" },
      { id: "e2", sourceId: "note-1", targetId: "note-3", similarity: 0.7, explanation: "" },
    ];

    (prisma.note.findMany as jest.Mock).mockResolvedValue(mockNotes);
    (prisma.edge.findMany as jest.Mock).mockResolvedValue(mockEdges);

    const response = await GET();
    const data = await response.json();

    // note-1 has degree 2, note-2 and note-3 have degree 1
    const note1 = data.nodes.find((n: any) => n.id === "note-1");
    expect(note1.val).toBe(2);
  });

  it("should require authentication", async () => {
    (requireAuth as jest.Mock).mockResolvedValue({
      user: null,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    });

    const response = await GET();

    expect(response.status).toBe(401);
  });

  it("should handle database errors", async () => {
    (prisma.note.findMany as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Internal Server Error");
  });

  it("should return empty graph for new users", async () => {
    (prisma.note.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.edge.findMany as jest.Mock).mockResolvedValue([]);

    const response = await GET();
    const data = await response.json();

    expect(data.nodes).toEqual([]);
    expect(data.links).toEqual([]);
  });
});
