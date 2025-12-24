"use client";

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import type { SubscriptionTier } from "@/lib/subscription-config";

interface UsageStats {
  noteCount: number;
  maxNotes: number | null;
  tier: SubscriptionTier;
  aiEnabled: boolean;
  percentUsed: number | null;
  canCreateNote: boolean;
  canUseAI: boolean;
}

interface SubscriptionContextType {
  subscription: UsageStats | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  showUpgradeModal: () => void;
  hideUpgradeModal: () => void;
  isUpgradeModalOpen: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
  const [subscription, setSubscription] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);

  // Track previous tier to detect upgrades
  const previousTierRef = useRef<SubscriptionTier | null>(null);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/subscription/usage");

      // If unauthorized, user is not logged in - this is OK, just don't set subscription
      if (response.status === 401) {
        setSubscription(null);
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch subscription");
      }

      const data = await response.json();

      // Detect tier change scenarios that require processing:
      // 1. free -> premium upgrade (via polling)
      // 2. Initial load as premium (after Supabase change + page refresh)
      const shouldTriggerProcessing =
        (previousTierRef.current === "free" && data.tier === "premium") ||
        (previousTierRef.current === null && data.tier === "premium" && data.canUseAI);

      if (shouldTriggerProcessing) {
        console.log(
          "[SUBSCRIPTION] Detected premium access, triggering AI processing for unprocessed notes"
        );
        // Trigger process-pending in background
        fetch("/api/notes/process-pending", { method: "POST" }).catch(console.error);
      }

      // Update previous tier reference
      previousTierRef.current = data.tier;

      setSubscription(data);
    } catch (err: any) {
      console.error("Error fetching subscription:", err);
      // Don't throw error - just log it
      // This allows the app to work even if subscription fetch fails
      setError(err.message);
      setSubscription(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();

    // Poll every 30 seconds for subscription changes (e.g., made via Supabase dashboard)
    const interval = setInterval(fetchSubscription, 30000);

    return () => clearInterval(interval);
  }, [fetchSubscription]);

  const showUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(true);
    console.log("[SUBSCRIPTION] Upgrade modal opened");
  }, []);

  const hideUpgradeModal = useCallback(() => {
    setIsUpgradeModalOpen(false);
    console.log("[SUBSCRIPTION] Upgrade modal closed");
  }, []);

  const value: SubscriptionContextType = {
    subscription,
    loading,
    error,
    refetch: fetchSubscription,
    showUpgradeModal,
    hideUpgradeModal,
    isUpgradeModalOpen,
  };

  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}
