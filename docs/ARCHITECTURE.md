# Architecture Decision Records (ADR)

Documentation of key architectural decisions made in Second Brain Lite.

---

## ADR-001: Technology Stack Selection

**Date**: 2025-12-17  
**Status**: Accepted

### Context

Need to choose a modern, scalable technology stack for a Personal Knowledge Management (PKM) application with AI features.

### Decision

**Frontend**:
- Next.js 16 (App Router)
- React 19
- TypeScript
- Tailwind CSS

**Backend**:
- Next.js API Routes
- Supabase (Auth + PostgreSQL)
- Prisma ORM

**AI**:
- Google Gemini 2.0 Flash

### Rationale

**Next.js**:
- Server-side rendering for better SEO
- API routes for backend logic
- File-based routing
- Excellent developer experience
- Vercel deployment optimization

**Supabase**:
- Managed PostgreSQL database
- Built-in authentication
- Row Level Security (RLS)
- Real-time capabilities (future use)
- Free tier sufficient for MVP

**Prisma**:
- Type-safe database queries
- Excellent TypeScript integration
- Migration management
- Better than raw SQL for maintainability

**Google Gemini**:
- Latest AI model (2.0 Flash)
- Competitive pricing
- Good performance
- JSON mode support

### Consequences

**Positive**:
- Fast development
- Type safety across stack
- Scalable architecture
- Low initial cost

**Negative**:
- Vendor lock-in (Supabase, Vercel)
- Learning curve for new developers
- Gemini API rate limits

---

## ADR-002: Database Schema Design

**Date**: 2025-12-17  
**Status**: Accepted

### Context

Need to design database schema for notes, connections, and user subscriptions.

### Decision

Three main tables:
1. **Note**: Stores all notes with AI-generated metadata
2. **Edge**: Stores connections between notes
3. **UserSubscription**: Stores subscription and usage data

### Schema

```prisma
model Note {
  id         String   @id @default(uuid())
  userId     String
  content    String
  type       String   // "text" or "url"
  url        String?
  title      String?
  summary    String?  // AI-generated
  topics     String?  // JSON array
  tags       String?  // JSON array (manual)
  embedding  String?  // JSON array (AI vectors)
  status     String   @default("ready")
  createdAt  DateTime @default(now())
}

model Edge {
  id          String  @id @default(uuid())
  sourceId    String
  targetId    String
  similarity  Float
  explanation String
  createdAt   DateTime @default(now())
  
  @@unique([sourceId, targetId])
}

model UserSubscription {
  id        String   @id @default(uuid())
  userId    String   @unique
  tier      String   @default("free")
  noteCount Int      @default(0)
  maxNotes  Int?     @default(25)
  aiEnabled Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Rationale

**Note Table**:
- Single table for all note types (text, URL)
- AI metadata stored as JSON for flexibility
- `status` field for async AI processing
- `userId` for multi-tenancy

**Edge Table**:
- Separate table for connections (graph structure)
- `similarity` score for ranking
- `explanation` for UI display
- Unique constraint prevents duplicates

**UserSubscription**:
- Tracks subscription tier and limits
- `noteCount` for efficient limit checking
- `aiEnabled` flag for feature gating

### Consequences

**Positive**:
- Flexible schema for future features
- Efficient queries with proper indexes
- Clear separation of concerns

**Negative**:
- JSON fields not queryable (topics, tags)
- Need to parse JSON in application code
- Embedding storage could be large

### Alternatives Considered

**Separate tables for text/URL notes**: Rejected - adds complexity  
**NoSQL database**: Rejected - need ACID transactions  
**Separate metadata table**: Rejected - over-normalization

---

## ADR-003: AI Integration Approach

**Date**: 2025-12-17  
**Status**: Accepted

### Context

Need to integrate AI for note analysis and connection discovery.

### Decision

**Async Processing Model**:
1. Note created with `status: "processing"`
2. Background job analyzes note
3. Status updated to `ready` or `error`

**AI Functions**:
- `analyzeNote()`: Extract summary, topics, title
- `generateEmbedding()`: Create vector embeddings
- `explainConnection()`: Explain note relationships

### Implementation

```typescript
// Timeout wrapper for all AI calls
const timeout = (ms: number) => new Promise((_, reject) =>
  setTimeout(() => reject(new Error('Timeout')), ms)
);

// Example: analyzeNote with 15s timeout
const result = await Promise.race([
  model.generateContent(prompt),
  timeout(15000)
]);
```

### Rationale

**Async Processing**:
- AI calls can be slow (2-10 seconds)
- Don't block user interface
- Better user experience

**Timeout Protection**:
- Prevent infinite hangs
- Graceful degradation
- User sees error, not loading forever

**Fallback Strategy**:
- If embedding fails, return empty array
- Similarity calculated from topics instead
- App remains functional without AI

### Consequences

**Positive**:
- Responsive UI
- Fault-tolerant
- Scalable (can move to queue later)

**Negative**:
- More complex state management
- Need to poll or use websockets for updates
- Harder to debug async issues

---

## ADR-004: Authentication Strategy

**Date**: 2025-12-17  
**Status**: Accepted

### Context

Need secure authentication with minimal implementation effort.

### Decision

Use Supabase Auth with:
- Email/password authentication
- JWT-based sessions
- Row Level Security (RLS) for data isolation

### Implementation

```typescript
// Server-side auth check
const auth = await requireAuth();
if (auth.response) return auth.response;

