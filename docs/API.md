# API Documentation

Complete API reference for WhichNotes backend endpoints.

## Base URL

- **Development**: `http://localhost:3000`
- **Production**: `https://your-app.vercel.app`

## Authentication

All API endpoints (except public routes) require authentication via Supabase JWT.

**Headers**:
```
Authorization: Bearer <supabase-jwt-token>
```

Authentication is handled automatically by Supabase client in the frontend.

---

## Notes API

### Create Note

Create a new text or URL note.

**Endpoint**: `POST /api/notes`

**Request Body**:
```json
{
  "content": "Note content here",
  "type": "text"  // or "url"
}
```

For URL notes:
```json
{
  "content": "Optional description",
  "type": "url",
  "url": "https://example.com"
}
```

**Response** (201 Created):
```json
{
  "id": "note-uuid",
  "userId": "user-uuid",
  "content": "Note content",
  "type": "text",
  "url": null,
  "title": "New Note",
  "summary": null,
  "topics": null,
  "tags": null,
  "embedding": null,
  "status": "processing",  // or "ready" for free users
  "createdAt": "2025-12-23T12:00:00.000Z"
}
```

**Error Responses**:
- `400 Bad Request`: Invalid content or URL
- `401 Unauthorized`: Not authenticated
- `402 Payment Required`: Note limit reached (free tier)
- `429 Too Many Requests`: Rate limit exceeded
- `500 Internal Server Error`: Server error

**Rate Limit**: 10 requests per minute

---

## Graph API

### Get Graph Data

Retrieve all notes and connections for the authenticated user.

**Endpoint**: `GET /api/graph`

**Response** (200 OK):
```json
{
  "nodes": [
    {
      "id": "note-uuid",
      "title": "Note Title",
      "summary": "Note summary",
      "type": "text",
      "url": null,
      "content": "Full content",
      "status": "ready",
      "tags": "[\"tag1\", \"tag2\"]",
      "val": 3  // Node size based on connection count
    }
  ],
  "links": [
    {
      "id": "edge-uuid",
      "source": "note-uuid-1",
      "target": "note-uuid-2",
      "similarity": 0.85,
      "explanation": "Both discuss AI technology"
    }
  ]
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

---

## Search API

### Search Notes

Search notes with full-text search, tag filtering, and Turkish character support.

**Endpoint**: `GET /api/search`

**Query Parameters**:
- `q` (required): Search query (min 2 characters)
- `tag` (optional): Filter by tag
- `status` (optional): Filter by status (`ready`, `processing`, `error`)
- `type` (optional): Filter by type (`text`, `url`)

**Examples**:
```
GET /api/search?q=artificial intelligence
GET /api/search?q=#important
GET /api/search?q=test&status=ready&type=text
```

**Response** (200 OK):
```json
{
  "results": [
    {
      "id": "note-uuid",
      "title": "AI Research",
      "summary": "Summary of AI research",
      "status": "ready",
      "type": "text",
      "rank": 1.0,
      "snippet": "Highlighted <mark>search</mark> result"
    }
  ],
  "query": "search term",
  "isTagSearch": false,
  "filters": {
    "tag": null,
    "status": "ready",
    "type": null
  },
  "count": 1
}
```

**Features**:
- Full-text search with PostgreSQL
- Prefix matching (starts with query)
- Turkish character normalization (ş→s, ğ→g, etc.)
- Tag search with `#` prefix
- Fuzzy search for typo tolerance
- Relevance ranking

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

---

## Subscription API

### Get Current Subscription

Get subscription details for the authenticated user.

**Endpoint**: `GET /api/subscription`

**Response** (200 OK):
```json
{
  "id": "sub-uuid",
  "userId": "user-uuid",
  "tier": "free",  // or "premium"
  "noteCount": 15,
  "maxNotes": 25,  // null for unlimited (premium)
  "aiEnabled": false,
  "createdAt": "2025-12-23T12:00:00.000Z",
  "updatedAt": "2025-12-23T12:00:00.000Z"
}
```

### Upgrade to Premium

Upgrade user to premium tier.

**Endpoint**: `POST /api/subscription`

**Response** (200 OK):
```json
{
  "subscription": {
    "userId": "user-uuid",
    "tier": "premium",
    "maxNotes": null,
    "aiEnabled": true
  },
  "message": "Successfully upgraded to Premium!"
}
```

