# Feature: Speech Synthesis Integration

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files etc.

## Feature Description

Integrate Web Speech API (SpeechSynthesis) to convert detected gestures into spoken audio output. This completes the core gesture-to-speech pipeline: Camera → MediaPipe → Gesture Recognition → Speech Output. The implementation includes voice selection, speech controls (play/pause), and real-time caption display synchronized with audio output.

## User Story

As a non-verbal individual using SignLand
I want my hand gestures to be spoken aloud through my device's speakers
So that I can communicate verbally with people around me in real-time

## Problem Statement

Currently, SignLand can detect hand gestures using MediaPipe and display them visually, but there is no audio output. Non-verbal users need their gestures to be converted to speech so they can communicate with hearing individuals who don't understand sign language. The missing speech synthesis component prevents the app from fulfilling its core value proposition.

## Solution Statement

Implement browser-native Web Speech API (SpeechSynthesis) to convert gesture recognition results into spoken audio. Create a custom React hook (`useSpeechSynthesis`) to manage voice loading, speech state, and playback controls. Integrate speech output into the GestureRecognizer component with real-time caption display and audio controls. Support voice selection, adjustable speech parameters (rate, pitch, volume), and proper error handling for browser compatibility.

## Feature Metadata

**Feature Type**: New Capability
**Estimated Complexity**: Medium
**Primary Systems Affected**: 
- GestureRecognizer component
- New speech synthesis library
- New custom hooks
- UI components for speech controls

**Dependencies**: 
- Web Speech API (browser-native, no npm packages required)
- Existing MediaPipe gesture recognition
- React 19.2.3 hooks (useState, useEffect, useCallback, useRef)

---

## CONTEXT REFERENCES

### Relevant Codebase Files - IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `web/components/GestureRecognizer.tsx` (lines 1-300) - Why: Main component where speech will be integrated, contains gesture detection loop and results state
- `web/hooks/useCamera.ts` (lines 1-50) - Why: Pattern for custom hooks with state management, cleanup, and error handling
- `web/hooks/useMediaPipe.ts` (lines 1-50) - Why: Pattern for async initialization hooks with loading states
- `web/lib/utils.ts` (lines 1-10) - Why: Utility function pattern (cn helper)
- `web/lib/mediapipe/types.ts` (lines 1-30) - Why: Type definition patterns for the project
- `web/components/ui/ShimmerButton.tsx` - Why: Button component pattern for speech controls
- `web/app/translate/page.tsx` (lines 1-70) - Why: Protected page layout and user context

### New Files to Create

- `web/lib/speech/types.ts` - TypeScript type definitions for speech synthesis
- `web/lib/speech/gestureToPhrase.ts` - Gesture name to phrase mapping logic
- `web/lib/speech/index.ts` - Speech library barrel export
- `web/hooks/useSpeechSynthesis.ts` - Custom hook for Web Speech API management
- `web/components/SpeechControls.tsx` - UI component for speech playback controls (optional for Phase 1)

### Relevant Documentation - YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [Web Speech API - SpeechSynthesis](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesis)
  - Specific section: Basic usage, speak(), cancel(), getVoices()
  - Why: Core API for speech synthesis functionality

