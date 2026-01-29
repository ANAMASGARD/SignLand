/**
 * SIMPLIFIED ASL Alphabet Detection
 * Uses basic hand shape patterns - VERY LENIENT for demo
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
  return tip.y < base.y - 0.03; // Very lenient - tip slightly above base
}

/**
 * Detect ASL letter using SIMPLE patterns
 * Returns a letter for almost any hand shape
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
  const thumbExt = Math.abs(thumbTip.x - thumbBase.x) > 0.04;
  
  // VERY SIMPLE PATTERNS - Just based on finger count
  
  // 0 fingers: A, E, M, N, S, T (default to A)
  if (extendedCount === 0) {
    return { letter: 'A', confidence: 0.8 };
  }
  
  // 1 finger extended
  if (extendedCount === 1) {
    if (indexExt) return { letter: 'D', confidence: 0.8 };
    if (middleExt) return { letter: 'K', confidence: 0.7 };
    if (ringExt) return { letter: 'R', confidence: 0.7 };
    if (pinkyExt) return { letter: 'I', confidence: 0.8 };
  }
  
  // 2 fingers extended
  if (extendedCount === 2) {
    if (indexExt && middleExt) {
      const spacing = dist(landmarks[8], landmarks[12]);
      if (spacing > 0.06) {
        return { letter: 'V', confidence: 0.8 };
      } else {
        return { letter: 'U', confidence: 0.7 };
      }
    }
    if (indexExt && thumbExt) return { letter: 'L', confidence: 0.8 };
    if (middleExt && ringExt) return { letter: 'H', confidence: 0.7 };
    return { letter: 'N', confidence: 0.6 };
  }
  
  // 3 fingers extended
  if (extendedCount === 3) {
    if (indexExt && middleExt && ringExt) {
      return { letter: 'W', confidence: 0.8 };
    }
    return { letter: 'M', confidence: 0.6 };
  }
  
  // 4 fingers extended
  if (extendedCount === 4) {
    const spacing = dist(landmarks[8], landmarks[12]) + dist(landmarks[12], landmarks[16]);
    if (spacing < 0.12) {
      return { letter: 'B', confidence: 0.8 };
    } else {
      return { letter: 'C', confidence: 0.7 };
    }
  }
  
  // Special cases
  if (thumbExt && pinkyExt && !indexExt && !middleExt && !ringExt) {
    return { letter: 'Y', confidence: 0.8 };
  }
  
  // Circle shape (O)
  const circle = dist(landmarks[4], landmarks[8]);
  if (circle < 0.08) {
    return { letter: 'O', confidence: 0.7 };
  }
  
  // Default: Return something based on finger count
  const letters = ['A', 'D', 'V', 'W', 'B'];
  return { letter: letters[extendedCount] || 'A', confidence: 0.5 };
}
