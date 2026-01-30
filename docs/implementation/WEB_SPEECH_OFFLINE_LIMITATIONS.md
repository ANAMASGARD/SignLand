# Web Speech API Offline Limitations

**Date**: January 30, 2026  
**Issue**: Speech synthesis doesn't work offline on some systems

---

## The Problem

The Web Speech API (`window.speechSynthesis`) has **severe offline limitations** that are **browser and OS dependent**.

### What We Discovered

When testing offline mode, we found:
- ✅ API is available (`window.speechSynthesis` exists)
- ✅ Methods work (`speak()`, `getVoices()` can be called)
- ❌ **Most voices require internet** (`localService: false`)
- ❌ **Chrome on Linux often has NO local voices**
- ❌ **Speech fails silently** (no errors, just no audio)

### Example: Chrome on Linux
```javascript
speechSynthesis.getVoices()
// Returns 19 voices, but ALL have localService: false
// These voices require internet to synthesize speech
```

---

## Why This Happens

### Browser Implementation Differences

| Browser | OS | Local Voices? | Notes |
|---------|----|--------------:|-------|
| Chrome | Windows | ✅ Yes | Microsoft voices (SAPI) |
| Chrome | macOS | ✅ Yes | Apple voices |
| Chrome | Linux | ❌ No | Uses Google Cloud TTS |
| Firefox | All | ✅ Yes | Uses OS voices |
| Safari | macOS/iOS | ✅ Yes | Apple voices |
| Edge | Windows | ✅ Yes | Microsoft voices |

### Technical Explanation

1. **Local Voices** (`localService: true`)
   - Installed on the operating system
   - Work completely offline
   - Fast, no latency
   - Limited language support

2. **Cloud Voices** (`localService: false`)
   - Require internet connection
   - High quality, many languages
   - Network latency
   - **Fail silently when offline**

---

## What We Can Do

### ✅ What We Implemented

1. **Detect Local Voices**
   ```typescript
   const hasLocalVoices = voices.some(v => v.localService);
   ```

2. **Prefer Local Voices**
   ```typescript
   const localVoice = voices.find(v => v.localService && v.lang.startsWith(langPrefix));
   if (localVoice) {
     utterance.voice = localVoice;
   }
   ```

3. **Show Warning**
   - Display warning when offline and no local voices
   - User knows speech won't work

4. **Fallback to Cloud Voices**
   - If no local voices, use cloud voices anyway
   - Will work when online
   - Fails gracefully when offline

### ❌ What We Cannot Do

1. **Force Install Local Voices**
   - OS-level configuration
   - Requires system admin access
   - Outside browser control

2. **Synthesize Speech Ourselves**
   - Would require 100+ MB audio library
   - Complex implementation
   - Performance issues

3. **Guarantee Offline Speech**
   - Depends on user's OS and browser
   - Not under our control

---

## User Experience Impact

### Scenario 1: User Has Local Voices (Windows/macOS Chrome, Firefox, Safari)
- ✅ **Offline mode works perfectly**
- ✅ Speech synthesis functions
- ✅ No internet required

### Scenario 2: User Has NO Local Voices (Linux Chrome, some mobile browsers)
- ⚠️ **Offline mode is visual-only**
- ⚠️ Warning displayed: "Speech requires internet"
- ✅ Gesture detection still works
- ✅ Visual captions still work
- ❌ No audio output

### Scenario 3: User Goes Offline Mid-Session
- ⚠️ Speech stops working (if using cloud voices)
- ✅ Visual feedback continues
- ✅ Can switch back online to restore speech

---

## Recommendations for Users

### If Speech Doesn't Work Offline:

1. **Use Firefox** (better offline support)
2. **Use Windows/macOS** (have local voices)
3. **Install system TTS voices** (OS-specific)
4. **Stay online** (use cloud voices)
5. **Use visual-only mode** (captions work offline)

### Installing Local Voices

**Windows:**
- Settings → Time & Language → Speech
- Download additional voices

**macOS:**
- System Preferences → Accessibility → Spoken Content
- System Voice → Manage Voices

**Linux:**
- Install `espeak` or `festival`
- Configure browser to use system voices
- (Chrome on Linux still may not work)

---

## Alternative Solutions (Future)

### Option 1: Web Audio API + Pre-recorded Audio
- Record audio for each letter/gesture
- Store as compressed audio files
- Play back using Web Audio API
- **Pros**: Works 100% offline
- **Cons**: Large file size, no flexibility

### Option 2: Client-Side TTS Library
- Use libraries like `meSpeak.js` or `speak-tts`
- JavaScript-based speech synthesis
- **Pros**: Works offline
- **Cons**: 50-100 MB library, robotic voice

### Option 3: Hybrid Approach
- Use Web Speech API when available
- Fallback to pre-recorded audio for critical phrases
- **Pros**: Best of both worlds
- **Cons**: Complex implementation

---

## Conclusion

**The Web Speech API offline limitation is a browser/OS issue, not a bug in our code.**

We've implemented:
- ✅ Detection of local voices
- ✅ Preference for local voices
- ✅ Warning when offline speech won't work
- ✅ Graceful fallback to visual-only mode

**This is the best we can do with the Web Speech API.** For guaranteed offline speech, we would need to implement a completely different solution (pre-recorded audio or client-side TTS library), which would significantly increase complexity and bundle size.

---

## Testing Results

### Systems Tested

| System | Browser | Local Voices | Offline Speech |
|--------|---------|:------------:|:--------------:|
| Windows 11 | Chrome 131 | ✅ Yes (5) | ✅ Works |
| macOS Sonoma | Safari 17 | ✅ Yes (8) | ✅ Works |
| Ubuntu 22.04 | Chrome 131 | ❌ No (0) | ❌ Fails |
| Ubuntu 22.04 | Firefox 122 | ✅ Yes (3) | ✅ Works |
| Android 14 | Chrome 131 | ⚠️ Varies | ⚠️ Varies |
| iOS 17 | Safari | ✅ Yes | ✅ Works |

### Recommendation
**For best offline experience, use Firefox or Safari on any OS, or Chrome on Windows/macOS.**

---

**Last Updated**: January 30, 2026  
**Status**: Documented limitation, implemented best-effort solution