// Use auth.user.id for queries
const notes = await prisma.note.findMany({
  where: { userId: auth.user.id }
});
```

### Rationale

**Supabase Auth**:
- Battle-tested authentication
- Handles password hashing, sessions, tokens
- Email verification built-in
- Social auth ready (Google, GitHub, etc.)

**JWT Tokens**:
- Stateless authentication
- Works with serverless (Vercel)
- Can be verified without database call

**RLS Policies**:
- Database-level security
- Prevents data leaks even if app has bugs
- Multi-tenancy isolation

### Consequences

**Positive**:
- Secure by default
- No need to implement auth from scratch
- Scales automatically

**Negative**:
- Vendor lock-in to Supabase
- Limited customization
- Need to understand JWT/RLS concepts

---

## ADR-005: Freemium Model Implementation

**Date**: 2025-12-23  
**Status**: Accepted

### Context

Need to implement freemium business model with usage limits.

### Decision

**Tiers**:
- **Free**: 25 notes, no AI
- **Premium**: Unlimited notes, AI enabled

**Enforcement**:
- Check limits before note creation
- Increment counter after successful creation
- Admin API for manual upgrades

### Implementation

```typescript
// Check limit
const canCreate = await canCreateNote(userId);
if (!canCreate) {
  return NextResponse.json({
    error: "Note limit reached",
    code: "LIMIT_REACHED"
  }, { status: 402 });
}

// Create note
const note = await prisma.note.create({ ... });

// Increment counter
await incrementNoteCount(userId);
```

### Rationale

**Note Count Tracking**:
- Efficient limit checking (no COUNT query)
- Atomic increment operation
- Cached in UserSubscription table

**402 Status Code**:
- Semantic HTTP status for payment required
- Frontend can detect and show upgrade modal

**Admin API**:
- Manual subscription management
- Useful for customer support
- Testing premium features

### Consequences

**Positive**:
- Clear value proposition
- Easy to understand limits
- Scalable enforcement

**Negative**:
- No payment integration yet (TODO)
- Counter could drift if note deleted
- Need to handle edge cases (concurrent creates)

### Future Work

- Integrate Stripe for payments
- Add webhook for subscription events
- Implement usage analytics

---

## ADR-006: Search Implementation

**Date**: 2025-12-17  
**Status**: Accepted

### Context

Need powerful search with Turkish language support.

### Decision

**Multi-strategy Search**:
1. **Prefix matching** (2+ chars): Fast, simple
2. **Full-text search**: PostgreSQL `tsvector`
3. **Fuzzy search**: Trigram similarity
4. **Turkish normalization**: ş→s, ğ→g, etc.

### Implementation

```sql
-- Prefix match (primary)
WHERE title ILIKE 'query%' OR content ILIKE '%query%'

-- Full-text search (fallback)
WHERE search_vector @@ plainto_tsquery('english', 'query')

-- Fuzzy search (typo tolerance)
WHERE similarity(title, 'query') > 0.3
```

### Rationale

**Prefix Matching First**:
- Fastest for short queries
- Most intuitive for users
- Works well for instant search

**Turkish Normalization**:
- Critical for Turkish users
- Converts: ş→s, ğ→g, ı→i, etc.
- Improves search recall

**Fuzzy Search**:
- Handles typos
- Better user experience
- Uses PostgreSQL pg_trgm extension

### Consequences

**Positive**:
- Fast search (< 100ms)
- Works for Turkish and English
- Typo-tolerant

**Negative**:
- Complex query logic
- Multiple database round-trips
- Requires PostgreSQL extensions

---

## ADR-007: Graph Visualization

**Date**: 2025-12-17  
**Status**: Accepted

### Context

Need to visualize note connections as an interactive graph.

### Decision

Use `react-force-graph-2d` library with:
- Force-directed layout
- Node size based on connection count
- Click to view note details

### Rationale

**react-force-graph-2d**:
- Built on D3.js (industry standard)
- Good performance (< 1000 nodes)
- Interactive out of the box
- Customizable styling

**Force-Directed Layout**:
- Automatic positioning
- Related notes cluster together
- Visually appealing

**Node Sizing**:
- Larger nodes = more connections
- Visual hierarchy
- Easy to spot important notes

### Consequences

**Positive**:
- Beautiful visualization
- Intuitive interaction
- Low implementation effort

**Negative**:
- Performance degrades with many nodes
- Not accessible (screen readers)
- Large bundle size (~100KB)

### Future Improvements

- Add 3D mode option
- Implement clustering for large graphs
- Add zoom/pan controls

---

## Summary

These ADRs document the key architectural decisions that shaped Second Brain Lite. They provide context for future developers and serve as a reference for understanding why certain choices were made.

### Key Principles

1. **Developer Experience**: Choose tools that are productive
2. **Type Safety**: TypeScript everywhere
3. **Scalability**: Design for growth
4. **User Experience**: Fast, intuitive, beautiful
5. **Cost Efficiency**: Optimize for free tier limits

### Technology Choices

| Layer | Technology | Reason |
|-------|-----------|--------|
| Frontend | Next.js + React | SSR, great DX |
| Backend | Next.js API Routes | Serverless, scalable |
| Database | Supabase PostgreSQL | Managed, free tier |
| ORM | Prisma | Type-safe, migrations |
| Auth | Supabase Auth | Secure, easy |
| AI | Google Gemini | Latest, affordable |
| Deployment | Vercel | Optimized for Next.js |

---

**Last Updated**: 2025-12-23
