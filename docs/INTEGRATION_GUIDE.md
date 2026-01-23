# Frontend-Backend Integration Guide

This document explains how the Goshen Clothing site communicates between frontend and backend, and how to ensure everything works smoothly.

## Architecture Overview

The application uses:
- **Frontend**: Next.js 16 (React 19) for the UI
- **Backend**: Next.js API Routes for server-side logic
- **Database**: Supabase (PostgreSQL) for data storage
- **AI**: Google Gemini API for chatbot functionality

## API Communication Flow

### 1. Chat API (`/api/chat`)
**Purpose**: Handle AI-powered chatbot conversations  
**Frontend Component**: `Chatbot.tsx`

```
User Input → Chatbot Component → apiPost('/api/chat') → Gemini API → Response
```

**Requirements**:
- `GEMINI_API_KEY` environment variable must be set
- Message array with proper format
- Optional image data support

**Error Handling**:
- Timeouts (>30s) → 504 status with retry message
- Missing API key → 503 with service unavailable message
- Invalid request → 400 with validation error

### 2. Database Queries (Supabase)
**Purpose**: Fetch products, collections, and user data  
**Frontend Components**: `Products.tsx`, `Collections.tsx`, `ProductManager.tsx`

```
Component → supabase.from('table').select() → Database → Formatted Response
```

**Requirements**:
- `NEXT_PUBLIC_SUPABASE_URL` environment variable
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` environment variable
- Proper table permissions in Supabase

**Tables**:
- `products` - Product catalog
- `collections` - Product collections
- `two_factor` - 2FA verification status
- `users` - User authentication data

### 3. Authentication
**Purpose**: User login, signup, and session management  
**Frontend Context**: `UserAuthContext.tsx`

```
User Credentials → Auth Component → Supabase Auth → JWT Token → Protected Routes
```

**Flow**:
1. User submits credentials
2. Supabase authenticates via OAuth/email
3. Session stored in browser cookies (via middleware)
4. Protected routes check session validity

## Environment Variables Setup

### Required for Full Functionality
```bash
# Supabase Configuration (Database & Auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Google Gemini (AI Chat)
GEMINI_API_KEY=AIzaSyD...

# Node Environment
NODE_ENV=production
```

### Optional
```bash
# Admin Email (for special access)
ADMIN_EMAIL=admin@example.com
```

## Network Request Flow

### Successful Request
```
1. Component calls apiPost() or Supabase query
2. Request sent to server (with automatic JSON serialization)
3. Server processes and validates
4. Response returned with data
5. Component updates state
6. UI re-renders
```

### Failed Request with Retry
```
1. Component calls apiPost()
2. Network timeout or 5xx error
3. Auto-retry with exponential backoff (1s, 2s, 3s)
4. After 3 retries, return error
5. Component shows user-friendly error message
```

## Error Handling Best Practices

### In API Routes
```typescript
// ✅ DO: Proper error handling
try {
    if (!process.env.API_KEY) {
        return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }
    // ... operation
} catch (error) {
    console.error('[Service]', error);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
}

// ❌ DON'T: Expose internal errors
return NextResponse.json({ error: error.message }, { status: 500 });
```

### In Components
```typescript
// ✅ DO: Use apiClient for consistent handling
const response = await apiPost('/api/chat', data);
if (response.error) {
    setErrorMessage(response.error);
    return;
}
setMessage(response.data.text);

// ❌ DON'T: Raw fetch without error handling
const res = await fetch('/api/chat', { method: 'POST', body });
const data = await res.json();
setMessage(data.text); // Could fail if error
```

## Performance Optimization

### 1. Request Timeout Management
- Chat API: 30 second timeout
- Database queries: 15 second timeout
- File uploads: 60 second timeout

### 2. Caching Strategy
- Products/Collections: Cached in component state
- User session: Cached in browser context
- Cart data: Persisted to localStorage

### 3. Request Batching
```typescript
// ✅ Fetch related data in parallel
const [collections, products] = await Promise.all([
    supabase.from('collections').select(),
    supabase.from('products').select()
]);

// ❌ Sequential requests (slower)
const collections = await supabase.from('collections').select();
const products = await supabase.from('products').select();
```

## Monitoring & Debugging

### Enable Debug Logging
In `src/lib/apiClient.ts`, development mode logs:
```
[API] GET /api/chat → 200
[API] POST /api/products → Error: Network timeout (attempt 2)
```

### Common Issues & Solutions

| Issue | Symptom | Solution |
|-------|---------|----------|
| Missing API Key | Chat says "unavailable" | Check `GEMINI_API_KEY` in env |
| DB Connection Fail | Products don't load | Verify Supabase credentials |
| CORS Error | "blocked by CORS" | Routes must be under `/api/` |
| Timeout | "Request took too long" | Increase `timeout` option in apiRequest |
| Auth Token Expired | Redirected to login | Session refreshes automatically |

## Testing the Integration

### 1. Test Chat API
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "text": "Hello"}],
    "imageData": null
  }'
```

### 2. Test Database Connection
Open browser DevTools → Network tab, go to Products page, check:
- Collections load successfully
- No 500 errors in network tab
- Response times < 2 seconds

### 3. Test Authentication
```bash
# Check session is stored
localStorage.getItem('supabase.auth.token')

# Verify middleware is running
curl -i http://localhost:3000
# Should have Set-Cookie headers
```

## Production Deployment Checklist

- [ ] All environment variables configured in hosting platform
- [ ] Supabase RLS policies enable public read access
- [ ] API rate limiting configured (if needed)
- [ ] Error logging service connected (Sentry, etc.)
- [ ] Database backups enabled
- [ ] CORS headers properly set
- [ ] SSL certificates valid
- [ ] Monitoring alerts set up

## Related Files

- API Client: `src/lib/apiClient.ts`
- Environment Config: `src/lib/envConfig.ts`
- Chat Component: `src/components/Chatbot.tsx`
- Product Manager: `src/components/ProductManager.tsx`
- Chat Route: `src/app/api/chat/route.ts`
- User Context: `src/context/UserAuthContext.tsx`
