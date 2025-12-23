import { prisma } from "./db";
import { SUBSCRIPTION_CONFIG, type SubscriptionTier } from "./subscription-config";

export interface UserSubscription {
  id: string;
  userId: string;
  tier: SubscriptionTier;
  noteCount: number;
  maxNotes: number | null;
  aiEnabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageStats {
  noteCount: number;
  maxNotes: number | null;
  tier: SubscriptionTier;
  aiEnabled: boolean;
  percentUsed: number | null;
  canCreateNote: boolean;
  canUseAI: boolean;
}

/**
 * Get or create user subscription
 * Creates a free tier subscription if none exists
 */
export async function getUserSubscription(userId: string): Promise<UserSubscription> {
  let subscription = await prisma.userSubscription.findUnique({
    where: { userId },
  });

  if (!subscription) {
    // Auto-create free tier subscription
    subscription = await prisma.userSubscription.create({
      data: {
        userId,
        tier: SUBSCRIPTION_CONFIG.FREE_TIER.tier,
        maxNotes: SUBSCRIPTION_CONFIG.FREE_TIER.maxNotes,
        aiEnabled: SUBSCRIPTION_CONFIG.FREE_TIER.aiEnabled,
        noteCount: 0,
      },
    });
    console.log(`[SUBSCRIPTION] Created free tier subscription for user: ${userId}`);
  }

  return subscription as UserSubscription;
}

/**
 * Check if user can create a note
 * Returns true if under limit or premium
 */
export async function canCreateNote(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);

  // Premium users have unlimited notes
  if (subscription.maxNotes === null) {
    return true;
  }

  // Free users check against limit
  return subscription.noteCount < subscription.maxNotes;
}

/**
 * Check if user has AI access
 */
export async function canUseAI(userId: string): Promise<boolean> {
  const subscription = await getUserSubscription(userId);
  return subscription.aiEnabled;
}

/**
 * Increment note count (thread-safe)
 * Uses atomic increment to prevent race conditions
 */
export async function incrementNoteCount(userId: string): Promise<void> {
  await prisma.userSubscription.update({
    where: { userId },
    data: {
      noteCount: {
        increment: 1,
      },
    },
  });
  console.log(`[SUBSCRIPTION] Incremented note count for user: ${userId}`);
}

/**
 * Decrement note count (thread-safe)
 * Uses atomic decrement, ensures count doesn't go below 0
 */
export async function decrementNoteCount(userId: string): Promise<void> {
  const subscription = await getUserSubscription(userId);

  if (subscription.noteCount > 0) {
    await prisma.userSubscription.update({
      where: { userId },
      data: {
        noteCount: {
          decrement: 1,
        },
      },
    });
    console.log(`[SUBSCRIPTION] Decremented note count for user: ${userId}`);
  }
}

/**
 * Upgrade user to premium
 */
export async function upgradeToPremium(userId: string): Promise<UserSubscription> {
  const subscription = await prisma.userSubscription.update({
    where: { userId },
    data: {
      tier: SUBSCRIPTION_CONFIG.PREMIUM_TIER.tier,
      maxNotes: SUBSCRIPTION_CONFIG.PREMIUM_TIER.maxNotes,
      aiEnabled: SUBSCRIPTION_CONFIG.PREMIUM_TIER.aiEnabled,
    },
  });

  console.log(`[SUBSCRIPTION] Upgraded user to premium: ${userId}`);
  return subscription as UserSubscription;
}

/**
 * Downgrade user to free
 */
export async function downgradeToFree(userId: string): Promise<UserSubscription> {
  const subscription = await prisma.userSubscription.update({
    where: { userId },
    data: {
      tier: SUBSCRIPTION_CONFIG.FREE_TIER.tier,
      maxNotes: SUBSCRIPTION_CONFIG.FREE_TIER.maxNotes,
      aiEnabled: SUBSCRIPTION_CONFIG.FREE_TIER.aiEnabled,
    },
  });

  console.log(`[SUBSCRIPTION] Downgraded user to free: ${userId}`);
  return subscription as UserSubscription;
}

/**
 * Get usage statistics for a user
 */
export async function getUsageStats(userId: string): Promise<UsageStats> {
  const subscription = await getUserSubscription(userId);

  const percentUsed =
    subscription.maxNotes !== null
      ? Math.round((subscription.noteCount / subscription.maxNotes) * 100)
      : null;

  const canCreate =
    subscription.maxNotes === null || subscription.noteCount < subscription.maxNotes;

  return {
    noteCount: subscription.noteCount,
    maxNotes: subscription.maxNotes,
    tier: subscription.tier as SubscriptionTier,
    aiEnabled: subscription.aiEnabled,
    percentUsed,
    canCreateNote: canCreate,
    canUseAI: subscription.aiEnabled,
  };
}

/**
 * Recalculate note count from actual notes in database
 * Used for reconciliation to fix drift
 */
export async function recalculateNoteCount(userId: string): Promise<number> {
  const actualCount = await prisma.note.count({
    where: { userId },
  });

  await prisma.userSubscription.update({
    where: { userId },
    data: { noteCount: actualCount },
  });

  console.log(`[SUBSCRIPTION] Recalculated note count for user ${userId}: ${actualCount}`);
  return actualCount;
}
