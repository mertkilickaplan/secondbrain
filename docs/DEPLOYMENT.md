# Deployment Guide

Complete guide for deploying Second Brain Lite to production.

## Prerequisites

Before deploying, ensure you have:

- [ ] GitHub account
- [ ] Vercel account (free tier works)
- [ ] Supabase account (free tier works)
- [ ] Google AI API key ([Get it here](https://aistudio.google.com/app/apikey))

---

## Step 1: Supabase Project Setup

### 1.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `second-brain-lite` (or your choice)
   - **Database Password**: Generate a strong password (save it!)
   - **Region**: Choose closest to your users
4. Click **"Create new project"**
5. Wait 2-3 minutes for project initialization

### 1.2 Get Supabase Credentials

1. Go to **Project Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (long JWT token)

### 1.3 Get Database Connection Strings

1. Go to **Project Settings** → **Database**
2. Scroll to **Connection string**
3. Select **Transaction** mode:
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password
   - This is your `DATABASE_URL`
4. Select **Session** mode:
   - Copy the connection string
   - Replace `[YOUR-PASSWORD]` with your database password
   - This is your `DIRECT_URL`

### 1.4 Run Database Migrations

1. Install Prisma CLI globally (if not already):
   ```bash
   npm install -g prisma
   ```

2. Set environment variables locally:
   ```bash
   export DATABASE_URL="your-transaction-mode-url"
   export DIRECT_URL="your-session-mode-url"
   ```

3. Run migrations:
   ```bash
   cd /path/to/second-brain-lite
   npx prisma migrate deploy
   ```

4. Verify tables created:
   - Go to Supabase Dashboard → **Table Editor**
   - You should see: `Note`, `Edge`, `UserSubscription`

### 1.5 Enable Row Level Security (RLS)

Run this SQL in Supabase **SQL Editor**:

```sql
-- Enable RLS on all tables
ALTER TABLE "Note" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Edge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSubscription" ENABLE ROW LEVEL SECURITY;

-- Notes: Users can only access their own notes
CREATE POLICY "Users can view own notes"
  ON "Note" FOR SELECT
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can insert own notes"
  ON "Note" FOR INSERT
  WITH CHECK (auth.uid()::text = "userId");

CREATE POLICY "Users can update own notes"
  ON "Note" FOR UPDATE
  USING (auth.uid()::text = "userId");

CREATE POLICY "Users can delete own notes"
  ON "Note" FOR DELETE
  USING (auth.uid()::text = "userId");

-- Edges: Users can access edges for their notes
CREATE POLICY "Users can view edges for own notes"
  ON "Edge" FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM "Note"
      WHERE "Note"."id" = "Edge"."sourceId"
      AND "Note"."userId" = auth.uid()::text
    )
  );

-- UserSubscription: Users can view own subscription
CREATE POLICY "Users can view own subscription"
  ON "UserSubscription" FOR SELECT
  USING (auth.uid()::text = "userId");
```

### 1.6 Configure Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider (enabled by default)
3. Optional: Enable **Google**, **GitHub**, etc.
4. Go to **Authentication** → **URL Configuration**
5. Add your production URL to **Site URL** (will add after Vercel deployment)

---

## Step 2: Get Google AI API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Click **"Create API Key"**
3. Select **"Create API key in new project"** or use existing
4. Copy the API key (starts with `AIzaSy...`)
5. **Important**: Keep this key secret!

---

## Step 3: Vercel Deployment

### 3.1 Push Code to GitHub

If not already done:

```bash
cd /path/to/second-brain-lite
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/second-brain-lite.git
git push -u origin main
```

### 3.2 Import Project to Vercel

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Configure project:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./`
   - **Build Command**: `prisma generate && next build` (auto-configured)
   - **Install Command**: `npm install` (auto-configured)

### 3.3 Add Environment Variables

In Vercel project settings, add these environment variables:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Database (from Step 1.3)
DATABASE_URL=postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Google AI
GOOGLE_AI_API_KEY=AIzaSy...

# Admin (optional, for manual subscription management)
ADMIN_SECRET_KEY=your-super-secret-admin-key-change-this
```

**Important**: 
- Click **"Add"** for each variable
- Select **"Production"**, **"Preview"**, and **"Development"** for all

### 3.4 Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for build
3. Once deployed, you'll get a URL: `https://your-app.vercel.app`

---

## Step 4: Post-Deployment Configuration

### 4.1 Update Supabase Site URL

1. Go to Supabase Dashboard → **Authentication** → **URL Configuration**
2. Set **Site URL** to: `https://your-app.vercel.app`
3. Add **Redirect URLs**:
   - `https://your-app.vercel.app/auth/callback`
   - `http://localhost:3000/auth/callback` (for local dev)

### 4.2 Test Authentication

1. Visit `https://your-app.vercel.app`
2. Click **"Get Started"** or **"Sign In"**
3. Create a test account
4. Verify email (check spam folder)
5. Log in successfully

### 4.3 Create First Note

1. After login, you should see the app interface
2. Type a note in the input area
3. Click **"Add Note"**
4. Note should appear in the graph

### 4.4 Verify Database

1. Go to Supabase Dashboard → **Table Editor**
2. Check **Note** table - should have your test note
3. Check **UserSubscription** table - should have your user

---

## Step 5: Optional Configurations

### 5.1 Custom Domain

1. In Vercel project → **Settings** → **Domains**
2. Add your custom domain
3. Follow DNS configuration instructions
4. Update Supabase **Site URL** to your custom domain

### 5.2 Analytics

Add Vercel Analytics:
```bash
npm install @vercel/analytics
```

In `src/app/layout.tsx`:
```typescript
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

### 5.3 Email Templates

Customize Supabase email templates:
1. Go to **Authentication** → **Email Templates**
2. Customize **Confirm signup**, **Magic Link**, etc.
3. Add your branding

---

## Troubleshooting

### Build Fails on Vercel

**Error**: `Prisma Client not generated`

**Solution**: Ensure `postinstall` script in `package.json`:
```json
{
  "scripts": {
    "postinstall": "prisma generate"
  }
}
```

### Database Connection Error

**Error**: `Can't reach database server`

**Solution**:
- Verify `DATABASE_URL` and `DIRECT_URL` are correct
- Check Supabase project is active (not paused)
- Ensure password is correct (no special characters issues)

### Authentication Not Working

**Error**: `Invalid redirect URL`

**Solution**:
- Add your Vercel URL to Supabase **Redirect URLs**
- Ensure **Site URL** matches your deployment URL

### AI Features Not Working

**Error**: `AI processing failed`

**Solution**:
- Verify `GOOGLE_AI_API_KEY` is set correctly
- Check API key has not exceeded quota
- Ensure user has premium subscription (AI enabled)

### Notes Not Appearing

**Error**: Notes created but not visible

**Solution**:
- Check RLS policies are correctly set
- Verify user is authenticated
- Check browser console for errors

---

## Monitoring

### Vercel Logs

View real-time logs:
1. Vercel Dashboard → Your Project → **Logs**
2. Filter by **Function**, **Static**, **Edge**

### Supabase Logs

View database logs:
1. Supabase Dashboard → **Logs**
2. Select **Postgres Logs**, **API Logs**, etc.

### Error Tracking

Consider adding Sentry:
```bash
npm install @sentry/nextjs
npx @sentry/wizard@latest -i nextjs
```

---

## Scaling Considerations

### Free Tier Limits

**Vercel**:
- 100 GB bandwidth/month
- 100 hours serverless function execution

**Supabase**:
- 500 MB database
- 2 GB bandwidth
- 50,000 monthly active users

### Upgrade Path

When you need to scale:
1. **Vercel Pro** ($20/month): More bandwidth, faster builds
2. **Supabase Pro** ($25/month): More database, better performance
3. **Google AI**: Pay-as-you-go after free tier

---

## Backup Strategy

### Database Backups

Supabase provides automatic daily backups (Pro plan).

For free tier, manual backup:
```bash
# Export all data
npx prisma db pull
pg_dump $DATABASE_URL > backup.sql
```

### Code Backups

- GitHub automatically backs up your code
- Tag releases: `git tag v1.0.0 && git push --tags`

---

## Security Checklist

- [ ] Strong database password
- [ ] Secure `ADMIN_SECRET_KEY`
- [ ] RLS policies enabled
- [ ] Environment variables not in code
- [ ] HTTPS only (Vercel provides automatically)
- [ ] Regular dependency updates

---

## Next Steps

1. ✅ Deploy to production
2. 📧 Set up custom email templates
3. 🎨 Customize branding
4. 📊 Add analytics
5. 🔔 Set up monitoring alerts
6. 💳 Integrate payment (Stripe) for premium subscriptions

---

## Support

If you encounter issues:
1. Check [Vercel Documentation](https://vercel.com/docs)
2. Check [Supabase Documentation](https://supabase.com/docs)
3. Review application logs
4. Check GitHub Issues

---

**Deployment Complete!** 🎉

Your Second Brain Lite is now live at `https://your-app.vercel.app`
