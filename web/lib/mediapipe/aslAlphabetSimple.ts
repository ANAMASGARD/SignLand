/**
 * SIMPLIFIED ASL Alphabet Detection
 * Uses basic hand shape patterns that are easy to distinguish
 */

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface ASLDetectionResult {
  letter: string;
  confidence: number;
}

// Helper: Calculate distance
function dist(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

// Helper: Is finger extended (simple check)
function isExtended(lm: NormalizedLandmark[], fingerBase: number): boolean {
  const tip = lm[fingerBase + 3];
  const base = lm[fingerBase];
  return tip.y < base.y - 0.05; // Tip is above base
}

// Helper: Is finger curled (simple check)
function isCurled(lm: NormalizedLandmark[], fingerBase: number): boolean {
  return !isExtended(lm, fingerBase);
}

/**
 * Detect ASL letter using SIMPLE, RELIABLE patterns
 */
export function detectASLLetter(
  landmarks: NormalizedLandmark[],
  handedness: string = 'Right'
): ASLDetectionResult {
  if (!landmarks || landmarks.length !== 21) {
    return { letter: '', confidence: 0 };
  }

  // Finger bases: Index=5, Middle=9, Ring=13, Pinky=17
  const indexExt = isExtended(landmarks, 5);
  const middleExt = isExtended(landmarks, 9);
  const ringExt = isExtended(landmarks, 13);
  const pinkyExt = isExtended(landmarks, 17);
  
  // Count extended fingers
  const extendedCount = [indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length;
  
  // Thumb position
  const thumbTip = landmarks[4];
  const thumbBase = landmarks[2];
  const thumbExt = thumbTip.x > thumbBase.x + 0.05 || thumbTip.x < thumbBase.x - 0.05;
  
  // SIMPLE PATTERNS - Easy to distinguish
  
  // A: Fist (all fingers curled)
  if (extendedCount === 0) {
    return { letter: 'A', confidence: 0.9 };
  }
  
  // B: All 4 fingers extended, close together
  if (extendedCount === 4) {
    const spacing = dist(landmarks[8], landmarks[12]) + dist(landmarks[12], landmarks[16]);
    if (spacing < 0.15) {
      return { letter: 'B', confidence: 0.9 };
    }
  }
  
  // C: Curved hand (all fingers slightly curled)
  if (extendedCount === 0 || extendedCount === 4) {
    const curve = dist(landmarks[8], landmarks[20]);
    if (curve > 0.1 && curve < 0.25) {
      return { letter: 'C', confidence: 0.85 };
    }
  }
  
  // D: Only index extended
  if (indexExt && !middleExt && !ringExt && !pinkyExt) {
    return { letter: 'D', confidence: 0.9 };
  }
  
  // E: All fingers curled tight (like A but tighter)
  if (extendedCount === 0) {
    const tightness = dist(landmarks[8], landmarks[0]);
    if (tightness < 0.15) {
      return { letter: 'E', confidence: 0.85 };
    }
  }
  
  // F: Index curled, others extended
  if (!indexExt && middleExt && ringExt && pinkyExt) {
    return { letter: 'F', confidence: 0.9 };
  }
  
  // I: Only pinky extended
  if (!indexExt && !middleExt && !ringExt && pinkyExt) {
    return { letter: 'I', confidence: 0.9 };
  }
  
  // L: Index and thumb at 90 degrees
  if (indexExt && !middleExt && !ringExt && !pinkyExt && thumbExt) {
    return { letter: 'L', confidence: 0.9 };
  }
  
  // O: Circle shape (all fingertips close together)
  const circle = dist(landmarks[4], landmarks[8]) + 
                 dist(landmarks[8], landmarks[12]) + 
                 dist(landmarks[12], landmarks[16]) + 
                 dist(landmarks[16], landmarks[20]);
  if (circle < 0.3) {
    return { letter: 'O', confidence: 0.85 };
  }
  
  // V: Index and middle extended, separated
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    const vSpacing = dist(landmarks[8], landmarks[12]);
    if (vSpacing > 0.08) {
      return { letter: 'V', confidence: 0.9 };
    } else {
      return { letter: 'U', confidence: 0.85 }; // U is like V but together
    }
  }
  
  // W: Three fingers extended with spacing
  if (indexExt && middleExt && ringExt && !pinkyExt) {
    return { letter: 'W', confidence: 0.9 };
  }
  
  // Y: Thumb and pinky extended
  if (!indexExt && !middleExt && !ringExt && pinkyExt && thumbExt) {
    return { letter: 'Y', confidence: 0.9 };
  }
  
  // Default patterns based on finger count
  switch (extendedCount) {
    case 1:
      if (indexExt) return { letter: 'D', confidence: 0.7 };
      if (pinkyExt) return { letter: 'I', confidence: 0.7 };
      break;
    case 2:
      if (indexExt && middleExt) return { letter: 'V', confidence: 0.7 };
      if (indexExt && thumbExt) return { letter: 'L', confidence: 0.7 };
      break;
    case 3:
      if (indexExt && middleExt && ringExt) return { letter: 'W', confidence: 0.7 };
      break;
    case 4:
      return { letter: 'B', confidence: 0.7 };
  }
  
  // If nothing matches well, return empty
  return { letter: '', confidence: 0 };
}
