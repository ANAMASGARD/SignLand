# Feature: MediaPipe Gesture Recognition Integration

The following plan should be complete, but it's important that you validate documentation and codebase patterns and task sanity before you start implementing.

Pay special attention to naming of existing utils, types, and models. Import from the right files etc.

## Feature Description

Integrate MediaPipe Gesture Recognizer into the SignLand translate page to enable real-time hand gesture detection from webcam video stream. This feature implements the core functionality of the application: capturing video from the user's camera, processing each frame through MediaPipe's gesture recognition model, and displaying detected gestures with confidence scores and hand landmarks on a canvas overlay.

The implementation provides a two-pane layout with live camera preview on the left and gesture detection results on the right, including controls for starting/stopping the camera and displaying real-time gesture recognition data.

## User Story

As a non-verbal user
I want to perform hand gestures in front of my webcam and see them recognized in real-time
So that I can communicate through sign language without needing a human interpreter

## Problem Statement

The current translate page is a placeholder with no functional gesture recognition. Users cannot:
- Access their webcam to capture video
- See real-time hand tracking and landmark detection
- View recognized gestures with confidence scores
- Understand which gestures are being detected

This prevents the core value proposition of SignLand from being realized.

## Solution Statement

Implement a complete MediaPipe Gesture Recognizer integration that:
1. Requests camera permissions and streams video to a `<video>` element
2. Initializes MediaPipe GestureRecognizer with WASM files already in `/public/wasm`
3. Processes video frames at 30 FPS using `requestAnimationFrame`
4. Draws hand landmarks on a canvas overlay positioned over the video
5. Displays detected gestures, confidence scores, and handedness in a results panel
6. Provides start/stop controls with proper cleanup on unmount

## Feature Metadata

**Feature Type**: New Capability  
**Estimated Complexity**: Medium  
**Primary Systems Affected**: 
- `/web/app/translate/page.tsx` (main UI)
- `/web/lib/mediapipe/` (gesture recognition logic)
- `/web/components/` (new GestureRecognizer component)

**Dependencies**: 
- `@mediapipe/tasks-vision` (already installed)
- MediaPipe WASM files (already in `/public/wasm`)
- Browser WebRTC API (getUserMedia)

---

## CONTEXT REFERENCES

### Relevant Codebase Files - IMPORTANT: YOU MUST READ THESE FILES BEFORE IMPLEMENTING!

- `web/lib/mediapipe/gestureRecognizer.ts` (lines 1-50) - **Why**: Contains MediaPipe initialization logic that needs to be integrated
- `web/lib/mediapipe/types.ts` (lines 1-30) - **Why**: TypeScript type definitions for gesture results
- `web/app/translate/page.tsx` (lines 1-150) - **Why**: Current placeholder page that needs gesture recognition component
- `web/components/landing/Hero.tsx` (lines 1-50) - **Why**: Pattern for React hooks usage (useState, useEffect, useRef)
- `web/components/ui/GlassButton.tsx` (lines 1-80) - **Why**: Pattern for interactive button components with hover states
- `web/lib/utils.ts` (lines 1-10) - **Why**: `cn()` utility for class merging (use this for conditional classes)
- `web/lib/design/tokens.ts` (lines 1-40) - **Why**: Design system colors and typography to maintain consistency

### New Files to Create

- `web/components/GestureRecognizer.tsx` - Main gesture recognition component with video, canvas, and controls
- `web/hooks/useMediaPipe.ts` - Custom hook for MediaPipe initialization and cleanup
- `web/hooks/useCamera.ts` - Custom hook for camera access and stream management
- `web/lib/mediapipe/drawLandmarks.ts` - Utility to draw hand landmarks on canvas

### Relevant Documentation - YOU SHOULD READ THESE BEFORE IMPLEMENTING!

