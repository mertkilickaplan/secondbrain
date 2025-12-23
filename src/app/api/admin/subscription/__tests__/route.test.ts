/**
 * Admin Subscription API Tests
 * Tests for /api/admin/subscription endpoint
 */

import { POST, GET } from '../route';
import { upgradeToPremium, downgradeToFree, getUserSubscription } from '@/lib/subscription-helpers';

// Mock dependencies
jest.mock('@/lib/subscription-helpers');

// Polyfill Request for Node.js environment
global.Request = class Request {
    url: string;
    method: string;
    headers: Map<string, string>;
    _body: any;

    constructor(url: string, init?: any) {
        this.url = url;
        this.method = init?.method || 'GET';
        this.headers = new Map();

        if (init?.headers) {
            if (init.headers instanceof Headers) {
                init.headers.forEach((value: string, key: string) => {
                    this.headers.set(key.toLowerCase(), value);
                });
            } else if (typeof init.headers === 'object') {
                Object.entries(init.headers).forEach(([key, value]) => {
                    this.headers.set(key.toLowerCase(), value as string);
                });
            }
        }

        this._body = init?.body;
    }

    async json() {
        return JSON.parse(this._body);
    }
} as any;

global.Headers = class Headers {
    private map = new Map<string, string>();

    set(key: string, value: string) {
        this.map.set(key.toLowerCase(), value);
    }

    get(key: string) {
        return this.map.get(key.toLowerCase()) || null;
    }

    forEach(callback: (value: string, key: string) => void) {
        this.map.forEach(callback);
    }
} as any;

describe('/api/admin/subscription', () => {
    const mockUserId = 'test-user-123';
    const validAdminKey = process.env.ADMIN_SECRET_KEY || 'change-this-in-production';

    const createRequest = (body?: any, adminKey?: string, url?: string) => {
        const headers: Record<string, string> = {};
        if (adminKey !== undefined) {
            headers['authorization'] = `Bearer ${adminKey}`;
        }

        return new Request(url || 'http://localhost:3000/api/admin/subscription', {
            method: body ? 'POST' : 'GET',
            headers,
            body: body ? JSON.stringify(body) : undefined,
        }) as any;
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('POST (Upgrade/Downgrade)', () => {
        it('should upgrade user to premium with valid admin key', async () => {
            const mockSubscription = {
                userId: mockUserId,
                tier: 'premium',
                maxNotes: null,
                aiEnabled: true,
            };

            (upgradeToPremium as jest.Mock).mockResolvedValue(mockSubscription);

            const req = createRequest(
                { userId: mockUserId, action: 'upgrade' },
                validAdminKey
            );

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.subscription).toEqual(mockSubscription);
            expect(upgradeToPremium).toHaveBeenCalledWith(mockUserId);
        });

        it('should downgrade user to free with valid admin key', async () => {
            const mockSubscription = {
                userId: mockUserId,
                tier: 'free',
                maxNotes: 25,
                aiEnabled: false,
            };

            (downgradeToFree as jest.Mock).mockResolvedValue(mockSubscription);

            const req = createRequest(
                { userId: mockUserId, action: 'downgrade' },
                validAdminKey
            );

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.subscription).toEqual(mockSubscription);
            expect(downgradeToFree).toHaveBeenCalledWith(mockUserId);
        });

        it('should reject without admin key', async () => {
            const req = createRequest({ userId: mockUserId, action: 'upgrade' });

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(401);
            expect(data.error).toBe('Unauthorized');
        });

        it('should reject with invalid admin key', async () => {
            const req = createRequest(
                { userId: mockUserId, action: 'upgrade' },
                'invalid-key'
            );

            const response = await POST(req);

            expect(response.status).toBe(401);
        });

        it('should require userId', async () => {
            const req = createRequest({ action: 'upgrade' }, validAdminKey);

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('userId required');
        });

        it('should reject invalid action', async () => {
            const req = createRequest(
                { userId: mockUserId, action: 'invalid' },
                validAdminKey
            );

            const response = await POST(req);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toContain('Invalid action');
        });
    });

    describe('GET (Check Subscription)', () => {
        it('should get user subscription with valid admin key', async () => {
            const mockSubscription = {
                id: 'sub-123',
                userId: mockUserId,
                tier: 'premium',
                noteCount: 50,
                maxNotes: null,
                aiEnabled: true,
            };

            (getUserSubscription as jest.Mock).mockResolvedValue(mockSubscription);

            const req = createRequest(
                undefined,
                validAdminKey,
                `http://localhost:3000/api/admin/subscription?userId=${mockUserId}`
            );

            const response = await GET(req);
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data).toEqual(mockSubscription);
            expect(getUserSubscription).toHaveBeenCalledWith(mockUserId);
        });

        it('should reject without admin key', async () => {
            const req = createRequest(
                undefined,
                undefined,
                `http://localhost:3000/api/admin/subscription?userId=${mockUserId}`
            );

            const response = await GET(req);

            expect(response.status).toBe(401);
        });

        it('should require userId query param', async () => {
            const req = createRequest(undefined, validAdminKey);

            const response = await GET(req);
            const data = await response.json();

            expect(response.status).toBe(400);
            expect(data.error).toBe('userId required');
        });
    });
});
