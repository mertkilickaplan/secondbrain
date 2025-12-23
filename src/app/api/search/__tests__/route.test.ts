/**
 * Search API Tests
 * Tests for /api/search endpoint
 */

import { GET } from "../route";
import { prisma } from "@/lib/db";
import { requireAuth } from "@/lib/supabase/auth";
import { NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/lib/db");
jest.mock("@/lib/supabase/auth");

describe("/api/search GET", () => {
  const mockUserId = "test-user-123";

  const createRequest = (query: string, params?: Record<string, string>) => {
    const url = new URL("http://localhost:3000/api/search");
    url.searchParams.set("q", query);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.set(key, value);
      });
    }
    return { url: url.toString() } as Request;
  };

  beforeEach(() => {
    jest.clearAllMocks();

    (requireAuth as jest.Mock).mockResolvedValue({
      user: { id: mockUserId },
      response: null,
    });
  });

  it("should return empty results for queries less than 2 characters", async () => {
    const req = createRequest("a");

    const response = await GET(req);
    const data = await response.json();

    expect(data.results).toEqual([]);
    expect(data.count).toBe(0);
  });

  it("should perform contains search for 2+ characters", async () => {
    const mockResults = [
      {
        id: "note-1",
        title: "Test Note",
        content: "Test content",
        summary: "Summary",
        status: "ready",
        type: "text",
        rank: 1.0,
      },
    ];

    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue(mockResults);

    const req = createRequest("test");

    const response = await GET(req);
    const data = await response.json();

    expect(data.results).toHaveLength(1);
    expect(data.count).toBe(1);
    expect(prisma.$queryRawUnsafe).toHaveBeenCalled();
  });

  it("should handle tag search (queries starting with #)", async () => {
    const mockResults = [
      {
        id: "note-1",
        title: "Tagged Note",
        tags: '["important"]',
        rank: 1.0,
      },
    ];

    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue(mockResults);

    const req = createRequest("#important");

    const response = await GET(req);
    const data = await response.json();

    expect(data.isTagSearch).toBe(true);
    expect(data.results).toHaveLength(1);
  });

  it("should filter by status", async () => {
    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue([]);

    const req = createRequest("test", { status: "ready" });

    await GET(req);

    // Check that the query includes status filter
    const query = (prisma.$queryRawUnsafe as jest.Mock).mock.calls[0][0];
    expect(query).toContain("status = 'ready'");
  });

  it("should filter by type", async () => {
    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue([]);

    const req = createRequest("test", { type: "url" });

    await GET(req);

    const query = (prisma.$queryRawUnsafe as jest.Mock).mock.calls[0][0];
    expect(query).toContain("type = 'url'");
  });

  it("should filter by tag", async () => {
    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue([]);

    const req = createRequest("test", { tag: "important" });

    await GET(req);

    const query = (prisma.$queryRawUnsafe as jest.Mock).mock.calls[0][0];
    expect(query).toContain("tags LIKE '%important%'");
  });

  it("should require authentication", async () => {
    (requireAuth as jest.Mock).mockResolvedValue({
      user: null,
      response: null,
    });

    // Mock createAuthError to throw
    const req = createRequest("test");

    await expect(GET(req)).rejects.toThrow();
  });

  it("should handle database errors", async () => {
    (prisma.$queryRawUnsafe as jest.Mock).mockRejectedValue(new Error("DB Error"));

    const req = createRequest("test");

    const response = await GET(req);

    expect(response.status).toBeGreaterThanOrEqual(400);
  });

  it("should normalize Turkish characters in search", async () => {
    // First call returns empty (original search)
    // Second call should use normalized term
    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValueOnce([]).mockResolvedValueOnce([
      {
        id: "note-1",
        title: "Ekşi Note",
        content: "Content",
        summary: "Summary",
        status: "ready",
        type: "text",
        rank: 0.7,
      },
    ]);

    const req = createRequest("eksi"); // Turkish: ekşi

    const response = await GET(req);
    const data = await response.json();

    // Should have tried normalized search
    expect(prisma.$queryRawUnsafe).toHaveBeenCalledTimes(2);
  });

  it("should return results with rank", async () => {
    const mockResults = [
      {
        id: "note-1",
        title: "High Rank",
        rank: 1.0,
      },
      {
        id: "note-2",
        title: "Low Rank",
        rank: 0.5,
      },
    ];

    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue(mockResults);

    const req = createRequest("test");

    const response = await GET(req);
    const data = await response.json();

    expect(data.results[0].rank).toBe(1.0);
    expect(data.results[1].rank).toBe(0.5);
  });
});
