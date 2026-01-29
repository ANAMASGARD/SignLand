# Feature: ASL Common Phrase Recognition

## Feature Description

Implement recognition for 20 essential ASL phrases beyond the alphabet, including both static poses and dynamic motion sequences. This extends SignLand's communication capabilities to include common conversational phrases like HELLO, THANK_YOU, PLEASE, and question words.

## User Story

As a non-verbal user of SignLand
I want to use common ASL phrases for everyday communication
So that I can have natural conversations without spelling every word letter-by-letter

## Problem Statement

Current system has:
- 7 basic MediaPipe gestures (thumbs up/down, peace, stop, etc.)
- 26 ASL alphabet letters (static detection only)
- No support for common ASL phrases
- No motion tracking for dynamic gestures

Users need common phrases like HELLO (wave), THANK_YOU (hand from lips), PLEASE (circular motion) that require motion detection across multiple frames.

## Solution Statement

Create a motion-aware ASL phrase detection system that:
1. Tracks hand landmarks across multiple frames for motion analysis
2. Detects 20 essential ASL phrases (static + dynamic)
3. Prioritizes phrase detection over letter detection
4. Integrates seamlessly with existing gesture/letter detection

## Feature Metadata

- **Feature Type**: New Capability
- **Estimated Complexity**: High
- **Primary Systems Affected**: MediaPipe detection, Motion tracking, Speech synthesis
- **Dependencies**: @mediapipe/tasks-vision (already installed)

---

## CONTEXT REFERENCES

### Relevant Codebase Files - MUST READ!

1. **`web/lib/mediapipe/aslAlphabet.ts`** - ASL letter detection pattern
   - Helper functions: dist(), isExt(), isCurl()
   - Detection pattern with confidence scoring
   - Handedness support

2. **`web/components/GestureRecognizer.tsx`** - Main detection component
   - Frame-by-frame processing loop
   - Detection mode switching
   - Speech synthesis integration

3. **`web/lib/speech/gestureToPhrase.ts`** - Current phrase mapping
   - Simple gesture-to-phrase conversion
   - Pattern to follow for phrase output

4. **`web/hooks/useMediaPipe.ts`** - MediaPipe lifecycle
   - How recognizer is initialized
   - VIDEO mode for continuous processing

### New Files to Create

1. **`web/lib/mediapipe/aslPhrases.ts`** - ASL phrase detection logic
   - Motion tracking utilities
   - 20 phrase detection functions
   - Frame history management

2. **`web/lib/mediapipe/motionTracker.ts`** - Motion analysis utilities
   - Track landmarks across frames
   - Detect wave, circular, forward motions
   - Calculate velocity and direction

3. **`web/types/motion.types.ts`** - Motion tracking types
   - MotionHistory interface
   - PhraseDetectionResult interface

### Patterns to Follow

**Detection Pattern** (from aslAlphabet.ts):
```typescript
function detectPhrase(lm: NormalizedLandmark[], motion?: MotionHistory): number {
  // Check static pose
  // Check motion if required
  // Return confidence 0-1
}
```

**Integration Pattern** (from GestureRecognizer.tsx):
```typescript
// Priority: Phrases > Gestures > Letters
if (phraseResult.confidence > 0.7) {
  // Use phrase
} else if (gestureResult) {
  // Use gesture
} else if (letterResult) {
  // Use letter
}
```

---

## IMPLEMENTATION PLAN

### Phase 1: Motion Tracking Infrastructure

Build frame history and motion analysis utilities:
- Store last N frames of landmarks
- Calculate velocity, direction, trajectory
- Detect motion patterns (wave, circle, forward)

### Phase 2: Static Phrase Detection

Implement phrases with static poses:
- YES (fist nod - detect fist + Y position change)
- NO (fingers snap - detect hand closing motion)
- GOOD (thumb up variant)
- BAD (thumb down variant)
- MORE (fingertips together)
- EAT (fingers to mouth)
- WATER (W shape to mouth)
- TOILET (T shape shaking)

### Phase 3: Dynamic Phrase Detection

Implement phrases requiring motion:
- HELLO (wave - hand side-to-side motion)
- THANK_YOU (hand from lips forward)
- PLEASE (circular motion on chest)
- SORRY (circular motion on chest, fist)
- HELP (thumbs up, upward motion)

### Phase 4: Question Word Detection

Implement WH-question words:
- WHERE (pointing, side-to-side)
- WHEN (index finger, circular)
- WHO (index finger at chin, circular)
- WHAT (hands apart, palms up)
- WHY (middle finger at forehead)
- HOW (hands together, rotating)

### Phase 5: Integration & Prioritization

Connect to existing system with proper priority:
1. Check for ASL phrases (highest priority)
2. Check for MediaPipe gestures
3. Check for ASL letters (lowest priority)

---

