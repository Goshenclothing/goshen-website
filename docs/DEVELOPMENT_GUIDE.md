# Goshen Website - Development Guide

## Environment Setup

### Required Environment Variables
Create `.env.local` in project root:
```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://sgdiyydubjaiedosqjko.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_DpUjlSCHp6UhusFXn4cH5Q_kCxM8bDa

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=Mawuo247@gmail.com

# Optional
# NEXT_PUBLIC_GEMINI_API_KEY=your_key_here
```

## Installation & Running

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Run linter
npm lint
```

## Key Architecture Notes

### Authentication Flow
1. User signs in via Supabase Auth
2. 2FA verification required on `/auth/2fa`
3. After 2FA, users can access `/account` routes
4. Admin users (verified via NEXT_PUBLIC_ADMIN_EMAIL) can access `/admin` routes

### Protected Routes
- `/account/*` - Requires authentication + 2FA verification
- `/admin/*` - Requires admin role + matching admin email
- `/auth/*` - Special handling for 2FA and password reset

### State Management
- **Authentication:** `src/context/UserAuthContext.tsx`
- **Cart:** `src/context/CartContext.tsx`
- **Admin Mode:** `src/context/AdminContext.tsx`

## Important Security Reminders

### DO NOT
- ❌ Hardcode secrets or API keys in code
- ❌ Skip validation on file uploads
- ❌ Remove null checks on async user data
- ❌ Use non-null assertions (`!`) without runtime checks
- ❌ Commit `.env.local` to git

### DO
- ✅ Use environment variables for all secrets
- ✅ Validate file uploads (size, type, dimensions)
- ✅ Always check for null/undefined user data
- ✅ Add error handling for localStorage operations
- ✅ Test 2FA flow after any auth changes

## Testing Checklist

Before pushing to production:

```
Authentication
- [ ] Sign up flow works
- [ ] 2FA code delivery and verification works
- [ ] Sign out clears 2FA status
- [ ] Protected routes redirect unauthenticated users
- [ ] Admin routes only accessible to admin email

Profile
- [ ] User can update profile data
- [ ] Changes persist across sessions
- [ ] Profile pictures upload correctly
- [ ] File size limits enforced

Admin
- [ ] Only designated admin email can login
- [ ] Admin can manage products/collections
- [ ] Admin chat with AI works
- [ ] Data changes save to database

Security
- [ ] 2FA cannot be bypassed
- [ ] Large files are rejected
- [ ] Corrupted cart data doesn't crash app
- [ ] Env variables are properly set
```

## File Upload Validation

**Current Limits:**
- Maximum file size: 5MB
- Allowed formats: JPEG, PNG, WebP, GIF

To change, update `src/components/Chatbot.tsx`:
```typescript
const maxSize = 5 * 1024 * 1024; // Change to desired bytes
const allowedTypes = ['image/jpeg', 'image/png']; // Add/remove types
```

## Common Issues & Solutions

### "Supabase credentials missing" Error
- Ensure `.env.local` is created with correct values
- File must be in project root `/workspaces/goshen-website/`
- Restart dev server after creating env file

### 2FA Not Working
- Check Supabase `two_factor` table exists
- Verify email service is configured
- Check `/api/auth/2fa/send` and `/api/auth/2fa/verify` routes

### Cart Data Lost
- Check browser's localStorage is enabled
- Look for corruption errors in console
- App automatically clears corrupted data and logs errors

### Admin Access Denied
- Verify email matches `NEXT_PUBLIC_ADMIN_EMAIL`
- Check user has `admin` role in Supabase auth metadata
- Middleware logs unauthorized attempts to console

## Performance Tips

1. **Images**: Use Next.js Image component with explicit dimensions
2. **Forms**: Debounce search/filter inputs to reduce API calls
3. **State**: Use useCallback to prevent unnecessary re-renders
4. **Fetch**: Consider adding request cancellation (AbortController)

## Resources

- [Supabase Docs](https://supabase.com/docs)
- [Next.js 16 Docs](https://nextjs.org/docs)
- [TypeScript Best Practices](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)

---

**Last Updated:** 2026-01-23  
**Status:** Production Ready