> **Note**: Payment integration is not yet implemented. This is a placeholder endpoint.

### Downgrade to Free

Downgrade user to free tier.

**Endpoint**: `DELETE /api/subscription`

**Response** (200 OK):
```json
{
  "subscription": {
    "userId": "user-uuid",
    "tier": "free",
    "maxNotes": 25,
    "aiEnabled": false
  },
  "message": "Downgraded to Free tier"
}
```

**Error Responses**:
- `401 Unauthorized`: Not authenticated
- `500 Internal Server Error`: Server error

---

## Admin API

### Admin Subscription Management

Manage user subscriptions (admin only).

**Endpoint**: `POST /api/admin/subscription`

**Headers**:
```
Authorization: Bearer <ADMIN_SECRET_KEY>
```

**Request Body**:
```json
{
  "userId": "user-uuid",
  "action": "upgrade"  // or "downgrade"
}
```

**Response** (200 OK):
```json
{
  "success": true,
  "message": "User user-uuid upgraded to premium",
  "subscription": {
    "userId": "user-uuid",
    "tier": "premium",
    "maxNotes": null,
    "aiEnabled": true
  }
}
```

### Check User Subscription (Admin)

Get subscription for any user.

**Endpoint**: `GET /api/admin/subscription?userId=<user-uuid>`

**Headers**:
```
Authorization: Bearer <ADMIN_SECRET_KEY>
```

**Response** (200 OK):
```json
{
  "id": "sub-uuid",
  "userId": "user-uuid",
  "tier": "premium",
  "noteCount": 50,
  "maxNotes": null,
  "aiEnabled": true
}
```

**Error Responses**:
- `400 Bad Request`: Missing userId or invalid action
- `401 Unauthorized`: Invalid or missing admin key
- `500 Internal Server Error`: Server error

**Security**: Admin key must be set in environment variable `ADMIN_SECRET_KEY`.

---

## Export/Import API

### Export Notes

Export all user notes as JSON.

**Endpoint**: `GET /api/export`

**Response** (200 OK):
```json
{
  "notes": [
    {
      "id": "note-uuid",
      "content": "Note content",
      "title": "Note Title",
      "type": "text",
      "createdAt": "2025-12-23T12:00:00.000Z"
    }
  ],
  "exportedAt": "2025-12-23T12:00:00.000Z",
  "version": "1.0"
}
```

### Import Notes

Import notes from JSON file.

**Endpoint**: `POST /api/import`

**Request Body**:
```json
{
  "notes": [
    {
      "content": "Imported note",
      "title": "Imported Title",
      "type": "text"
    }
  ]
}
```

**Response** (200 OK):
```json
{
  "imported": 5,
  "failed": 0,
  "message": "Successfully imported 5 notes"
}
```

---

## Tags API

### Get All Tags

Get list of all tags used by the user.

**Endpoint**: `GET /api/tags`

**Response** (200 OK):
```json
{
  "tags": ["important", "research", "todo"]
}
```

---

## Error Codes

| Code | Description |
|------|-------------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Authentication required |
| 402 | Payment Required - Subscription limit reached |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error - Server error |

## Error Response Format

```json
{
  "error": "User-friendly error message",
  "code": "ERROR_CODE",
  "details": "Technical details (development only)"
}
```

---

## Rate Limiting

- **Notes API**: 10 requests/minute
- **Search API**: 30 requests/minute
- **Other APIs**: 60 requests/minute

Rate limit headers:
```
X-RateLimit-Limit: 10
X-RateLimit-Remaining: 5
X-RateLimit-Reset: 1640000000
```

---

## Webhooks (Future)

Webhook support for subscription events (planned):
- `subscription.upgraded`
- `subscription.downgraded`
- `note.limit.reached`

---

## SDK Examples

### JavaScript/TypeScript

```typescript
// Create note
const response = await fetch('/api/notes', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    content: 'My note',
    type: 'text'
  })
});

const note = await response.json();
```

### cURL

```bash
# Create note
curl -X POST https://your-app.vercel.app/api/notes \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"content":"My note","type":"text"}'

# Search notes
curl "https://your-app.vercel.app/api/search?q=test" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## Changelog

### v1.0.0 (Current)
- Initial API release
- Notes CRUD operations
- Graph visualization
- Full-text search
- Subscription management
- Admin endpoints
