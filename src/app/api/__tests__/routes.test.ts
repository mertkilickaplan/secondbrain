/**
 * API Route Tests
 * Tests for all API endpoints with mocked auth and prisma
 */

import { NextRequest } from "next/server";

// Mock Supabase auth
jest.mock("@/lib/supabase/auth", () => ({
    requireAuth: jest.fn(),
}));

// Mock Prisma
jest.mock("@/lib/db", () => ({
    prisma: {
        note: {
            create: jest.fn(),
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        edge: {
            findMany: jest.fn(),
            create: jest.fn(),
        },
        userSubscription: {
            findUnique: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
        },
        // For search API which uses raw SQL
        $queryRawUnsafe: jest.fn(),
    },
}));

// Mock subscription helpers
jest.mock("@/lib/subscription-helpers", () => ({
    canCreateNote: jest.fn(() => true),
    canUseAI: jest.fn(() => false),
    incrementNoteCount: jest.fn(),
    getUserSubscription: jest.fn(),
}));

// Mock rate limiter
jest.mock("@/lib/rateLimit", () => ({
    checkRateLimit: jest.fn(() => ({ allowed: true })),
}));

import { requireAuth } from "@/lib/supabase/auth";
import { prisma } from "@/lib/db";
import { POST } from "@/app/api/notes/route";
import { GET as getGraph } from "@/app/api/graph/route";
import { GET as searchNotes } from "@/app/api/search/route";

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>;
const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe("API Routes", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe("POST /api/notes", () => {
        it("should return 401 when not authenticated", async () => {
            mockRequireAuth.mockResolvedValue({
                response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
            } as any);

            const req = new Request("http://localhost/api/notes", {
                method: "POST",
                body: JSON.stringify({ content: "Test note" }),
            });

            const response = await POST(req);
            expect(response?.status).toBe(401);
        });

        it("should create a note when authenticated", async () => {
            mockRequireAuth.mockResolvedValue({
                user: { id: "user-123" } as any,
            } as any);

            (mockPrisma.note.create as jest.Mock).mockResolvedValue({
                id: "note-123",
                userId: "user-123",
                content: "Test note",
                type: "text",
                url: null,
                title: "New Note",
                summary: null,
                topics: null,
                tags: null,
                embedding: null,
                createdAt: new Date(),
                status: "ready",
            });

            const req = new Request("http://localhost/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: "Test note" }),
            });

            const response = await POST(req);
            expect(response?.status).toBe(201);

            const data = await response?.json();
            expect(data.id).toBe("note-123");
            expect(data.content).toBe("Test note");
        });

        it("should return 400 for empty content", async () => {
            mockRequireAuth.mockResolvedValue({
                user: { id: "user-123" } as any,
            } as any);

            const req = new Request("http://localhost/api/notes", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: "" }),
            });

            const response = await POST(req);
            expect(response?.status).toBe(400);
        });
    });

    describe("GET /api/graph", () => {
        it("should return 401 when not authenticated", async () => {
            mockRequireAuth.mockResolvedValue({
                response: new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401 }),
            } as any);

            const response = await getGraph();
            expect(response.status).toBe(401);
        });

        it("should return nodes and links when authenticated", async () => {
            mockRequireAuth.mockResolvedValue({
                user: { id: "user-123" } as any,
            } as any);

            (mockPrisma.note.findMany as jest.Mock).mockResolvedValue([
                {
                    id: "note-1",
                    userId: "user-123",
                    title: "Note 1",
                    summary: "Summary 1",
                    type: "text",
                    url: null,
                    content: "Content 1",
                    status: "ready",
                    tags: null,
                    topics: null,
                    embedding: null,
                    createdAt: new Date(),
                },
            ]);

            (mockPrisma.edge.findMany as jest.Mock).mockResolvedValue([]);

            const response = await getGraph();
            expect(response.status).toBe(200);

            const data = await response.json();
            expect(data.nodes).toHaveLength(1);
            expect(data.links).toHaveLength(0);
        });
    });

    describe("GET /api/search", () => {
        it("should return empty results for short query", async () => {
            mockRequireAuth.mockResolvedValue({
                user: { id: "user-123" } as any,
            } as any);

            const req = new Request("http://localhost/api/search?q=a");
            const response = await searchNotes(req);
            expect(response.status).toBe(200);

            const data = await response.json();
            expect(data.results).toHaveLength(0);
        });

        it("should search notes by query", async () => {
            mockRequireAuth.mockResolvedValue({
                user: { id: "user-123" } as any,
            } as any);

            // Search API uses $queryRawUnsafe for contains search
            // It may call it multiple times (original + normalized)
            (mockPrisma.$queryRawUnsafe as jest.Mock).mockResolvedValue([
                {
                    id: "note-1",
                    title: "Test Note",
                    summary: "Test summary",
                    status: "ready",
                    content: "Test content",
                    type: "text",
                    rank: 1.0,
                },
            ]);

            const req = new Request("http://localhost/api/search?q=test");
            const response = await searchNotes(req);
            expect(response.status).toBe(200);

            const data = await response.json();
            expect(data.results.length).toBeGreaterThanOrEqual(1);
            expect(data.results[0].title).toBe("Test Note");
        });
    });
});