- [MediaPipe Gesture Recognizer Web Guide](https://ai.google.dev/edge/mediapipe/solutions/vision/gesture_recognizer/web_js)
  - Specific sections: "Create the task", "Run the task" (Video mode), "Handle and display results"
  - **Why**: Official implementation patterns for VIDEO mode with `recognizeForVideo()` and `requestAnimationFrame` loop
  
- [MDN getUserMedia API](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia)
  - Specific section: Constraints and error handling
  - **Why**: Proper camera permission handling and stream management

- [MDN Canvas API](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)
  - Specific section: Drawing paths and coordinates
  - **Why**: Drawing hand landmarks requires canvas 2D context operations

### Patterns to Follow

**Component Structure** (from `Hero.tsx`):
```typescript
'use client';

import { useRef, useEffect, useState } from 'react';

export function ComponentName() {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<Type>(initialValue);

  useEffect(() => {
    // Setup logic
    return () => {
      // Cleanup logic
    };
  }, [dependencies]);

  return (
    <div ref={ref}>
      {/* JSX */}
    </div>
  );
}
```

**Class Name Merging** (from `utils.ts`):
```typescript
import { cn } from '@/lib/utils';

<div className={cn(
  "base-classes",
  condition && "conditional-classes",
  anotherCondition ? "true-classes" : "false-classes"
)} />
```

**Error Handling Pattern**:
```typescript
try {
  // Operation
} catch (error) {
  console.error('Descriptive error message:', error);
  // Set error state for UI display
}
```

**Cleanup Pattern** (from MediaPipe docs):
```typescript
useEffect(() => {
  // Initialize resources
  
  return () => {
    // Clean up: stop streams, close recognizer
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    if (recognizer) {
      recognizer.close();
    }
  };
}, []);
```

**MediaPipe VIDEO Mode Pattern** (from official docs):
```typescript
await gestureRecognizer.setOptions({ runningMode: "VIDEO" });

let lastVideoTime = -1;
function renderLoop(): void {
  const video = document.getElementById("video");

  if (video.currentTime !== lastVideoTime) {
    const result = gestureRecognizer.recognizeForVideo(video, Date.now());
    processResult(result);
    lastVideoTime = video.currentTime;
  }

  requestAnimationFrame(renderLoop);
}
```

---

## IMPLEMENTATION PLAN

### Phase 1: Foundation - Custom Hooks

Create reusable hooks for camera access and MediaPipe initialization to separate concerns and enable testing.

**Tasks:**
- Create `useCamera` hook for webcam stream management
- Create `useMediaPipe` hook for GestureRecognizer lifecycle
- Create canvas drawing utility for hand landmarks

### Phase 2: Core Implementation - Gesture Recognizer Component

Build the main GestureRecognizer component that orchestrates video capture, gesture detection, and result display.

**Tasks:**
- Create GestureRecognizer component with video and canvas elements
- Implement frame processing loop with `requestAnimationFrame`
- Add gesture result display panel
- Implement start/stop controls

### Phase 3: Integration - Update Translate Page

Replace the placeholder UI in the translate page with the functional GestureRecognizer component.

**Tasks:**
- Import and render GestureRecognizer in translate page
- Maintain existing header and layout structure
- Add error boundary for graceful failure handling

### Phase 4: Testing & Validation

Ensure the feature works correctly across different scenarios and browsers.

**Tasks:**
- Test camera permission flow (grant/deny)
- Verify gesture detection accuracy
- Test cleanup on component unmount
- Validate canvas landmark drawing

---

## STEP-BY-STEP TASKS

IMPORTANT: Execute every task in order, top to bottom. Each task is atomic and independently testable.

### Task 1: CREATE `web/hooks/useCamera.ts`

- **IMPLEMENT**: Custom hook for camera access with permission handling
- **PATTERN**: React hooks pattern from `Hero.tsx:10-15`
- **IMPORTS**: 
  ```typescript
  import { useState, useEffect, useRef } from 'react';
  ```
- **FUNCTIONALITY**:
  - Request camera permissions with `navigator.mediaDevices.getUserMedia()`
  - Return video stream, loading state, error state
  - Cleanup: stop all tracks on unmount
  - Constraints: `{ video: { width: 1280, height: 720, facingMode: 'user' } }`
- **GOTCHA**: Must stop all tracks in cleanup to release camera, not just set stream to null
- **VALIDATE**: 
  ```bash
  cd web && npm run lint
  ```

### Task 2: CREATE `web/hooks/useMediaPipe.ts`

- **IMPLEMENT**: Custom hook for MediaPipe GestureRecognizer initialization
- **PATTERN**: Async initialization with cleanup from `gestureRecognizer.ts:15-25`
- **IMPORTS**:
  ```typescript
  import { useState, useEffect } from 'react';
  import { GestureRecognizer } from '@mediapipe/tasks-vision';
  import { initializeGestureRecognizer, cleanupGestureRecognizer } from '@/lib/mediapipe';
  ```
- **FUNCTIONALITY**:
  - Initialize recognizer on mount with VIDEO mode
  - Return recognizer instance, loading state, error state
  - Cleanup: call `cleanupGestureRecognizer()` on unmount
- **GOTCHA**: Must set `runningMode: 'VIDEO'` for continuous stream processing
- **VALIDATE**:
  ```bash
  cd web && npm run lint
  ```

### Task 3: CREATE `web/lib/mediapipe/drawLandmarks.ts`

- **IMPLEMENT**: Utility function to draw hand landmarks on canvas
- **PATTERN**: Canvas 2D context drawing operations
- **IMPORTS**:
  ```typescript
  import type { GestureResult } from './types';
  ```
- **FUNCTIONALITY**:
  - Accept canvas context, landmarks array, canvas dimensions
  - Draw circles for each landmark (21 points per hand)
  - Draw lines connecting landmarks (hand skeleton)
  - Use colors: landmarks = '#00FF00', connections = '#FFFFFF'
  - Scale normalized coordinates (0-1) to canvas dimensions
- **GOTCHA**: Landmarks are normalized [0, 1], must multiply by canvas width/height
- **VALIDATE**:
  ```bash
  cd web && npm run lint
  ```

### Task 4: CREATE `web/components/GestureRecognizer.tsx`

- **IMPLEMENT**: Main gesture recognition component with video, canvas, and results
- **PATTERN**: Component structure from `Hero.tsx:1-50`, hooks usage from `Hero.tsx:10-15`
- **IMPORTS**:
  ```typescript
  'use client';
  
  import { useRef, useEffect, useState } from 'react';
  import { useCamera } from '@/hooks/useCamera';
  import { useMediaPipe } from '@/hooks/useMediaPipe';
  import { drawLandmarks } from '@/lib/mediapipe/drawLandmarks';
  import { cn } from '@/lib/utils';
  import type { GestureRecognizerResult } from '@mediapipe/tasks-vision';
  ```
- **STATE**:
  - `isRunning: boolean` - Whether detection loop is active
  - `results: GestureRecognizerResult | null` - Latest gesture detection results
  - `fps: number` - Current frames per second
- **REFS**:
  - `videoRef: HTMLVideoElement` - Video element for camera stream
  - `canvasRef: HTMLCanvasElement` - Canvas for landmark overlay
  - `animationFrameRef: number` - RequestAnimationFrame ID for cleanup
- **FUNCTIONALITY**:
  - Use `useCamera()` to get video stream
  - Use `useMediaPipe()` to get gesture recognizer
  - Attach stream to video element when available
  - Start detection loop on "Start" button click
  - Process frames with `recognizeForVideo(video, Date.now())`
  - Draw landmarks on canvas overlay
  - Display gesture name, confidence, handedness in results panel
  - Stop loop on "Stop" button click
  - Cleanup: cancel animation frame, stop stream
- **LAYOUT**:
  - Two-column grid: video/canvas on left (60%), results on right (40%)
  - Video and canvas positioned relative/absolute for overlay
  - Start/Stop button below video
  - Results panel shows: gesture name, confidence %, handedness (Left/Right)
- **GOTCHA**: 
  - Must check `video.currentTime !== lastVideoTime` to avoid processing same frame twice
  - Canvas must match video dimensions exactly for landmark alignment
  - Must call `recognizer.setOptions({ runningMode: 'VIDEO' })` before first use
- **VALIDATE**:
  ```bash
  cd web && npm run lint
  cd web && npm run dev
  # Manual: Open http://localhost:3000/translate, click Start, verify video and landmarks appear
  ```

### Task 5: UPDATE `web/app/translate/page.tsx`

- **IMPLEMENT**: Replace placeholder with GestureRecognizer component
- **PATTERN**: Component import and rendering from existing page structure
- **IMPORTS**:
  ```typescript
  import { GestureRecognizer } from '@/components/GestureRecognizer';
  ```
- **CHANGES**:
  - Remove placeholder div (lines 70-110 approximately)
  - Replace with `<GestureRecognizer />` component
  - Keep existing header with UserButton
  - Keep existing feature cards below GestureRecognizer
  - Maintain responsive layout with max-w-7xl container
- **GOTCHA**: Don't remove the authentication check logic at the top of the component
- **VALIDATE**:
  ```bash
  cd web && npm run lint
  cd web && npm run dev
  # Manual: Navigate to /translate, verify component renders
  ```

### Task 6: UPDATE `web/lib/mediapipe/gestureRecognizer.ts`

- **IMPLEMENT**: Add VIDEO mode configuration method
- **PATTERN**: Existing initialization pattern in same file
- **CHANGES**:
  - Add `setVideoMode()` function that calls `gestureRecognizer.setOptions({ runningMode: 'VIDEO' })`
  - Export this function
- **GOTCHA**: Must be called after initialization but before first `recognizeForVideo()` call
- **VALIDATE**:
  ```bash
  cd web && npm run lint
  ```

### Task 7: ADD Error Boundary (Optional but Recommended)

- **IMPLEMENT**: Error boundary to catch and display MediaPipe errors gracefully
- **PATTERN**: React error boundary pattern
- **CREATE**: `web/components/ErrorBoundary.tsx`
- **FUNCTIONALITY**:
  - Catch errors from child components
  - Display user-friendly error message
  - Provide "Try Again" button to reset
- **USAGE**: Wrap `<GestureRecognizer />` in translate page
- **VALIDATE**:
  ```bash
  cd web && npm run lint
  ```

---

## TESTING STRATEGY

### Unit Tests

**Scope**: Individual utility functions and hooks

- `drawLandmarks()` function with mock canvas context
- `useCamera()` hook with mock getUserMedia
- `useMediaPipe()` hook with mock GestureRecognizer

**Framework**: Jest + React Testing Library (not yet installed, add in future)

### Integration Tests

**Scope**: GestureRecognizer component with mocked dependencies

- Component renders video and canvas elements
- Start button initiates detection loop
- Stop button cancels animation frame
- Results panel updates when gestures detected
- Cleanup stops stream and closes recognizer

### Edge Cases

- **Camera permission denied**: Display error message, provide instructions
- **MediaPipe initialization fails**: Show error, suggest browser compatibility check
- **No hands detected**: Display "No hands detected" message
- **Multiple hands detected**: Display results for both hands
- **Component unmounts during detection**: Ensure cleanup prevents memory leaks

### Manual Testing Checklist

- [ ] Camera permission prompt appears on first use
- [ ] Video stream displays in video element
- [ ] Canvas overlay aligns perfectly with video
- [ ] Hand landmarks draw correctly when hand is visible
- [ ] Gesture name and confidence update in real-time
- [ ] Handedness (Left/Right) displays correctly
- [ ] Stop button stops detection and freezes display
- [ ] Start button resumes detection
- [ ] Component unmount stops camera and cleans up resources
- [ ] Works on Chrome, Firefox, Safari (desktop)
- [ ] Works on mobile browsers (iOS Safari, Android Chrome)

---

## VALIDATION COMMANDS

Execute every command to ensure zero regressions and 100% feature correctness.

### Level 1: Syntax & Style

```bash
cd web && npm run lint
```

**Expected**: No errors, no warnings

### Level 2: Type Checking

```bash
cd web && npx tsc --noEmit
```

**Expected**: No type errors

### Level 3: Build Verification

```bash
cd web && npm run build
```

**Expected**: Build succeeds, no errors

### Level 4: Manual Validation

**Start dev server:**
```bash
cd web && npm run dev
```

**Test flow:**
1. Navigate to `http://localhost:3000/translate`
2. Sign in if not authenticated
3. Click "Start Camera" button
4. Allow camera permissions when prompted
5. Verify video stream appears
6. Verify canvas overlay aligns with video
7. Hold hand in front of camera
8. Verify hand landmarks draw on canvas
9. Verify gesture name appears in results panel
10. Verify confidence score displays (0-100%)
11. Verify handedness shows (Left/Right)
12. Click "Stop" button
13. Verify detection stops
14. Navigate away and back to verify cleanup

### Level 5: Browser Compatibility

**Test on:**
- Chrome/Edge (Chromium)
- Firefox
- Safari (macOS)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

---

## ACCEPTANCE CRITERIA

- [ ] Camera access works with proper permission handling
- [ ] Video stream displays in video element
- [ ] MediaPipe GestureRecognizer initializes successfully
- [ ] Hand landmarks draw on canvas overlay in real-time
- [ ] Detected gestures display with name and confidence score
- [ ] Handedness (Left/Right) displays correctly
- [ ] Start/Stop controls work as expected
- [ ] Component cleanup prevents memory leaks
- [ ] Error states display user-friendly messages
- [ ] All validation commands pass with zero errors
- [ ] Works on Chrome, Firefox, Safari (desktop)
- [ ] Responsive layout works on mobile devices
- [ ] No console errors during normal operation
- [ ] FPS counter shows ~30 FPS during detection
- [ ] Multiple hands detected and displayed correctly

---

## COMPLETION CHECKLIST

- [ ] All tasks completed in order (1-7)
- [ ] Each task validation passed immediately
- [ ] All validation commands executed successfully
- [ ] Full test suite passes (when implemented)
- [ ] No linting or type checking errors
- [ ] Manual testing confirms feature works
- [ ] Acceptance criteria all met
- [ ] Code reviewed for quality and maintainability
- [ ] DEVLOG.md updated with implementation details
- [ ] No regressions in existing functionality

---

## NOTES

### Design Decisions

1. **Custom Hooks**: Separated camera and MediaPipe logic into hooks for reusability and testing
2. **Canvas Overlay**: Used absolute positioning to overlay canvas on video for landmark drawing
3. **VIDEO Mode**: Used MediaPipe VIDEO mode (not IMAGE) for continuous stream processing
4. **Frame Skipping**: Check `video.currentTime` to avoid processing duplicate frames
5. **Cleanup**: Comprehensive cleanup in useEffect return to prevent memory leaks

### Performance Considerations

- Target 30 FPS for smooth gesture detection
- Use `requestAnimationFrame` for efficient frame processing
- Skip duplicate frames by checking `video.currentTime`
- Canvas drawing is lightweight (21 landmarks + connections)
- MediaPipe WASM runs efficiently in browser with GPU acceleration

### Security Considerations

- Camera permissions requested explicitly with user consent
- Video stream never leaves the device (privacy-first)
- No video recording or storage
- HTTPS required for getUserMedia in production

### Future Enhancements

- Add gesture stabilizer (debounce logic) to prevent noisy predictions
- Implement phrase mapping (gesture → text)
- Add text-to-speech output
- Implement Smart Mode with Gemini API
- Add gesture history/timeline
- Support custom gesture training

### Known Limitations

- Requires modern browser with WebRTC support
- Requires camera access (won't work without webcam)
- MediaPipe model only recognizes predefined gestures: ["None", "Closed_Fist", "Open_Palm", "Pointing_Up", "Thumb_Down", "Thumb_Up", "Victory", "ILoveYou"]
- Performance depends on device GPU capabilities
- Mobile browsers may have audio unlock requirements (addressed in future task)

### MediaPipe Model Path

The gesture recognizer model is NOT included in the WASM files. You have two options:

**Option 1: CDN (Recommended for MVP)**
```typescript
modelAssetPath: "https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task"
```

**Option 2: Local (For Production)**
- Download model from: https://storage.googleapis.com/mediapipe-tasks/gesture_recognizer/gesture_recognizer.task
- Place in `web/public/models/gesture_recognizer.task`
- Update path: `modelAssetPath: "/models/gesture_recognizer.task"`

For this implementation, use **Option 1 (CDN)** to get started quickly.

### Troubleshooting

**Issue**: Camera permission denied
- **Solution**: Display error message with instructions to enable camera in browser settings

**Issue**: MediaPipe fails to initialize
- **Solution**: Check browser console for WASM loading errors, verify `/wasm` files are accessible

**Issue**: Landmarks don't align with video
- **Solution**: Ensure canvas dimensions exactly match video dimensions

**Issue**: Low FPS (<20)
- **Solution**: Check GPU acceleration is enabled, reduce video resolution if needed

**Issue**: Gestures not detected
- **Solution**: Ensure hand is fully visible in frame, check lighting conditions, verify model loaded successfully
