-- ============================================
-- Email Display for UserSubscription Table
-- ============================================
-- Run this in Supabase SQL Editor to add email column visibility

-- Create a view that shows UserSubscription with email
CREATE OR REPLACE VIEW "UserSubscriptionWithEmail" AS
SELECT 
  us.id,
  us."userId",
  au.email,  -- Email from auth.users
  us.tier,
  us."noteCount",
  us."maxNotes",
  us."aiEnabled",
  us."createdAt",
  us."updatedAt"
FROM "UserSubscription" us
LEFT JOIN auth.users au ON us."userId"::text = au.id::text;

-- Grant permissions
GRANT SELECT ON "UserSubscriptionWithEmail" TO authenticated;
GRANT SELECT ON "UserSubscriptionWithEmail" TO service_role;
GRANT SELECT ON "UserSubscriptionWithEmail" TO anon;

-- ============================================
-- How to Use in Supabase Table Editor:
-- ============================================
-- 1. Go to Supabase Dashboard > SQL Editor
-- 2. Paste this entire script
-- 3. Click "Run"
-- 4. Go to Table Editor
-- 5. You'll see a new table: "UserSubscriptionWithEmail"
-- 6. This view shows email alongside userId
-- 7. Use this view for admin tasks instead of UserSubscription table

-- ============================================
-- Benefits:
-- ============================================
-- ✅ Email automatically synced from auth.users
-- ✅ No data duplication
-- ✅ Read-only (can't accidentally modify emails)
-- ✅ Always up-to-date
-- ✅ GDPR compliant (single source of truth)

-- ============================================
-- To Update Subscriptions:
-- ============================================
-- You still update the original UserSubscription table
-- The view will automatically reflect changes

-- Example: Upgrade user to premium
-- UPDATE "UserSubscription" 
-- SET tier='premium', "aiEnabled"=true, "maxNotes"=NULL 
-- WHERE "userId" = (SELECT id FROM auth.users WHERE email='user@example.com');
