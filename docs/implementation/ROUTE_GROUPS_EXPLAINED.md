# Route Groups Explanation

## Important: Route Groups Don't Appear in URLs!

### What are Route Groups?
Route groups in Next.js use parentheses `(name)` to organize files without affecting the URL structure.

### File System vs URLs

**File System**:
```
app/
├── (auth)/              ← Route group (parentheses)
│   ├── layout.tsx       ← ClerkProvider here
│   ├── translate/
│   ├── sign-in/
│   └── sign-up/
```

**Actual URLs** (no parentheses):
```
http://localhost:3000/translate       ✅ Correct
http://localhost:3000/sign-in         ✅ Correct
http://localhost:3000/sign-up         ✅ Correct

http://localhost:3000/(auth)/translate  ❌ Wrong (404)
```

### Why Use Route Groups?

1. **Organization**: Group related routes together
2. **Shared Layouts**: Apply ClerkProvider only to auth routes
3. **Clean URLs**: Parentheses don't appear in URLs

### Correct Configuration

**Links** (no parentheses):
```tsx
<Link href="/translate">Start Experience</Link>
<Link href="/sign-in">Sign in</Link>
<Link href="/sign-up">Sign up</Link>
```

**Environment Variables** (no parentheses):
```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/translate
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/translate
```

**Middleware** (no parentheses):
```ts
const isProtectedRoute = createRouteMatcher([
  '/translate(.*)',
  '/sign-in(.*)',
  '/sign-up(.*)',
]);
```

### Benefits of Our Setup

✅ **Clerk only loads on auth routes** (files in `(auth)` folder)
✅ **Landing page has no Clerk** (outside `(auth)` folder)
✅ **Offline mode has no Clerk** (outside `(auth)` folder)
✅ **Clean URLs** (no `(auth)` in URLs)

### Testing

**Correct URLs**:
- http://localhost:3000/ (landing)
- http://localhost:3000/translate (auth required)
- http://localhost:3000/sign-in (auth page)
- http://localhost:3000/offline-translate (no auth)

**Wrong URLs** (404):
- http://localhost:3000/(auth)/translate ❌
- http://localhost:3000/(auth)/sign-in ❌
