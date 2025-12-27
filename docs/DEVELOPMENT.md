# Development Setup Guide

Complete guide for setting up WhichNotes for local development.

## Prerequisites

### Required Software

- **Node.js** 20.x or higher ([Download](https://nodejs.org/))
- **npm** 10.x or higher (comes with Node.js)
- **Git** ([Download](https://git-scm.com/))
- **VS Code** (recommended) ([Download](https://code.visualstudio.com/))

### Required Accounts

- **Supabase** account (free tier) - [Sign up](https://supabase.com)
- **Google AI** API key - [Get key](https://aistudio.google.com/app/apikey)

### Verify Installation

```bash
node --version  # Should be v20.x.x or higher
npm --version   # Should be 10.x.x or higher
git --version   # Should be 2.x.x or higher
```

---

## Step 1: Clone Repository

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/whichnotes.git

# Navigate to project directory
cd whichnotes

# Verify files
ls -la
```

You should see:
- `src/` - Source code
- `docs/` - Documentation
- `package.json` - Dependencies
- `prisma/` - Database schema
- `.env.example` - Environment template

---

## Step 2: Install Dependencies

```bash
# Install all dependencies
npm install

# This will:
# - Install Node.js packages
# - Run postinstall script (prisma generate)
# - Take 1-2 minutes
```

**Troubleshooting**:
- If `npm install` fails, try: `rm -rf node_modules package-lock.json && npm install`
- On Windows, use PowerShell or Git Bash

---

## Step 3: Set Up Supabase

### 3.1 Create Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click **"New Project"**
3. Fill in:
   - **Name**: `second-brain-dev` (or your choice)
   - **Database Password**: Generate strong password (save it!)
   - **Region**: Choose closest to you
4. Click **"Create new project"**
5. Wait 2-3 minutes

### 3.2 Get Credentials

1. Go to **Project Settings** → **API**
2. Copy:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`

3. Go to **Project Settings** → **Database**
4. Copy **Connection string** (Transaction mode):
   - Replace `[YOUR-PASSWORD]` with your database password
   - This is your `DATABASE_URL`
5. Copy **Connection string** (Session mode):
   - Replace `[YOUR-PASSWORD]` with your database password
   - This is your `DIRECT_URL`

---

## Step 4: Configure Environment Variables

### 4.1 Create .env File

```bash
# Copy example file
cp env.example .env

# Open in editor
code .env  # or nano .env
```

### 4.2 Fill in Values

Edit `.env` with your credentials:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Database Connection
DATABASE_URL=postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgres://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres

# Google AI API Key
GOOGLE_AI_API_KEY=AIzaSy...

# Admin Secret (for testing admin features)
ADMIN_SECRET_KEY=local-dev-admin-key-123
```

**Important**: Never commit `.env` to Git (it's in `.gitignore`)

---

## Step 5: Set Up Database

### 5.1 Run Migrations

```bash
# Apply all migrations to your Supabase database
npx prisma migrate deploy
```

You should see:
```
✔ Applying migration `20251217170145_add_status_field`
✔ Applying migration `20251217170627_unique_edges`
✔ Applying migration `20251217172650_index_status`
✔ Applying migration `20251223130105_add_user_subscription`
✔ Applying migration `20251223135737_add_tier_enum`
```

### 5.2 Verify Tables

1. Go to Supabase Dashboard → **Table Editor**
2. You should see:
   - `Note` - Stores notes
   - `Edge` - Stores connections
   - `UserSubscription` - Stores user subscriptions

### 5.3 Enable Row Level Security (Optional for Dev)

For production-like security in dev, run this SQL in Supabase **SQL Editor**:

```sql
-- Enable RLS
ALTER TABLE "Note" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "Edge" ENABLE ROW LEVEL SECURITY;
ALTER TABLE "UserSubscription" ENABLE ROW LEVEL SECURITY;

-- Allow all for development (authenticated users only)
CREATE POLICY "Dev: Allow all for authenticated users"
  ON "Note" FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Dev: Allow all edges for authenticated users"
  ON "Edge" FOR ALL
  USING (auth.role() = 'authenticated');

CREATE POLICY "Dev: Allow all subscriptions for authenticated users"
  ON "UserSubscription" FOR ALL
  USING (auth.role() = 'authenticated');
```

---

## Step 6: Run Development Server

```bash
# Start development server
npm run dev
```

You should see:
```
▲ Next.js 16.0.10
- Local:        http://localhost:3000
- Network:      http://192.168.1.x:3000

✓ Ready in 2.5s
```

**Open browser**: [http://localhost:3000](http://localhost:3000)

---

## Step 7: Create Test Account

1. Click **"Get Started"** or **"Sign In"**
2. Click **"Sign Up"**
3. Enter:
   - **Email**: `test@example.com` (or your email)
   - **Password**: Strong password
4. Click **"Sign Up"**
5. Check email for confirmation link
6. Click confirmation link
7. Log in

---

## Step 8: Test Features

### 8.1 Create a Note

1. In the input area, type: `My first test note`
2. Click **"Add Note"**
3. Note should appear in the graph

### 8.2 Test Search

1. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
2. Type: `test`
3. Your note should appear in results

### 8.3 Test AI Features (Premium Only)

1. Upgrade to premium (for testing):
   ```bash
   # In another terminal
   ./scripts/manage-premium.sh upgrade test@example.com
   ```

2. Create a new note - it should show "Processing" status
3. Wait a few seconds - AI should analyze it

---

## Development Workflow

### File Structure

```
whichnotes/
├── src/
│   ├── app/              # Next.js app router
│   │   ├── api/          # API routes
│   │   ├── app/          # Main app page
│   │   ├── auth/         # Auth pages
│   │   └── layout.tsx    # Root layout
│   ├── components/       # React components
│   ├── contexts/         # React contexts
│   ├── lib/              # Utilities and helpers
│   └── types/            # TypeScript types
├── prisma/
│   ├── schema.prisma     # Database schema
│   └── migrations/       # Database migrations
├── e2e/                  # E2E tests (Playwright)
├── docs/                 # Documentation
└── public/               # Static files
```

### Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes** to code

3. **Test changes**:
   ```bash
   npm run dev  # Manual testing
   npm test     # Run unit tests
   ```

4. **Commit changes**:
   ```bash
   git add .
   git commit -m "feat: add my feature"
   ```

5. **Push to GitHub**:
   ```bash
   git push origin feature/my-feature
   ```

### Database Changes

When modifying `prisma/schema.prisma`:

```bash
# Create a new migration
npx prisma migrate dev --name my_migration_name

# This will:
# 1. Create migration file
# 2. Apply to database
# 3. Regenerate Prisma Client

# Restart dev server
npm run dev
```

### Adding Dependencies

```bash
# Install a package
npm install package-name

# Install dev dependency
npm install --save-dev package-name

# Update package.json and commit
git add package.json package-lock.json
git commit -m "chore: add package-name"
```

---

## Testing

### Run Unit Tests

```bash
# Run all tests
npm test

# Run in watch mode
npm run test:watch

# Run with coverage
npm run test:coverage
```

### Run E2E Tests

```bash
# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run with UI
npm run test:e2e:ui
```

### Run All Tests

```bash
npm run test:all
```

---

## Debugging

### VS Code Setup

Install recommended extensions:
- ESLint
- Prettier
- Prisma
- Tailwind CSS IntelliSense

Create `.vscode/launch.json`:
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev"
    }
  ]
}
```

### Debug API Routes

Add breakpoints in VS Code or use:
```typescript
console.log('Debug:', variable);
```

View logs in terminal where `npm run dev` is running.

### Debug Database Queries

Enable Prisma query logging in `src/lib/db.ts`:
```typescript
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

### View Database

```bash
# Open Prisma Studio
npx prisma studio
```

Browser opens at [http://localhost:5555](http://localhost:5555) with GUI for database.

---

## Common Issues

### Port 3000 Already in Use

```bash
# Find process using port 3000
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3001 npm run dev
```

### Prisma Client Not Generated

```bash
# Regenerate Prisma Client
npx prisma generate

# Restart dev server
npm run dev
```

### Database Connection Error

- Verify `.env` has correct `DATABASE_URL` and `DIRECT_URL`
- Check Supabase project is not paused
- Ensure password has no special characters that need escaping

### AI Features Not Working

- Verify `GOOGLE_AI_API_KEY` is set
- Check API key is valid
- Ensure user has premium subscription (AI enabled)

### Module Not Found

```bash
# Clear cache and reinstall
rm -rf node_modules .next
npm install
npm run dev
```

---

## Code Style

### ESLint

```bash
# Check for linting errors
npm run lint

# Auto-fix issues
npm run lint -- --fix
```

### Formatting

We use Prettier (recommended):
```bash
# Install Prettier
npm install --save-dev prettier

# Format all files
npx prettier --write .
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `test:` Tests
- `chore:` Maintenance

---

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `DATABASE_URL` | PostgreSQL connection (transaction mode) | Yes |
| `DIRECT_URL` | PostgreSQL connection (session mode) | Yes |
| `GOOGLE_AI_API_KEY` | Google Gemini API key | Yes |
| `ADMIN_SECRET_KEY` | Admin API secret | Optional |

---

## Next Steps

1. ✅ Set up development environment
2. 📖 Read [API Documentation](./API.md)
3. 🏗️ Read [Architecture Decisions](./ARCHITECTURE.md)
4. 🧪 Write tests for new features
5. 🚀 Deploy to production (see [Deployment Guide](./DEPLOYMENT.md))

---

## Getting Help

- 📚 Check [Documentation](./README.md)
- 🐛 Report bugs on GitHub Issues
- 💬 Ask questions in Discussions
- 📧 Contact maintainers

---

**Happy Coding!** 🎉
