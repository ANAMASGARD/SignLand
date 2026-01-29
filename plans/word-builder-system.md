# Feature: ASL Word Builder System

## Feature Description

Silent letter accumulation system where letters are added to a word buffer without speaking. Control gestures commit words to sentences and manage the buffer. Only complete words are spoken, not individual letters.

## User Story

As a non-verbal user spelling with ASL alphabet
I want to build complete words silently before speaking them
So that I can compose sentences naturally without hearing every letter

## Solution

**Word Building Flow**:
1. Sign letters → Add to word buffer (silent, visual only)
2. Flat hand (1s) → SPACE: Speak word, add to sentence, clear word buffer
3. Closed fist (2s) → PERIOD: Speak full sentence, clear everything
4. Thumb shake → BACKSPACE: Remove last letter

**Audio Feedback**:
- Letter add: Beep sound
- Word commit: Whoosh sound
- Complete words/sentences: Speech synthesis

## STEP-BY-STEP TASKS

### Task 1: CREATE `web/lib/audio/soundEffects.ts`

**IMPLEMENT**: Sound effect utilities
```typescript
export function playBeep(): void
export function playWhoosh(): void
```

### Task 2: CREATE `web/lib/mediapipe/controlGestures.ts`

**IMPLEMENT**: Control gesture detection
```typescript
interface ControlGestureResult {
  gesture: 'SPACE' | 'PERIOD' | 'BACKSPACE' | null;
  holdProgress: number; // 0-1 for timer bar
}

export function detectControlGesture(
  landmarks: NormalizedLandmark[],
  previousLandmarks: NormalizedLandmark[] | null,
  holdStartTime: number | null
): ControlGestureResult
```

**Detection Rules**:
- SPACE: Flat hand (all fingers extended) held 1 second
- PERIOD: Closed fist held 2 seconds
- BACKSPACE: Thumb extended + left-right shake motion

### Task 3: UPDATE `web/components/GestureRecognizer.tsx`

**ADD**: Word builder state
```typescript
const [wordBuffer, setWordBuffer] = useState<string>('');
const [sentenceBuffer, setSentenceBuffer] = useState<string[]>([]);
const [controlGestureHoldStart, setControlGestureHoldStart] = useState<number | null>(null);
const [controlGestureProgress, setControlGestureProgress] = useState<number>(0);
```

**MODIFY**: Letter detection to NOT speak
```typescript
// When letter detected in alphabet mode:
if (aslResult.letter) {
  setWordBuffer(prev => prev + aslResult.letter);
  playBeep();
  // NO speak() call
}
```

**ADD**: Control gesture handling
```typescript
const controlResult = detectControlGesture(landmarks, prevLandmarks, holdStart);

if (controlResult.gesture === 'SPACE' && controlResult.holdProgress >= 1) {
  // Commit word
  if (wordBuffer) {
    speak(wordBuffer);
    setSentenceBuffer(prev => [...prev, wordBuffer]);
    setWordBuffer('');
    playWhoosh();
  }
}
// Similar for PERIOD and BACKSPACE
```

### Task 4: UPDATE UI with word builder display

**ADD**: Word builder panel
```typescript
<div className="word-builder-panel">
  <div className="current-word">
    {wordBuffer || 'Start spelling...'}
  </div>
  <div className="sentence-buffer">
    {sentenceBuffer.join(' ')}
  </div>
  {controlGestureProgress > 0 && (
    <div className="hold-timer">
      <div style={{ width: `${controlGestureProgress * 100}%` }} />
    </div>
  )}
</div>
```

## VALIDATION

```bash
cd web && npx tsc --noEmit
cd web && npm run dev
```

## ACCEPTANCE CRITERIA

- [ ] Letters add to word buffer silently (no speech)
- [ ] Beep sound on letter add
- [ ] Flat hand (1s) commits word with whoosh sound
- [ ] Closed fist (2s) speaks full sentence
- [ ] Thumb shake removes last letter
- [ ] Visual timer bars for hold gestures
- [ ] Real-time UI shows word and sentence buffers
- [ ] Only complete words/sentences are spoken

---

**Estimated Time**: 1 hour
**Complexity**: Medium
**Confidence**: 8/10
