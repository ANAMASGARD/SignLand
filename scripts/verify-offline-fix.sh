#!/bin/bash

echo "🔍 Verifying Offline Mode & Clerk Fix..."
echo ""

# Check auth route structure
echo "✓ Checking auth route structure..."
if [ -d "app/(auth)" ]; then
    echo "  ✅ app/(auth)/ exists"
else
    echo "  ❌ app/(auth)/ missing"
    exit 1
fi

if [ -f "app/(auth)/layout.tsx" ]; then
    echo "  ✅ app/(auth)/layout.tsx exists (ClerkProvider)"
else
    echo "  ❌ app/(auth)/layout.tsx missing"
    exit 1
fi

if [ -d "app/(auth)/translate" ]; then
    echo "  ✅ app/(auth)/translate/ exists"
else
    echo "  ❌ app/(auth)/translate/ missing"
    exit 1
fi

# Check MediaPipe model
echo ""
echo "✓ Checking MediaPipe model..."
if [ -f "public/gesture_recognizer.task" ]; then
    SIZE=$(du -h public/gesture_recognizer.task | cut -f1)
    echo "  ✅ gesture_recognizer.task exists ($SIZE)"
else
    echo "  ❌ gesture_recognizer.task missing"
    exit 1
fi

# Check offline routes
echo ""
echo "✓ Checking offline routes..."
if [ -d "app/offline-translate" ]; then
    echo "  ✅ app/offline-translate/ exists"
else
    echo "  ❌ app/offline-translate/ missing"
    exit 1
fi

# Check root layout (no Clerk)
echo ""
echo "✓ Checking root layout..."
if grep -q "ClerkProvider" app/layout.tsx; then
    echo "  ❌ Root layout still has ClerkProvider (should be removed)"
    exit 1
else
    echo "  ✅ Root layout has no ClerkProvider"
fi

# Check middleware
echo ""
echo "✓ Checking middleware..."
if grep -q "(auth)" proxy.ts; then
    echo "  ✅ Middleware configured for (auth) routes"
else
    echo "  ⚠️  Middleware may need update"
fi

echo ""
echo "✅ All checks passed!"
echo ""
echo "📝 Next steps:"
echo "1. Update .env.local with new Clerk URLs:"
echo "   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/(auth)/sign-in"
echo "   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/(auth)/sign-up"
echo "   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/(auth)/translate"
echo "   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/(auth)/translate"
echo ""
echo "2. Test offline mode:"
echo "   npm run dev"
echo "   Open http://localhost:3000"
echo "   Click 'Use Offline Mode'"
echo ""
echo "3. Test authenticated mode:"
echo "   Click 'Start Experience'"
echo "   Sign in with Clerk"
echo ""
