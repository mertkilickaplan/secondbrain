/**
 * Subscription Helper Tests
 * Tests for subscription-related helper functions
 */

import {
  canCreateNote,
  canUseAI,
  incrementNoteCount,
  getUserSubscription,
  upgradeToPremium,
  downgradeToFree,
} from "../subscription-helpers";
import { prisma } from "../db";

// Mock Prisma
jest.mock("../db", () => ({
  prisma: {
    userSubscription: {
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    note: {
      updateMany: jest.fn(),
      findMany: jest.fn(),
    },
    edge: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn((callback) =>
      callback({
        userSubscription: {
          update: jest.fn().mockResolvedValue({
            userId: "test-user-123",
            tier: "free",
            maxNotes: 25,
            aiEnabled: false,
          }),
        },
        note: {
          findMany: jest.fn().mockResolvedValue([]),
          updateMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
        edge: {
          deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
        },
      })
    ),
  },
}));

describe("Subscription Helpers", () => {
  const mockUserId = "test-user-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("canCreateNote", () => {
    it("should allow free tier user under limit", async () => {
      (prisma.userSubscription.findUnique as jest.Mock).mockResolvedValue({
        tier: "free",
        noteCount: 10,
        maxNotes: 25,
      });

      const result = await canCreateNote(mockUserId);

      expect(result).toBe(true);
    });

    it("should block free tier user at limit", async () => {
      (prisma.userSubscription.findUnique as jest.Mock).mockResolvedValue({
        tier: "free",
        noteCount: 25,
        maxNotes: 25,
      });

      const result = await canCreateNote(mockUserId);

      expect(result).toBe(false);
    });

    it("should allow premium user (unlimited)", async () => {
      (prisma.userSubscription.findUnique as jest.Mock).mockResolvedValue({
        tier: "premium",
        noteCount: 1000,
        maxNotes: null,
      });

      const result = await canCreateNote(mockUserId);

      expect(result).toBe(true);
    });

    it("should create subscription if not exists and allow", async () => {
      (prisma.userSubscription.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.userSubscription.create as jest.Mock).mockResolvedValue({
        tier: "free",
        noteCount: 0,
        maxNotes: 25,
      });

      const result = await canCreateNote(mockUserId);

      expect(result).toBe(true);
      expect(prisma.userSubscription.create).toHaveBeenCalledWith({
        data: {
          userId: mockUserId,
          tier: "free",
          noteCount: 0,
          maxNotes: 25,
          aiEnabled: false,
        },
      });
    });
  });

  describe("canUseAI", () => {
    it("should return false for free tier", async () => {
      (prisma.userSubscription.findUnique as jest.Mock).mockResolvedValue({
        tier: "free",
        aiEnabled: false,
      });

      const result = await canUseAI(mockUserId);

      expect(result).toBe(false);
    });

    it("should return true for premium tier", async () => {
      (prisma.userSubscription.findUnique as jest.Mock).mockResolvedValue({
        tier: "premium",
        aiEnabled: true,
      });

      const result = await canUseAI(mockUserId);

      expect(result).toBe(true);
    });

    it("should create subscription if not exists and return false", async () => {
      (prisma.userSubscription.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.userSubscription.create as jest.Mock).mockResolvedValue({
        tier: "free",
        aiEnabled: false,
      });

      const result = await canUseAI(mockUserId);

      expect(result).toBe(false);
    });
  });

  describe("incrementNoteCount", () => {
    it("should increment note count", async () => {
      (prisma.userSubscription.update as jest.Mock).mockResolvedValue({
        noteCount: 11,
      });

      await incrementNoteCount(mockUserId);

      expect(prisma.userSubscription.update).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        data: { noteCount: { increment: 1 } },
      });
    });
  });

  describe("getUserSubscription", () => {
    it("should return existing subscription", async () => {
      const mockSubscription = {
        id: "sub-123",
        userId: mockUserId,
        tier: "premium",
        noteCount: 50,
        maxNotes: null,
        aiEnabled: true,
      };

      (prisma.userSubscription.findUnique as jest.Mock).mockResolvedValue(mockSubscription);

      const result = await getUserSubscription(mockUserId);

      expect(result).toEqual(mockSubscription);
    });

    it("should create subscription if not exists", async () => {
      const newSubscription = {
        id: "sub-new",
        userId: mockUserId,
        tier: "free",
        noteCount: 0,
        maxNotes: 25,
        aiEnabled: false,
      };

      (prisma.userSubscription.findUnique as jest.Mock).mockResolvedValue(null);
      (prisma.userSubscription.create as jest.Mock).mockResolvedValue(newSubscription);

      const result = await getUserSubscription(mockUserId);

      expect(result).toEqual(newSubscription);
      expect(prisma.userSubscription.create).toHaveBeenCalled();
    });
  });

  describe("upgradeToPremium", () => {
    it("should upgrade user to premium and mark notes for processing", async () => {
      const upgradedSubscription = {
        userId: mockUserId,
        tier: "premium",
        maxNotes: null,
        aiEnabled: true,
      };

      (prisma.userSubscription.update as jest.Mock).mockResolvedValue(upgradedSubscription);
      (prisma.note.updateMany as jest.Mock).mockResolvedValue({ count: 3 });

      const result = await upgradeToPremium(mockUserId);

      expect(result).toEqual(upgradedSubscription);
      expect(prisma.userSubscription.update).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        data: {
          tier: "premium",
          maxNotes: null,
          aiEnabled: true,
        },
      });
      expect(prisma.note.updateMany).toHaveBeenCalledWith({
        where: {
          userId: mockUserId,
          status: "ready",
          summary: null,
        },
        data: { status: "processing" },
      });
    });
  });

  describe("downgradeToFree", () => {
    it("should downgrade user to free and cleanup AI data", async () => {
      const downgradedSubscription = {
        userId: mockUserId,
        tier: "free",
        maxNotes: 25,
        aiEnabled: false,
      };

      // The $transaction mock already returns the expected subscription
      // We just verify it was called
      const result = await downgradeToFree(mockUserId);

      expect(result).toEqual(downgradedSubscription);
      expect(prisma.$transaction).toHaveBeenCalled();
    });
  });
});