## STEP-BY-STEP TASKS

### Task 1: CREATE `web/lib/mediapipe/motionTracker.ts`

**IMPLEMENT**: Motion tracking utilities

**STRUCTURE**:
```typescript
interface MotionFrame {
  landmarks: NormalizedLandmark[];
  timestamp: number;
}

interface MotionHistory {
  frames: MotionFrame[];
  maxFrames: number;
}

// Functions:
- createMotionHistory(maxFrames: number): MotionHistory
- addFrame(history, landmarks, timestamp): void
- getVelocity(history, landmarkIndex): Vector3D
- getTrajectory(history, landmarkIndex): Vector3D[]
- detectWaveMotion(history): number (confidence)
- detectCircularMotion(history): number
- detectForwardMotion(history): number
```

**VALIDATE**: `cd web && npx tsc --noEmit`

### Task 2: CREATE `web/lib/mediapipe/aslPhrases.ts`

**IMPLEMENT**: 20 ASL phrase detectors

**STRUCTURE**:
```typescript
export interface ASLPhraseResult {
  phrase: string;
  confidence: number;
  requiresMotion: boolean;
}

// Static phrases (8)
- detectYes(lm, motion): number
- detectNo(lm, motion): number
- detectGood(lm): number
- detectBad(lm): number
- detectMore(lm): number
- detectEat(lm): number
- detectWater(lm): number
- detectToilet(lm): number

// Dynamic phrases (7)
- detectHello(lm, motion): number
- detectThankYou(lm, motion): number
- detectPlease(lm, motion): number
- detectSorry(lm, motion): number
- detectHelp(lm, motion): number

// Question words (5)
- detectWhere(lm, motion): number
- detectWhen(lm, motion): number
- detectWho(lm, motion): number
- detectWhat(lm): number
- detectWhy(lm): number
- detectHow(lm, motion): number

// Main function
- detectASLPhrase(landmarks, motion, handedness): ASLPhraseResult
```

**KEY DETECTION RULES**:
- **HELLO**: Open palm + wave motion (side-to-side)
- **THANK_YOU**: Flat hand at lips + forward motion
- **PLEASE**: Flat hand + circular motion on chest
- **YES**: Fist + nodding motion (Y-axis change)
- **NO**: Flat hand + fingers closing motion
- **SORRY**: Fist + circular motion on chest
- **HELP**: Thumbs up + upward motion
- **WATER**: W shape + tap to mouth
- **EAT**: Fingertips together + to mouth
- **MORE**: Fingertips together, both hands
- **TOILET**: T shape + shaking motion
- **WHERE**: Index pointing + side-to-side
- **WHEN**: Index finger + circular motion
- **WHO**: Index at chin + circular
- **WHAT**: Hands apart, palms up
- **WHY**: Middle finger at forehead
- **HOW**: Hands together + rotating
- **GOOD**: Flat hand at chin + forward
- **BAD**: Flat hand at chin + down/away

**VALIDATE**: `cd web && npx tsc --noEmit`

### Task 3: UPDATE `web/components/GestureRecognizer.tsx`

**ADD**: Motion history state
```typescript
const motionHistoryRef = useRef<MotionHistory>(createMotionHistory(30)); // 30 frames ~1 second
```

**MODIFY**: Detection loop to track motion
```typescript
// In detectGestures function, after getting results:
if (gestureResults.landmarks?.[0]) {
  addFrame(motionHistoryRef.current, gestureResults.landmarks[0], timestamp);
}
```

**MODIFY**: Detection priority logic
```typescript
// Priority: Phrases > Gestures > Letters
const phraseResult = detectASLPhrase(
  results.landmarks[0], 
  motionHistoryRef.current,
  handedness
);

if (phraseResult.confidence > 0.7) {
  // Use phrase
  setCurrentPhrase(phraseResult.phrase);
  speak(phraseResult.phrase);
} else if (results.gestures?.[0]?.[0]?.score > 0.7) {
  // Use MediaPipe gesture
} else if (detectionMode === 'letter') {
  // Use letter detection
}
```

**VALIDATE**: `cd web && npm run dev`

### Task 4: UPDATE `web/lib/mediapipe/index.ts`

**ADD**: Export phrase detection
```typescript
export { detectASLPhrase } from './aslPhrases';
export { createMotionHistory, addFrame } from './motionTracker';
export type { ASLPhraseResult } from './aslPhrases';
export type { MotionHistory } from './motionTracker';
```

**VALIDATE**: `cd web && npx tsc --noEmit`

### Task 5: UPDATE UI for phrase mode

**ADD**: Detection mode option for phrases
```typescript
const [detectionMode, setDetectionMode] = useState<'gesture' | 'letter' | 'phrase'>('phrase');
```

**ADD**: Mode toggle buttons
```typescript
<button onClick={() => setDetectionMode('phrase')}>
  Common Phrases
</button>
```

