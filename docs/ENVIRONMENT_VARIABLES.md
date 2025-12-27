# Environment Variables Guide

Complete reference for all environment variables used in WhichNotes.

## Required Variables

### Supabase Configuration

#### `NEXT_PUBLIC_SUPABASE_URL`
- **Type**: Public
- **Required**: Yes
- **Description**: Your Supabase project URL
- **Example**: `https://abcdefgh.supabase.co`
- **Where to find**: Supabase Dashboard → Project Settings → API → Project URL

#### `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- **Type**: Public
- **Required**: Yes
- **Description**: Supabase anonymous/public API key
- **Example**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
- **Where to find**: Supabase Dashboard → Project Settings → API → anon public

### Database Configuration

#### `DATABASE_URL`
- **Type**: Secret
- **Required**: Yes
- **Description**: PostgreSQL connection string (transaction mode with pgBouncer)
- **Format**: `postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true`
- **Usage**: Used by Prisma for migrations and connection pooling
- **Where to find**: Supabase Dashboard → Project Settings → Database → Connection string (Transaction mode)

#### `DIRECT_URL`
- **Type**: Secret
- **Required**: Yes
- **Description**: PostgreSQL connection string (session mode, direct connection)
- **Format**: `postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres`
- **Usage**: Used by Prisma Client for direct database access
- **Where to find**: Supabase Dashboard → Project Settings → Database → Connection string (Session mode)

### AI Configuration

