-- CreateEnum
CREATE TYPE "SubscriptionTier" AS ENUM ('free', 'premium');

-- AlterTable - Remove default first, change type, then add default back
ALTER TABLE "UserSubscription" 
  ALTER COLUMN "tier" DROP DEFAULT;

ALTER TABLE "UserSubscription" 
  ALTER COLUMN "tier" TYPE "SubscriptionTier" USING "tier"::"SubscriptionTier";

ALTER TABLE "UserSubscription" 
  ALTER COLUMN "tier" SET DEFAULT 'free'::"SubscriptionTier";