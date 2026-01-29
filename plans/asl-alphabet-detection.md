# Feature: ASL Alphabet Detection System

## Feature Description

Implement comprehensive ASL alphabet letter detection system that recognizes all 26 letters A-Z from hand landmarks using MediaPipe hand landmark coordinates. This extends SignLand's communication capabilities beyond basic gestures to allow letter-by-letter spelling of names, technical terms, and specific words.

## User Story

As a non-verbal user of SignLand
I want to spell words letter-by-letter using ASL alphabet
So that I can communicate specific names, words, and detailed messages beyond basic gestures

## Problem Statement

Current system only recognizes 7 basic gestures (thumbs up/down, peace, stop, wait, look, I love you). Users need to spell out names, technical terms, and specific words that don't have simple gesture equivalents.

## Solution Statement

Create a landmark-based ASL alphabet detection module that analyzes the 21 MediaPipe hand landmarks to identify each of the 26 ASL letters (A-Z) with high accuracy, supporting both left and right hands.

## Feature Metadata

- **Feature Type**: New Capability
- **Estimated Complexity**: High
- **Primary Systems Affected**: MediaPipe gesture recognition, Speech synthesis, GestureRecognizer component
- **Dependencies**: @mediapipe/tasks-vision (already installed)

---

## CONTEXT REFERENCES

### Relevant Codebase Files - MUST READ BEFORE IMPLEMENTING!

1. `web/lib/mediapipe/types.ts` - MediaPipe type definitions
2. `web/lib/mediapipe/drawLandmarks.ts` - Hand landmark visualization
3. `web/components/GestureRecognizer.tsx` - Main gesture recognition component
4. `web/lib/speech/gestureToPhrase.ts` - Current gesture mapping pattern
5. `web/hooks/useMediaPipe.ts` - MediaPipe hook

### New Files to Create

1. `web/lib/mediapipe/aslAlphabet.ts` - ASL alphabet detection logic
2. `web/lib/speech/letterToPhrase.ts` - Letter-to-speech mapping

### Patterns to Follow

**Naming**: camelCase for functions, PascalCase for types
**Imports**: `import type { X } from '@mediapipe/tasks-vision';`
**Error handling**: Early returns with default values

---

## STEP-BY-STEP TASKS

### Task 1: CREATE `web/lib/mediapipe/aslAlphabet.ts`

**IMPLEMENT**: Complete ASL alphabet detection module

**LANDMARK INDICES**:
- 0: WRIST
- 1-4: THUMB (CMC, MCP, IP, TIP)
- 5-8: INDEX (MCP, PIP, DIP, TIP)
- 9-12: MIDDLE (MCP, PIP, DIP, TIP)
- 13-16: RING (MCP, PIP, DIP, TIP)
- 17-20: PINKY (MCP, PIP, DIP, TIP)

**STRUCTURE**:
- Helper functions: distance(), isFingerExtended(), isFingerCurled(), getAngle()
- 26 letter detection functions: detectA() through detectZ()
- Main function: detectASLLetter(landmarks, handedness)

**KEY DETECTION RULES**:
- A: Closed fist, thumb on side
- B: Flat hand, fingers together, thumb across palm
- C: Curved hand (C shape)
- D: Index extended, others curled, thumb touches middle
- E: All fingers curled, thumb over
- F: Index curled touching thumb, others extended
- G: Index and thumb extended horizontally
- H: Index and middle extended horizontally together
- I: Only pinky extended
- L: Index and thumb at 90 degrees
- M: Three fingers extended (index, middle, ring)
- N: Two fingers extended (index, middle)
- O: All fingers forming circle
- R: Index and middle crossed
- S: Fist with thumb across front
- T: Fist with thumb between index and middle
- U: Index and middle together extended
- V: Index and middle in V shape
- W: Three fingers spread
- Y: Thumb and pinky extended

**VALIDATE**: `cd web && npx tsc --noEmit`

### Task 2: CREATE `web/lib/speech/letterToPhrase.ts`

**IMPLEMENT**: Convert letters to speakable format

```typescript
export function letterToPhrase(letter: string): string {
  return `Letter ${letter}`;
}
```

**VALIDATE**: `cd web && npx tsc --noEmit`

### Task 3: UPDATE `web/lib/mediapipe/index.ts`

**ADD**: Export ASL detection
```typescript
export { detectASLLetter } from './aslAlphabet';
export type { ASLDetectionResult } from './aslAlphabet';
```

**VALIDATE**: `cd web && npx tsc --noEmit`

### Task 4: UPDATE `web/lib/speech/index.ts`

**ADD**: Export letter phrase function
```typescript
export { letterToPhrase } from './letterToPhrase';
```

**VALIDATE**: `cd web && npx tsc --noEmit`

### Task 5: UPDATE `web/components/GestureRecognizer.tsx`

**ADD**: Import ASL detection
```typescript
import { detectASLLetter, type ASLDetectionResult } from '@/lib/mediapipe/aslAlphabet';
import { letterToPhrase } from '@/lib/speech';
```

**ADD**: State for letter detection
```typescript
const [detectedLetter, setDetectedLetter] = useState<string>('');
const [letterHistory, setLetterHistory] = useState<string[]>([]);
```

**MODIFY**: Detection loop to include ASL letters
- Check for ASL letters when no gesture detected
- Use same debounce logic as gestures
- Accumulate letters in history

**VALIDATE**: `cd web && npm run dev` - no errors

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
1. `cd web && npm run dev`
2. Navigate to http://localhost:3000/translate
3. Test letters A, B, C, L, V, Y
4. Verify speech output
5. Check letter accumulation

---

## ACCEPTANCE CRITERIA

- [ ] All 26 letters have detection functions
- [ ] Landmark-based analysis implemented
- [ ] Both hands supported (mirroring)
- [ ] Confidence scoring (0-1 range)
- [ ] Integration with GestureRecognizer
- [ ] Speech synthesis for letters
- [ ] UI displays detected letters
- [ ] TypeScript compilation passes
- [ ] Manual testing confirms accuracy

---

## NOTES

**Design Decisions**:
- Geometric analysis over ML for transparency
- Confidence threshold: 0.6
- Fallback detection (only when no gesture)

**Risks**:
- Similar letters (A/S/T, M/N, U/V) may confuse
- Performance: 26 functions per frame
- Motion letters (J, Z) have lower confidence

**Confidence Score**: 8/10 for one-pass success
