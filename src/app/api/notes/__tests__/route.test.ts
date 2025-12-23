/**
 * Notes API Tests
 * Tests for /api/notes endpoint
 */

import { POST } from '../route';
import { prisma } from '@/lib/db';
import { checkRateLimit } from '@/lib/rateLimit';
import { requireAuth } from '@/lib/supabase/auth';
import { canCreateNote, incrementNoteCount, canUseAI } from '@/lib/subscription-helpers';
import { NextResponse } from 'next/server';

// Mock dependencies
jest.mock('@/lib/db');
jest.mock('@/lib/rateLimit');
jest.mock('@/lib/supabase/auth');
jest.mock('@/lib/subscription-helpers');
jest.mock('@/lib/urlMetadata');

describe('/api/notes POST', () => {
    const mockUserId = 'test-user-123';
    const mockRequest = (body: any) => ({
        json: async () => body,
    }) as Request;

    beforeEach(() => {
        jest.clearAllMocks();

        // Default mocks
        (checkRateLimit as jest.Mock).mockReturnValue({ allowed: true });
        (requireAuth as jest.Mock).mockResolvedValue({
            user: { id: mockUserId },
            response: null,
        });
        (canCreateNote as jest.Mock).mockResolvedValue(true);
        (canUseAI as jest.Mock).mockResolvedValue(false);
        (incrementNoteCount as jest.Mock).mockResolvedValue(undefined);
    });

    it('should create a text note successfully', async () => {
        const mockNote = {
            id: 'note-123',
            userId: mockUserId,
            content: 'Test note content',
            type: 'text',
            title: 'New Note',
            status: 'ready',
        };

        (prisma.note.create as jest.Mock).mockResolvedValue(mockNote);

        const req = mockRequest({
            content: 'Test note content',
            type: 'text',
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(201);
        expect(data).toEqual(mockNote);
        expect(prisma.note.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                userId: mockUserId,
                content: 'Test note content',
                type: 'text',
                status: 'ready',
            }),
        });
        expect(incrementNoteCount).toHaveBeenCalledWith(mockUserId);
    });

    it('should create note with processing status for premium users', async () => {
        (canUseAI as jest.Mock).mockResolvedValue(true);

        const mockNote = {
            id: 'note-123',
            status: 'processing',
        };

        (prisma.note.create as jest.Mock).mockResolvedValue(mockNote);

        const req = mockRequest({
            content: 'Test note',
            type: 'text',
        });

        await POST(req);

        expect(prisma.note.create).toHaveBeenCalledWith({
            data: expect.objectContaining({
                status: 'processing',
            }),
        });
    });

    it('should reject when rate limit exceeded', async () => {
        (checkRateLimit as jest.Mock).mockReturnValue({
            allowed: false,
            response: NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 }),
        });

        const req = mockRequest({ content: 'Test' });
        const response = await POST(req);

        expect(response.status).toBe(429);
    });

    it('should reject when user not authenticated', async () => {
        (requireAuth as jest.Mock).mockResolvedValue({
            user: null,
            response: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }),
        });

        const req = mockRequest({ content: 'Test' });
        const response = await POST(req);

        expect(response.status).toBe(401);
    });

    it('should reject when subscription limit reached', async () => {
        (canCreateNote as jest.Mock).mockResolvedValue(false);

        const req = mockRequest({ content: 'Test' });
        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(402);
        expect(data.code).toBe('LIMIT_REACHED');
        expect(data.error).toBe('Note limit reached');
    });

    it('should validate content for text notes', async () => {
        const req = mockRequest({
            content: '', // Empty content
            type: 'text',
        });

        const response = await POST(req);

        expect(response.status).toBe(400);
    });

    it('should validate URL for url notes', async () => {
        const req = mockRequest({
            type: 'url',
            url: 'invalid-url',
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Invalid URL');
    });

    it('should require URL for url type notes', async () => {
        const req = mockRequest({
            type: 'url',
            content: 'Some content',
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('URL required');
    });

    it('should handle database errors gracefully', async () => {
        (prisma.note.create as jest.Mock).mockRejectedValue(
            new Error('Database connection failed')
        );

        const req = mockRequest({
            content: 'Test',
            type: 'text',
        });

        const response = await POST(req);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Database error - please try again');
    });
});
