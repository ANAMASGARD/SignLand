#!/bin/bash

# PWA Status Verification Script
# Run this anytime to check your PWA setup

echo "🔍 Checking SignLand PWA Status..."
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in project root directory"
    echo "Run: cd /home/linux/Videos/dynamous-kiro-hackathon"
    exit 1
fi

echo "📁 Project Directory: ✅"
echo ""

# Check PWA Icons
echo "🎨 PWA Icons:"
if [ -f "public/icon-192.png" ]; then
    SIZE_192=$(du -h public/icon-192.png | cut -f1)
    echo "  ✅ icon-192.png (${SIZE_192})"
else
    echo "  ❌ icon-192.png MISSING"
fi

if [ -f "public/icon-512.png" ]; then
    SIZE_512=$(du -h public/icon-512.png | cut -f1)
    echo "  ✅ icon-512.png (${SIZE_512})"
else
    echo "  ❌ icon-512.png MISSING"
fi

if [ -f "public/apple-touch-icon.png" ]; then
    SIZE_APPLE=$(du -h public/apple-touch-icon.png | cut -f1)
    echo "  ✅ apple-touch-icon.png (${SIZE_APPLE})"
else
    echo "  ⚠️  apple-touch-icon.png missing (optional)"
fi

echo ""

# Check Manifest
echo "📱 PWA Manifest:"
if [ -f "public/manifest.json" ]; then
    echo "  ✅ manifest.json exists"
    
    # Check if icons are referenced
    if grep -q '"icon-192.png"' public/manifest.json && grep -q '"icon-512.png"' public/manifest.json; then
        echo "  ✅ Icons properly referenced"
    else
        echo "  ⚠️  Icons may not be properly referenced"
    fi
else
    echo "  ❌ manifest.json MISSING"
fi

echo ""

# Check Service Worker
echo "🔧 Service Worker:"
if [ -f "public/sw.js" ]; then
    echo "  ✅ sw.js exists"
elif [ -f "app/sw.ts" ]; then
    echo "  ✅ sw.ts exists"
else
    echo "  ⚠️  Service worker file not found (may be auto-generated)"
fi

echo ""

# Check Layout Configuration
echo "⚙️  App Configuration:"
if [ -f "app/layout.tsx" ]; then
    echo "  ✅ layout.tsx exists"
    
    if grep -q 'manifest.*json' app/layout.tsx; then
        echo "  ✅ Manifest linked in layout"
    else
        echo "  ⚠️  Manifest may not be linked"
    fi
    
    if grep -q 'apple-touch-icon' app/layout.tsx; then
        echo "  ✅ Apple touch icon configured"
    else
        echo "  ℹ️  Apple touch icon not in layout (using manifest)"
    fi
else
    echo "  ❌ layout.tsx MISSING"
fi

echo ""

# Check for placeholder files
echo "🗑️  Cleanup Status:"
if [ -f "public/icon-192.png.txt" ]; then
    echo "  ⚠️  Old placeholder icon-192.png.txt still exists (should remove)"
else
    echo "  ✅ No placeholder files found"
fi

echo ""

# Overall Status
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

ERRORS=0

[ ! -f "public/icon-192.png" ] && ((ERRORS++))
[ ! -f "public/icon-512.png" ] && ((ERRORS++))
[ ! -f "public/manifest.json" ] && ((ERRORS++))

if [ $ERRORS -eq 0 ]; then
    echo "✅ PWA Status: READY"
    echo ""
    echo "Your Progressive Web App is properly configured!"
    echo ""
    echo "Next steps:"
    echo "1. Start dev server: npm run dev"
    echo "2. Open http://localhost:3000"
    echo "3. Look for install button in browser"
    echo "4. Test on mobile devices"
else
    echo "⚠️  PWA Status: INCOMPLETE ($ERRORS issues found)"
    echo ""
    echo "Please fix the issues above."
    echo "See PWA_FIXED_SUMMARY.md for solutions."
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
