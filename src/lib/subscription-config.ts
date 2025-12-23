export const SUBSCRIPTION_CONFIG = {
  FREE_TIER: {
    maxNotes: 25,
    aiEnabled: false,
    tier: "free" as const,
  },
  PREMIUM_TIER: {
    maxNotes: null, // unlimited
    aiEnabled: true,
    tier: "premium" as const,
  },
} as const;

export const PRICING = {
  premium: {
    monthly: 1.99,
    currency: "USD",
    displayPrice: "$1.99/month",
  },
} as const;

export const FEATURE_MATRIX = {
  free: ["Limited notes (25)", "Basic search", "Graph visualization", "Export/Import"],
  premium: [
    "Unlimited notes",
    "AI-powered analysis",
    "Smart connections",
    "AI summaries",
    "Topic extraction",
    "Priority support",
  ],
} as const;

export type SubscriptionTier = "free" | "premium";

export interface SubscriptionLimits {
  maxNotes: number | null;
  aiEnabled: boolean;
  tier: SubscriptionTier;
}
