/**
 * Test Utilities
 * Shared helpers for testing across the application
 */

import { prisma } from './db';
import type { Note, UserSubscription } from './generated/client';

/**
 * Generate mock note data
 */
export function createMockNote(overrides?: Partial<Note>): Omit<Note, 'id' | 'createdAt'> {
    return {
        userId: 'test-user-id',
        content: 'Test note content',
        type: 'text',
        url: null,
        title: 'Test Note',
        summary: 'A test note summary',
        topics: JSON.stringify(['test', 'mock']),
        tags: null,
        embedding: null,
        status: 'ready',
        ...overrides,
    };
}

/**
 * Generate mock subscription data
 */
export function createMockSubscription(
    overrides?: Partial<UserSubscription>
): Omit<UserSubscription, 'id' | 'createdAt' | 'updatedAt'> {
    return {
        userId: 'test-user-id',
        tier: 'free',
        noteCount: 0,
        maxNotes: 25,
        aiEnabled: false,
        ...overrides,
    };
}

/**
 * Create a test user in the database
 * Note: This requires a test database connection
 */
export async function createTestUser(userId: string) {
    return await prisma.userSubscription.create({
        data: {
            userId,
            tier: 'free',
            noteCount: 0,
            maxNotes: 25,
            aiEnabled: false,
        },
    });
}

/**
 * Clean up test data from database
 */
export async function cleanupTestData(userId: string) {
    await prisma.edge.deleteMany({
        where: {
            OR: [
                { source: { userId } },
                { target: { userId } },
            ],
        },
    });

    await prisma.note.deleteMany({
        where: { userId },
    });

    await prisma.userSubscription.deleteMany({
        where: { userId },
    });
}

/**
 * Wait for a condition to be true
 */
export async function waitFor(
    condition: () => boolean | Promise<boolean>,
    timeout = 5000,
    interval = 100
): Promise<void> {
    const startTime = Date.now();

    while (Date.now() - startTime < timeout) {
        if (await condition()) {
            return;
        }
        await new Promise(resolve => setTimeout(resolve, interval));
    }

    throw new Error(`Timeout waiting for condition after ${timeout}ms`);
}

/**
 * Mock fetch for API testing
 */
export function createMockFetch(mockResponse: any) {
    return jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockResponse,
        status: 200,
    });
}

/**
 * Create mock Supabase user
 */
export function createMockSupabaseUser(overrides?: any) {
    return {
        id: 'test-user-id',
        email: 'test@example.com',
        app_metadata: {},
        user_metadata: {},
        aud: 'authenticated',
        created_at: new Date().toISOString(),
        ...overrides,
    };
}