- [SpeechSynthesisUtterance](https://developer.mozilla.org/en-US/docs/Web/API/SpeechSynthesisUtterance)
  - Specific section: Properties (text, voice, rate, pitch, volume), Events (onstart, onend, onerror)
  - Why: Configuration object for speech requests

- [Andrew Usher - Web Speech API Guide](https://andrewusher.dev/blog/give-your-web-app-a-voice)
  - Specific sections: voiceschanged event gotcha, iOS Safari limitations, React hook pattern
  - Why: Best practices and browser compatibility patterns

### Patterns to Follow

**Custom Hook Pattern** (from `useCamera.ts` and `useMediaPipe.ts`):
```typescript
export function useCustomHook() {
  const [state, setState] = useState<Type | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const refForCleanup = useRef<Type | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const initialize = async () => {
      try {
        // async initialization
        if (mounted) {
          setState(result);
          setIsLoading(false);
        }
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Error message');
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      // cleanup logic
    };
  }, []);

  return { state, isLoading, error, actionFunctions };
}
```

**Type Definition Pattern** (from `lib/mediapipe/types.ts`):
```typescript
/**
 * Description of the interface
 */
export interface InterfaceName {
  propertyName: string;
  optionalProperty?: number;
}

export interface ConfigInterface {
  setting1?: string;
  setting2?: number;
}
```

**Error Handling Pattern** (from `useCamera.ts`):
```typescript
try {
  // operation
} catch (err) {
  console.error('Descriptive error context:', err);
  setError(err instanceof Error ? err.message : 'Fallback error message');
}
```

**Component Integration Pattern** (from `GestureRecognizer.tsx`):
```typescript
const { state, isLoading, error, action } = useCustomHook();

// Use state in useEffect for side effects
useEffect(() => {
  if (state && otherCondition) {
    // perform action
  }
}, [state, otherCondition]);

// Display error in UI
{error && (
  <div className="mt-4 p-3 md:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <div>
        <p className="text-red-800 text-sm font-medium">{error}</p>
      </div>
    </div>
  </div>
)}
```

**Naming Conventions**:
- Files: camelCase for utilities (`gestureToPhrase.ts`), PascalCase for components (`SpeechControls.tsx`)
- Hooks: `use` prefix (`useSpeechSynthesis`)
- Types: PascalCase interfaces (`SpeechConfig`, `VoicePreference`)
- Functions: camelCase descriptive names (`speakPhrase`, `loadVoices`)

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation - Speech Library & Types

Set up the foundational speech synthesis infrastructure with type definitions and utility functions.

**Tasks:**
- Create type definitions for speech synthesis interfaces
- Implement gesture-to-phrase mapping logic
- Set up library barrel exports

### Phase 2: Core Implementation - Speech Hook

Create the main `useSpeechSynthesis` hook that manages the Web Speech API lifecycle, voice loading, and speech playback.

**Tasks:**
- Implement voice loading with `voiceschanged` event handling
- Create speak/cancel/pause/resume functions
- Add state management for speaking/paused status
- Implement error handling and browser compatibility checks

### Phase 3: Integration - Connect to GestureRecognizer

Integrate speech synthesis into the existing gesture recognition component with real-time audio output.

**Tasks:**
- Add useSpeechSynthesis hook to GestureRecognizer
- Implement gesture-to-speech trigger logic
- Add caption display for spoken phrases
- Update UI with speech status indicators

### Phase 4: Testing & Validation

Validate speech synthesis works across browsers and handles edge cases properly.

**Tasks:**
- Test voice loading and selection
- Test speech playback with different gestures
- Verify error handling for unsupported browsers
- Test on mobile browsers (iOS Safari, Android Chrome)

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### CREATE `web/lib/speech/types.ts`

- **IMPLEMENT**: TypeScript interfaces for speech synthesis
- **PATTERN**: Mirror type definition style from `lib/mediapipe/types.ts`
- **IMPORTS**: None (pure type definitions)
- **CONTENT**:
```typescript
/**
 * Speech Synthesis Type Definitions
 */

export interface SpeechConfig {
  voice?: SpeechSynthesisVoice;
  rate?: number;      // 0.1 to 10, default 1
  pitch?: number;     // 0 to 2, default 1
  volume?: number;    // 0 to 1, default 1
  lang?: string;      // e.g., 'en-US'
}

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (event: SpeechSynthesisErrorEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export interface SpeechOptions extends SpeechConfig, SpeechCallbacks {}

export interface GesturePhraseMap {
  [gestureName: string]: string;
}
```
- **VALIDATE**: `npx tsc --noEmit` (should compile without errors)

### CREATE `web/lib/speech/gestureToPhrase.ts`

- **IMPLEMENT**: Mapping from MediaPipe gesture names to spoken phrases
- **PATTERN**: Simple object mapping with fallback logic
- **IMPORTS**: `import type { GesturePhraseMap } from './types';`
- **CONTENT**:
```typescript
import type { GesturePhraseMap } from './types';

/**
 * Maps MediaPipe gesture names to spoken phrases
 * 
 * MediaPipe gesture recognizer outputs gesture names like:
 * - Thumb_Up, Thumb_Down
 * - Victory (peace sign)
 * - Open_Palm
 * - Closed_Fist
 * - Pointing_Up
 * - ILoveYou
 * 
 * Add more mappings as needed for your gesture vocabulary
 */
export const GESTURE_PHRASE_MAP: GesturePhraseMap = {
  'Thumb_Up': 'Yes',
  'Thumb_Down': 'No',
  'Victory': 'Peace',
  'Open_Palm': 'Stop',
  'Closed_Fist': 'Wait',
  'Pointing_Up': 'Look',
  'ILoveYou': 'I love you',
};

/**
 * Convert gesture name to spoken phrase
 * @param gestureName - MediaPipe gesture category name
 * @returns Phrase to speak, or formatted gesture name if no mapping exists
 */
export function gestureToPhrase(gestureName: string): string {
  // Check if we have a mapping
  if (GESTURE_PHRASE_MAP[gestureName]) {
    return GESTURE_PHRASE_MAP[gestureName];
  }
  
  // Fallback: convert gesture name to readable format
  // "Thumb_Up" -> "Thumb Up"
  return gestureName.replace(/_/g, ' ');
}
```
- **GOTCHA**: MediaPipe gesture names use underscores and PascalCase
- **VALIDATE**: `npx tsc --noEmit`

### CREATE `web/lib/speech/index.ts`

- **IMPLEMENT**: Barrel export for speech library
- **PATTERN**: Re-export all public APIs from single entry point
- **IMPORTS**: Export from types and gestureToPhrase
- **CONTENT**:
```typescript
export * from './types';
export * from './gestureToPhrase';
```
- **VALIDATE**: `npx tsc --noEmit`

### CREATE `web/hooks/useSpeechSynthesis.ts`

- **IMPLEMENT**: Custom React hook for Web Speech API management
- **PATTERN**: Mirror `useCamera.ts` and `useMediaPipe.ts` hook patterns
- **IMPORTS**: 
```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpeechOptions } from '@/lib/speech';
```
- **CONTENT**:
```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpeechOptions } from '@/lib/speech';

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis not supported in this browser');
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (mounted && availableVoices.length > 0) {
        console.log('Voices loaded:', availableVoices.length);
        setVoices(availableVoices);
        setIsLoading(false);
      }
    };

    // Load voices immediately (works in Firefox and Safari)
    loadVoices();

    // Also listen for voiceschanged event (required in Chrome and Edge)
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      mounted = false;
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Apply options
    if (options.voice) utterance.voice = options.voice;
    if (options.rate !== undefined) utterance.rate = options.rate;
    if (options.pitch !== undefined) utterance.pitch = options.pitch;
    if (options.volume !== undefined) utterance.volume = options.volume;
    if (options.lang) utterance.lang = options.lang;

    // Attach event handlers
    utterance.onstart = () => {
      console.log('Speech started:', text);
      setIsSpeaking(true);
      setIsPaused(false);
      options.onStart?.();
    };

    utterance.onend = () => {
      console.log('Speech ended');
      setIsSpeaking(false);
      setIsPaused(false);
      currentUtteranceRef.current = null;
      options.onEnd?.();
    };

    utterance.onerror = (event) => {
      console.error('Speech error:', event);
      setIsSpeaking(false);
      setIsPaused(false);
      currentUtteranceRef.current = null;
      options.onError?.(event);
    };

    utterance.onpause = () => {
      console.log('Speech paused');
      setIsPaused(true);
      options.onPause?.();
    };

    utterance.onresume = () => {
      console.log('Speech resumed');
      setIsPaused(false);
      options.onResume?.();
    };

    currentUtteranceRef.current = utterance;
    speechSynthesis.speak(utterance);
  }, []);

  const cancel = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    currentUtteranceRef.current = null;
  }, []);

  const pause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      speechSynthesis.pause();
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (isSpeaking && isPaused) {
      speechSynthesis.resume();
    }
  }, [isSpeaking, isPaused]);

  return {
    voices,
    isLoading,
    isSpeaking,
    isPaused,
    error,
    speak,
    cancel,
    pause,
    resume,
  };
}
```
- **GOTCHA**: Voices load asynchronously - must handle both immediate load and voiceschanged event
- **GOTCHA**: iOS Safari requires user interaction before speech works
- **GOTCHA**: Always cancel before speaking to prevent queue issues
- **VALIDATE**: `npx tsc --noEmit`

### UPDATE `web/components/GestureRecognizer.tsx`

- **IMPLEMENT**: Integrate speech synthesis into gesture recognition component
- **PATTERN**: Add new hook, trigger speech on gesture detection, display captions
- **IMPORTS**: Add `import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';` and `import { gestureToPhrase } from '@/lib/speech';`
- **CHANGES**:
  1. Add useSpeechSynthesis hook after existing hooks (line ~23)
  2. Add state for last spoken gesture to prevent repetition (line ~25)
  3. Add useEffect to trigger speech when gesture changes (after existing useEffects)
  4. Add caption display in UI (in results panel)
  5. Add speech error display if speech synthesis fails

- **CODE ADDITIONS**:

After line 23 (after existing hooks):
```typescript
const { speak, isSpeaking, error: speechError } = useSpeechSynthesis();
const [lastSpokenGesture, setLastSpokenGesture] = useState<string | null>(null);
const [currentPhrase, setCurrentPhrase] = useState<string>('');
```

After existing useEffects (around line 150):
```typescript
// Trigger speech when gesture is detected
useEffect(() => {
  if (!isRunning || !results?.gestures?.[0]?.[0]) {
    return;
  }

  const gesture = results.gestures[0][0];
  const gestureName = gesture.categoryName;
  const confidence = gesture.score;

  // Only speak if confidence is high enough and gesture changed
  if (confidence > 0.7 && gestureName !== lastSpokenGesture) {
    const phrase = gestureToPhrase(gestureName);
    setCurrentPhrase(phrase);
    speak(phrase, {
      rate: 1.0,
      pitch: 1.0,
      volume: 1.0,
    });
    setLastSpokenGesture(gestureName);
    
    // Reset after 2 seconds to allow repeating same gesture
    setTimeout(() => {
      setLastSpokenGesture(null);
    }, 2000);
  }
}, [results, isRunning, lastSpokenGesture, speak]);
```

In the results panel (around line 250, after "Detected Gestures" heading):
```typescript
{/* Current Phrase Display */}
{currentPhrase && (
  <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
    <div className="flex items-center gap-2 mb-2">
      <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
      </svg>
      <span className="text-xs font-semibold text-green-700">
        {isSpeaking ? 'Speaking...' : 'Last Spoken'}
      </span>
    </div>
    <p className="text-2xl font-bold text-green-800">{currentPhrase}</p>
  </div>
)}
```

After camera error display (around line 200):
```typescript
{speechError && (
  <div className="mt-4 p-3 md:p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
    <div className="flex items-start gap-3">
      <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
      <div>
        <p className="text-yellow-800 text-sm font-medium">Speech synthesis unavailable</p>
        <p className="text-yellow-600 text-xs mt-1">{speechError}</p>
      </div>
    </div>
  </div>
)}
```

- **GOTCHA**: Prevent speaking same gesture repeatedly by tracking lastSpokenGesture
- **GOTCHA**: Only speak gestures with confidence > 0.7 to avoid false positives
- **GOTCHA**: Reset lastSpokenGesture after timeout to allow repeating gestures
- **VALIDATE**: `npx tsc --noEmit` then `npm run dev` and test in browser

---

## TESTING STRATEGY

### Unit Tests (Future - Not Required for Phase 1)

Test gesture-to-phrase mapping logic:
- `gestureToPhrase('Thumb_Up')` returns 'Yes'
- `gestureToPhrase('Unknown_Gesture')` returns formatted name
- All mapped gestures return correct phrases

### Integration Tests (Manual Testing Required)

Test end-to-end gesture-to-speech flow:
1. Start camera and gesture recognition
2. Show thumbs up gesture
3. Verify "Yes" is spoken aloud
4. Verify caption displays "Yes"
5. Show different gesture
6. Verify new phrase is spoken
7. Show same gesture again after 2 seconds
8. Verify phrase is spoken again

### Edge Cases

Test browser compatibility and error handling:
- **No speech synthesis support**: Verify error message displays
- **Voices not loaded**: Verify speech still works with default voice
- **Low confidence gestures**: Verify speech doesn't trigger for confidence < 0.7
- **Rapid gesture changes**: Verify only one phrase spoken at a time
- **Same gesture repeated**: Verify gesture can be repeated after 2 second timeout
- **iOS Safari**: Verify speech works after user interaction (camera start button)
- **Mobile browsers**: Test on Android Chrome and iOS Safari

### Browser-Specific Testing

- **Desktop Chrome**: Should have 80+ voices, all features work
- **Desktop Firefox**: Should work, but no onboundary event
- **Desktop Safari**: Should work with system voices
- **iOS Safari**: Requires user interaction, limited voices (2-3)
- **Android Chrome**: Should work with Google TTS voices

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
# TypeScript compilation check
npx tsc --noEmit

# ESLint check
npm run lint
```

### Level 2: Build Validation

```bash
# Production build test
npm run build

# Verify no build errors
echo $?  # Should output 0
```

### Level 3: Development Server

```bash
# Start development server
npm run dev

# Server should start on http://localhost:3000
# No console errors should appear
```

### Level 4: Manual Validation

**Test Sequence**:

1. **Open app**: Navigate to http://localhost:3000
2. **Sign in**: Authenticate with Clerk
3. **Navigate to /translate**: Should redirect to translate page
4. **Click "Start Camera"**: Camera should activate
5. **Grant permissions**: Allow camera access
6. **Show thumbs up**: Should hear "Yes" spoken aloud
7. **Check caption**: "Yes" should display in green box
8. **Show peace sign**: Should hear "Peace" spoken aloud
9. **Show thumbs up again**: Should hear "Yes" again after 2 seconds
10. **Check console**: No errors should appear
11. **Test on mobile**: Repeat on iOS Safari and Android Chrome

**Expected Results**:
- ✅ Speech plays through device speakers
- ✅ Captions display in real-time
- ✅ Different gestures trigger different phrases
- ✅ Same gesture can be repeated after timeout
- ✅ Low confidence gestures don't trigger speech
- ✅ No console errors

**Browser Compatibility Check**:
```bash
# Test on multiple browsers
# Chrome: http://localhost:3000
# Firefox: http://localhost:3000
# Safari: http://localhost:3000
# iOS Safari: http://<your-local-ip>:3000
# Android Chrome: http://<your-local-ip>:3000
```

### Level 5: Additional Validation (Optional)

**Voice Selection Test** (for future enhancement):
```javascript
// In browser console
const voices = speechSynthesis.getVoices();
console.log('Available voices:', voices.length);
console.log('Voice names:', voices.map(v => v.name));
```

**Speech Parameters Test** (for future enhancement):
```javascript
// Test different speech rates
const utterance = new SpeechSynthesisUtterance('Testing speech rate');
utterance.rate = 0.5; // Slow
speechSynthesis.speak(utterance);
```

---

## ACCEPTANCE CRITERIA

- [x] Web Speech API integrated with useSpeechSynthesis hook
- [x] Gesture detection triggers speech output automatically
- [x] Captions display current/last spoken phrase
- [x] Speech only triggers for high-confidence gestures (>0.7)
- [x] Same gesture can be repeated after 2 second timeout
- [x] Error handling for unsupported browsers
- [x] TypeScript compilation passes with no errors
- [x] Development server runs without console errors
- [x] Manual testing confirms speech works on desktop browsers
- [x] Manual testing confirms speech works on mobile browsers (iOS Safari, Android Chrome)
- [x] No regressions in existing gesture recognition functionality
- [x] Code follows project conventions (hooks pattern, error handling, TypeScript types)

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order (types → mapping → hook → integration)
- [ ] TypeScript compilation passes (`npx tsc --noEmit`)
- [ ] ESLint passes (`npm run lint`)
- [ ] Production build succeeds (`npm run build`)
- [ ] Development server runs (`npm run dev`)
- [ ] Manual testing on desktop Chrome confirms speech works
- [ ] Manual testing on desktop Firefox confirms speech works
- [ ] Manual testing on desktop Safari confirms speech works
- [ ] Manual testing on iOS Safari confirms speech works (after user interaction)
- [ ] Manual testing on Android Chrome confirms speech works
- [ ] Captions display correctly in UI
- [ ] Error messages display for unsupported browsers
- [ ] No console errors during normal operation
- [ ] Gesture repetition works after timeout
- [ ] Low confidence gestures don't trigger speech
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and maintainability

---

## NOTES

### Design Decisions

**Why Web Speech API instead of external TTS service?**
- Privacy-first: No data sent to external servers in Fast Mode
- Zero latency: No network requests required
- Zero cost: Browser-native API is free
- Offline-capable: Works without internet connection
- Aligns with project's core value proposition

**Why 0.7 confidence threshold?**
- Prevents false positives from ambiguous hand positions
- MediaPipe confidence scores are generally reliable above 0.7
- Can be adjusted based on user feedback

**Why 2 second timeout for gesture repetition?**
- Prevents accidental repeated speech from holding gesture
- Long enough to be intentional, short enough to be responsive
- Can be made configurable in future settings

**Why no voice selection in Phase 1?**
- Simplifies initial implementation
- Default voice works for MVP demonstration
- Voice selection can be added in Phase 2 (settings page)

### Browser Compatibility Notes

**iOS Safari Limitations**:
- Only 2-3 voices available (vs 80+ on desktop)
- Requires user interaction before speech works (camera start button satisfies this)
- Speech stops when app is backgrounded
- Pitch and rate parameters are more restricted

**Android Compatibility**:
- Voice quality depends on installed TTS engines
- Most devices have Google TTS pre-installed
- Generally good support for all features

**Desktop Browsers**:
- Chrome/Edge: Excellent support, extensive voice libraries
- Firefox: Good support, but no onboundary event (not needed for this implementation)
- Safari: Good support with high-quality system voices

### Future Enhancements (Not in Scope for Phase 1)

1. **Voice Selection UI**: Settings page to choose preferred voice
2. **Speech Parameters**: Adjustable rate, pitch, volume controls
3. **Gesture Stabilizer**: Debounce logic to improve gesture detection accuracy
4. **Smart Mode**: Gemini AI integration for natural language refinement
5. **Phrase History**: Track and replay recent translations
6. **Custom Gesture Mapping**: User-defined gesture-to-phrase mappings
7. **Multi-language Support**: Different output languages for speech

### Performance Considerations

- Speech synthesis is non-blocking and doesn't impact gesture recognition FPS
- Voice loading happens once on component mount
- Utterance objects are lightweight and created on-demand
- No memory leaks: proper cleanup in useEffect return functions

### Security Considerations

- No user data transmitted (browser-native API)
- No API keys required for Web Speech API
- No external dependencies or npm packages
- Follows same security model as existing camera/MediaPipe integration
