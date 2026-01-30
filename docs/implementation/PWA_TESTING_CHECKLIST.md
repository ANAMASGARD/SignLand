# PWA Testing Checklist

## Pre-Deployment
- [ ] Generate PNG icons (192x192, 512x512)
- [ ] Place icons in `public/` folder
- [ ] Verify manifest.json is valid
- [ ] Test build completes successfully
- [ ] Check service worker files generated

## Android Testing (Chrome)
- [ ] Open app in Chrome
- [ ] Wait for install prompt (3 seconds)
- [ ] Click "Add to Home Screen"
- [ ] Verify icon appears on home screen
- [ ] Open app from home screen
- [ ] Verify standalone mode (no browser UI)
- [ ] Test camera permissions
- [ ] Test gesture detection
- [ ] Test speech synthesis
- [ ] Enable airplane mode
- [ ] Verify Fast Mode works offline
- [ ] Test vibration feedback
- [ ] Disable airplane mode
- [ ] Verify update notification appears (if new version)

## iOS Testing (Safari)
- [ ] Open app in Safari
- [ ] Tap Share button (□↑)
- [ ] Tap "Add to Home Screen"
- [ ] Verify icon appears on home screen
- [ ] Open app from home screen
- [ ] Verify standalone mode
- [ ] Test camera permissions (may require multiple attempts)
- [ ] Tap "Enable Audio" button
- [ ] Test gesture detection
- [ ] Test speech synthesis
- [ ] Enable airplane mode
- [ ] Verify Fast Mode works offline
- [ ] Disable airplane mode

## Desktop Testing (Chrome/Edge)
- [ ] Open app in browser
- [ ] Look for install icon (⊕) in address bar
- [ ] Click "Install"
- [ ] Verify app opens in standalone window
- [ ] Test camera permissions
- [ ] Test gesture detection
- [ ] Test speech synthesis
- [ ] Open DevTools → Application tab
- [ ] Verify Manifest loaded
- [ ] Verify Service Worker registered
- [ ] Test offline mode (Network → Offline)
- [ ] Verify Fast Mode works offline
- [ ] Run Lighthouse audit
- [ ] Check PWA score (aim for 90+)

## Lighthouse Audit
- [ ] Open Chrome DevTools
- [ ] Go to Lighthouse tab
- [ ] Select "Progressive Web App" category
- [ ] Click "Generate report"
- [ ] Verify score 90+
- [ ] Check all PWA criteria pass:
  - [ ] Installable
  - [ ] Service worker registered
  - [ ] Offline support
  - [ ] HTTPS
  - [ ] Viewport meta tag
  - [ ] Theme color
  - [ ] Icons (proper sizes)
  - [ ] Splash screen

## Feature Testing
- [ ] Install prompt appears automatically
- [ ] Install prompt can be dismissed
- [ ] Dismissed prompt doesn't reappear
- [ ] Update notification appears (deploy new version)
- [ ] Update notification refreshes app
- [ ] Camera resolution adapts to device
- [ ] Vibration works on mobile (Android)
- [ ] Touch targets are 44x44px minimum
- [ ] Safe areas respected on notched devices
- [ ] Offline page shows when no connection
- [ ] Fast Mode works without internet
- [ ] Smart Mode requires internet
- [ ] MediaPipe WASM files cached
- [ ] App works in portrait and landscape

## Performance Testing
- [ ] First load < 3 seconds
- [ ] Subsequent loads < 1 second (cached)
- [ ] Camera starts < 2 seconds
- [ ] Gesture detection < 500ms latency
- [ ] Speech synthesis < 200ms delay
- [ ] No lag or stuttering on mobile
- [ ] 30 FPS gesture detection maintained
- [ ] Battery usage acceptable (< 10%/hour)

## Cross-Browser Testing
- [ ] Chrome (Android): Full support
- [ ] Chrome (Desktop): Full support
- [ ] Safari (iOS): Full support
- [ ] Safari (macOS): Full support
- [ ] Edge (Desktop): Full support
- [ ] Firefox (Desktop): Partial support
- [ ] Firefox (Android): Partial support

## Edge Cases
- [ ] App works on slow 3G connection
- [ ] App handles camera permission denial
- [ ] App handles microphone permission denial
- [ ] App works with multiple tabs open
- [ ] App handles service worker update errors
- [ ] App handles offline → online transition
- [ ] App handles online → offline transition
- [ ] App works after device restart
- [ ] App works after browser cache clear
- [ ] App handles low battery mode (iOS)

## Security Testing
- [ ] HTTPS enforced in production
- [ ] No mixed content warnings
- [ ] Camera stream never uploaded
- [ ] Service worker from same origin
- [ ] Manifest from same origin
- [ ] No XSS vulnerabilities
- [ ] No CSRF vulnerabilities
- [ ] Content Security Policy configured

## Accessibility Testing
- [ ] Screen reader announces install prompt
- [ ] Keyboard navigation works
- [ ] Touch targets meet WCAG 2.1 (44x44px)
- [ ] Color contrast meets WCAG AA
- [ ] Focus indicators visible
- [ ] Alt text for images
- [ ] ARIA labels for interactive elements

## Documentation Review
- [ ] README.md has PWA section
- [ ] PWA_GUIDE.md is comprehensive
- [ ] Installation instructions clear
- [ ] Troubleshooting guide helpful
- [ ] Platform compatibility documented
- [ ] Known issues documented

## Final Checks
- [ ] All icons generated and in place
- [ ] Manifest.json valid (use validator)
- [ ] Service worker registered
- [ ] HTTPS enforced
- [ ] Lighthouse PWA score 90+
- [ ] Tested on real devices (not just emulators)
- [ ] No console errors
- [ ] No build warnings
- [ ] Demo video shows PWA features
- [ ] Submission includes PWA documentation

---

**Pass Criteria**: All critical items checked, 90+ Lighthouse score, works on real devices
**Time Estimate**: 2-3 hours for comprehensive testing
**Priority**: High - PWA is a key differentiator for SignLand
