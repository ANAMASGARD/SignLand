# Icon Generation Instructions

## Quick Method (Recommended)
1. Go to https://realfavicongenerator.net/
2. Upload a 512x512 PNG or SVG of the 🗣️ emoji or SignLand logo
3. Generate all icon sizes
4. Download and extract to public/ folder

## Manual Method
Use ImageMagick or similar tool:
```bash
# From SVG
convert -size 192x192 -background none logo.svg public/icon-192.png
convert -size 512x512 -background none logo.svg public/icon-512.png

# From PNG
convert logo.png -resize 192x192 public/icon-192.png
convert logo.png -resize 512x512 public/icon-512.png
```

## Required Icons
- icon-192.png (192x192) - For home screen
- icon-512.png (512x512) - For splash screen

## Optional Icons (iOS)
- apple-touch-icon.png (180x180)
- Various splash screen sizes for different devices

## Current Status
⚠️ Using emoji favicon as placeholder
✅ Manifest configured and ready
🔄 Generate proper PNG icons before production deployment