#### `GOOGLE_AI_API_KEY`
- **Type**: Secret
- **Required**: Yes
- **Description**: Google Gemini API key for AI features
- **Example**: `AIzaSyA...`
- **Where to get**: [Google AI Studio](https://aistudio.google.com/app/apikey)
- **Free tier**: 60 requests/minute

### App Configuration

#### `NEXT_PUBLIC_APP_URL`
- **Type**: Public
- **Required**: Yes
- **Description**: Base URL of your application
- **Development**: `http://localhost:3000`
- **Production**: `https://your-app.vercel.app`
- **Usage**: Used for OAuth callbacks, email links, etc.

#### `NODE_ENV`
- **Type**: System
- **Required**: Auto-set by platform
- **Description**: Node environment
- **Values**: `development`, `production`, `test`
- **Note**: Automatically set by Vercel/Node.js

---

## Optional Variables

### Admin Configuration

#### `ADMIN_SECRET_KEY`
- **Type**: Secret
- **Required**: No (but recommended)
- **Description**: Secret key for admin API endpoints
- **Default**: None (admin endpoints disabled)
- **Generate**: `openssl rand -base64 32`
- **Usage**: Required for `/api/admin/*` endpoints
- **Security**: Must be strong and kept secret

### Error Tracking (Sentry)

#### `NEXT_PUBLIC_SENTRY_DSN`
- **Type**: Public
- **Required**: No
- **Description**: Sentry Data Source Name for error tracking
- **Example**: `https://abc123@o123456.ingest.sentry.io/123456`
- **Where to get**: [Sentry.io](https://sentry.io) → Project Settings → Client Keys (DSN)
- **Free tier**: 5,000 errors/month

#### `SENTRY_AUTH_TOKEN`
- **Type**: Secret
- **Required**: No (only for source maps upload)
- **Description**: Sentry authentication token
- **Where to get**: Sentry → Settings → Auth Tokens

#### `SENTRY_ORG`
- **Type**: Config
- **Required**: No
- **Description**: Your Sentry organization slug

#### `SENTRY_PROJECT`
- **Type**: Config
- **Required**: No
- **Description**: Your Sentry project slug

### Feature Flags

#### `NEXT_PUBLIC_ENABLE_AI`
- **Type**: Public
- **Required**: No
- **Description**: Enable/disable AI features
- **Default**: `true`
- **Values**: `true`, `false`
- **Usage**: For testing without AI API calls

#### `NEXT_PUBLIC_ENABLE_EXPORT`
- **Type**: Public
- **Required**: No
- **Description**: Enable/disable export functionality
- **Default**: `true`
- **Values**: `true`, `false`

---

## Environment-Specific Setup

### Local Development

Create `.env.local`:
```bash
# Copy from env.example
cp env.example .env.local

# Edit with your values
code .env.local
```

**Required for local dev**:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`
- `GOOGLE_AI_API_KEY`
- `NEXT_PUBLIC_APP_URL=http://localhost:3000`

### Vercel Deployment

Add environment variables in Vercel Dashboard:

1. Go to your project → Settings → Environment Variables
2. Add each variable
3. Select environments: Production, Preview, Development

**Important**: 
- Check "Encrypt" for secret variables
- Use different values for Production vs Preview

### Production Checklist

- [ ] All required variables set
- [ ] `ADMIN_SECRET_KEY` is strong and unique
- [ ] `NEXT_PUBLIC_APP_URL` points to production domain
- [ ] Database credentials are for production database
- [ ] Sentry DSN configured (recommended)
- [ ] All secrets are encrypted in Vercel

---

## Security Best Practices

### Secret Management

1. **Never commit secrets to Git**
   - `.env.local` is in `.gitignore`
   - Use `env.example` for templates only

2. **Rotate secrets regularly**
   - Change `ADMIN_SECRET_KEY` every 90 days
   - Rotate database passwords periodically

3. **Use strong secrets**
   ```bash
   # Generate strong random string
   openssl rand -base64 32
   ```

4. **Separate dev/prod secrets**
   - Never use production secrets in development
   - Use different Supabase projects for dev/prod

### Public vs Secret Variables

**Public** (`NEXT_PUBLIC_*`):
- Exposed to browser
- Can be seen in client-side code
- OK for non-sensitive config

**Secret** (no prefix):
- Only available server-side
- Never exposed to browser
- Must be kept confidential

---

## Troubleshooting

### "Missing environment variable" error

**Cause**: Required variable not set  
**Solution**: Check `.env.local` has all required variables

### "Invalid Supabase URL" error

**Cause**: Incorrect `NEXT_PUBLIC_SUPABASE_URL`  
**Solution**: Copy exact URL from Supabase dashboard

### "Database connection failed" error

**Cause**: Incorrect `DATABASE_URL` or `DIRECT_URL`  
**Solution**: 
1. Verify connection strings from Supabase
2. Ensure password is correct
3. Check if database is paused (free tier)

### AI features not working

**Cause**: Invalid or missing `GOOGLE_AI_API_KEY`  
**Solution**:
1. Verify API key from Google AI Studio
2. Check API quota not exceeded
3. Ensure key has Gemini API enabled

---

## Reference

### Variable Naming Convention

- `NEXT_PUBLIC_*`: Client-side accessible
- `*_URL`: URLs and endpoints
- `*_KEY`: API keys and secrets
- `*_TOKEN`: Authentication tokens

### Loading Order

1. `.env` (committed, defaults)
2. `.env.local` (local overrides, not committed)
3. `.env.production` (production only)
4. `.env.development` (development only)

### Vercel Specifics

Vercel automatically sets:
- `VERCEL=1`
- `VERCEL_ENV` (production/preview/development)
- `VERCEL_URL` (deployment URL)

---

## Quick Reference

| Variable | Type | Required | Default |
|----------|------|----------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | Public | Yes | - |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public | Yes | - |
| `DATABASE_URL` | Secret | Yes | - |
| `DIRECT_URL` | Secret | Yes | - |
| `GOOGLE_AI_API_KEY` | Secret | Yes | - |
| `NEXT_PUBLIC_APP_URL` | Public | Yes | - |
| `NODE_ENV` | System | Auto | - |
| `ADMIN_SECRET_KEY` | Secret | No | - |
| `NEXT_PUBLIC_SENTRY_DSN` | Public | No | - |
| `SENTRY_AUTH_TOKEN` | Secret | No | - |

---

For deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md)