**ADD**: Phrase indicator in results panel
```typescript
{phraseResult && (
  <div className="phrase-indicator">
    <span>Phrase: {phraseResult.phrase}</span>
    <span>Confidence: {phraseResult.confidence}</span>
  </div>
)}
```

**VALIDATE**: UI renders correctly

---

## TESTING STRATEGY

### Unit Tests (Future)
- Test motion detection algorithms
- Test each phrase detector with mock data
- Test priority logic

### Manual Testing

**Static Phrases**:
1. YES - Make fist, nod up/down
2. NO - Flat hand, close fingers
3. GOOD - Flat hand at chin, move forward
4. BAD - Flat hand at chin, move down
5. MORE - Fingertips together
6. EAT - Fingertips to mouth
7. WATER - W shape to mouth
8. TOILET - T shape, shake

**Dynamic Phrases**:
1. HELLO - Open palm, wave side-to-side
2. THANK_YOU - Flat hand at lips, move forward
3. PLEASE - Flat hand on chest, circular motion
4. SORRY - Fist on chest, circular motion
5. HELP - Thumbs up, move upward

**Question Words**:
1. WHERE - Point, move side-to-side
2. WHEN - Index finger, circular motion
3. WHO - Index at chin, circular
4. WHAT - Hands apart, palms up
5. WHY - Middle finger at forehead
6. HOW - Hands together, rotate

### Edge Cases
- Rapid phrase changes
- Similar phrases (PLEASE vs SORRY)
- Motion too fast or too slow
- Partial motion completion

---

## VALIDATION COMMANDS

### Level 1: Type Checking
```bash
cd web && npx tsc --noEmit
```

### Level 2: Build
```bash
cd web && npm run build
```

### Level 3: Manual Testing
1. Start dev server: `cd web && npm run dev`
2. Navigate to http://localhost:3000/translate
3. Test each phrase category
4. Verify motion detection works
5. Check priority logic (phrases > gestures > letters)

---

## ACCEPTANCE CRITERIA

- [ ] 20 ASL phrases implemented with detection functions
- [ ] Motion tracking system captures 30 frames (~1 second)
- [ ] Wave, circular, and forward motions detected
- [ ] Static and dynamic phrases both supported
- [ ] Phrase detection prioritized over letter detection
- [ ] Speech synthesis speaks detected phrases
- [ ] UI shows detected phrase with confidence
- [ ] No regressions in existing gesture/letter detection
- [ ] TypeScript compilation passes
- [ ] Manual testing confirms accuracy for common phrases

---

## COMPLETION CHECKLIST

- [ ] motionTracker.ts created with frame history
- [ ] aslPhrases.ts created with 20 phrase detectors
- [ ] GestureRecognizer updated with motion tracking
- [ ] Detection priority logic implemented
- [ ] UI updated with phrase mode
- [ ] All exports added to index files
- [ ] Type checking passes
- [ ] Manual testing completed
- [ ] Documentation updated

---

## NOTES

### Design Decisions

1. **Motion History**: 30 frames (~1 second at 30 FPS)
   - Enough for wave, circular motions
   - Not too much memory overhead

2. **Priority Order**: Phrases > Gestures > Letters
   - Phrases are most expressive
   - Prevents letter detection interfering with phrases
   - User can still switch modes explicitly

3. **Confidence Threshold**: 0.7 for phrases
   - Higher than letters (0.6) due to motion complexity
   - Reduces false positives

4. **Motion Detection**: Velocity + trajectory analysis
   - Wave: Side-to-side X movement
   - Circular: Consistent angular motion
   - Forward: Z-axis movement toward camera

### Implementation Risks

1. **Motion Detection Accuracy**: Dynamic gestures harder than static
   - Mitigation: Use multiple motion indicators
   - Mitigation: Tune thresholds per phrase

2. **Performance**: Tracking 30 frames + 20 detectors per frame
   - Mitigation: Early returns in detection functions
   - Mitigation: Only track when in phrase mode

3. **Similar Phrases**: PLEASE vs SORRY (both circular on chest)
   - Mitigation: Check hand shape (flat vs fist)
   - Mitigation: Different motion speeds

4. **Frame Rate Dependency**: Motion detection assumes 30 FPS
   - Mitigation: Use timestamps, not frame counts
   - Mitigation: Normalize by time delta

### Future Enhancements

- Phrase combinations (e.g., "THANK YOU" + "VERY MUCH")
- User-customizable phrases
- Phrase practice mode with visual feedback
- Slow-motion replay for learning
- Phrase difficulty ratings

---

**Confidence Score**: 7/10 for one-pass implementation success

**Challenges**:
- Motion detection is complex
- Requires careful tuning
- More testing needed than static detection

**Plan saved to**: `plans/asl-phrase-recognition.md`
