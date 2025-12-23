/**
 * Subscription API Tests
 * Tests for /api/subscription endpoint
 */

import { GET, POST, DELETE } from "../route";
import { requireAuth } from "@/lib/supabase/auth";
import { getUserSubscription, upgradeToPremium, downgradeToFree } from "@/lib/subscription-helpers";
import { NextResponse } from "next/server";

// Mock dependencies
jest.mock("@/lib/supabase/auth");
jest.mock("@/lib/subscription-helpers");

describe("/api/subscription", () => {
  const mockUserId = "test-user-123";

  beforeEach(() => {
    jest.clearAllMocks();

    (requireAuth as jest.Mock).mockResolvedValue({
      user: { id: mockUserId },
      response: null,
    });
  });

  describe("GET", () => {
    it("should fetch current subscription", async () => {
      const mockSubscription = {
        id: "sub-123",
        userId: mockUserId,
        tier: "free",
        noteCount: 10,
        maxNotes: 25,
        aiEnabled: false,
      };

      (getUserSubscription as jest.Mock).mockResolvedValue(mockSubscription);

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data).toEqual(mockSubscription);
      expect(getUserSubscription).toHaveBeenCalledWith(mockUserId);
    });

    it("should require authentication", async () => {
      (requireAuth as jest.Mock).mockResolvedValue({
        user: null,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      });

      const response = await GET();

      expect(response.status).toBe(401);
    });

    it("should handle errors", async () => {
      (getUserSubscription as jest.Mock).mockRejectedValue(new Error("DB Error"));

      const response = await GET();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to fetch subscription");
    });
  });

  describe("POST (Upgrade)", () => {
    it("should upgrade to premium successfully", async () => {
      const upgradedSubscription = {
        userId: mockUserId,
        tier: "premium",
        maxNotes: null,
        aiEnabled: true,
      };

      (upgradeToPremium as jest.Mock).mockResolvedValue(upgradedSubscription);

      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.subscription).toEqual(upgradedSubscription);
      expect(data.message).toBe("Successfully upgraded to Premium!");
      expect(upgradeToPremium).toHaveBeenCalledWith(mockUserId);
    });

    it("should require authentication", async () => {
      (requireAuth as jest.Mock).mockResolvedValue({
        user: null,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      });

      const response = await POST();

      expect(response.status).toBe(401);
    });

    it("should handle upgrade errors", async () => {
      (upgradeToPremium as jest.Mock).mockRejectedValue(new Error("Upgrade failed"));

      const response = await POST();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to upgrade subscription");
    });
  });

  describe("DELETE (Downgrade)", () => {
    it("should downgrade to free successfully", async () => {
      const downgradedSubscription = {
        userId: mockUserId,
        tier: "free",
        maxNotes: 25,
        aiEnabled: false,
      };

      (downgradeToFree as jest.Mock).mockResolvedValue(downgradedSubscription);

      const response = await DELETE();
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.subscription).toEqual(downgradedSubscription);
      expect(data.message).toBe("Downgraded to Free tier");
      expect(downgradeToFree).toHaveBeenCalledWith(mockUserId);
    });

    it("should require authentication", async () => {
      (requireAuth as jest.Mock).mockResolvedValue({
        user: null,
        response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      });

      const response = await DELETE();

      expect(response.status).toBe(401);
    });

    it("should handle downgrade errors", async () => {
      (downgradeToFree as jest.Mock).mockRejectedValue(new Error("Downgrade failed"));

      const response = await DELETE();
      const data = await response.json();

      expect(response.status).toBe(500);
      expect(data.error).toBe("Failed to downgrade subscription");
    });
  });
});
