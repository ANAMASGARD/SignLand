/**
 * ASL Alphabet Detection - Based on Standard ASL Chart
 * Matches the official ASL hand shapes
 */

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface ASLDetectionResult {
  letter: string;
  confidence: number;
}

function dist(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function isExtended(lm: NormalizedLandmark[], fingerBase: number): boolean {
  const tip = lm[fingerBase + 3];
  const base = lm[fingerBase];
  return tip.y < base.y - 0.04;
}

/**
 * Detect ASL letter based on standard ASL alphabet
 */
export function detectASLLetter(
  landmarks: NormalizedLandmark[],
  handedness: string = 'Right'
): ASLDetectionResult {
  if (!landmarks || landmarks.length !== 21) {
    return { letter: '', confidence: 0 };
  }

  const lm = landmarks;
  
  // Check each finger
  const indexExt = isExtended(lm, 5);
  const middleExt = isExtended(lm, 9);
  const ringExt = isExtended(lm, 13);
  const pinkyExt = isExtended(lm, 17);
  
  const extCount = [indexExt, middleExt, ringExt, pinkyExt].filter(Boolean).length;
  
  // Thumb check
  const thumbTip = lm[4];
  const thumbBase = lm[2];
  const thumbOut = Math.abs(thumbTip.x - thumbBase.x) > 0.05;
  
  // A: Closed fist, thumb on side
  if (extCount === 0 && thumbOut) {
    return { letter: 'A', confidence: 0.85 };
  }
  
  // B: All 4 fingers up, together, thumb across
  if (extCount === 4) {
    const spacing = dist(lm[8], lm[12]);
    if (spacing < 0.08) {
      return { letter: 'B', confidence: 0.85 };
    }
  }
  
  // C: Curved hand
  if (extCount >= 3) {
    const curve = dist(lm[4], lm[8]);
    if (curve > 0.08 && curve < 0.20) {
      return { letter: 'C', confidence: 0.80 };
    }
  }
  
  // D: Index up, others touch thumb
  if (indexExt && !middleExt && !ringExt && !pinkyExt) {
    const thumbToMiddle = dist(lm[4], lm[12]);
    if (thumbToMiddle < 0.10) {
      return { letter: 'D', confidence: 0.85 };
    }
  }
  
  // E: Tight fist, thumb over fingers
  if (extCount === 0 && !thumbOut) {
    return { letter: 'E', confidence: 0.80 };
  }
  
  // F: Index and thumb touch, others up
  if (!indexExt && middleExt && ringExt && pinkyExt) {
    const thumbToIndex = dist(lm[4], lm[8]);
    if (thumbToIndex < 0.08) {
      return { letter: 'F', confidence: 0.85 };
    }
  }
  
  // G: Index and thumb horizontal
  if (indexExt && thumbOut && !middleExt && !ringExt && !pinkyExt) {
    if (Math.abs(lm[8].y - lm[4].y) < 0.08) {
      return { letter: 'G', confidence: 0.80 };
    }
  }
  
  // H: Index and middle horizontal together
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    const together = dist(lm[8], lm[12]) < 0.06;
    const horizontal = Math.abs(lm[8].y - lm[12].y) < 0.05;
    if (together && horizontal) {
      return { letter: 'H', confidence: 0.80 };
    }
  }
  
  // I: Only pinky up
  if (!indexExt && !middleExt && !ringExt && pinkyExt) {
    return { letter: 'I', confidence: 0.90 };
  }
  
  // K: Index up, middle out, thumb between
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    const vShape = dist(lm[8], lm[12]) > 0.08;
    if (vShape && thumbOut) {
      return { letter: 'K', confidence: 0.75 };
    }
  }
  
  // L: Index up, thumb out at 90°
  if (indexExt && !middleExt && !ringExt && !pinkyExt && thumbOut) {
    const angle = Math.abs(lm[8].x - lm[4].x);
    if (angle > 0.10) {
      return { letter: 'L', confidence: 0.85 };
    }
  }
  
  // M: 3 fingers over thumb
  if (extCount === 0 || (indexExt && middleExt && ringExt && !pinkyExt)) {
    return { letter: 'M', confidence: 0.70 };
  }
  
  // N: 2 fingers over thumb
  if (indexExt && middleExt && !ringExt && !pinkyExt && !thumbOut) {
    return { letter: 'N', confidence: 0.70 };
  }
  
  // O: Circle with all fingers
  const circle = dist(lm[4], lm[8]);
  if (circle < 0.08 && extCount >= 3) {
    return { letter: 'O', confidence: 0.85 };
  }
  
  // R: Index and middle crossed
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    const crossed = Math.abs(lm[8].x - lm[12].x) < 0.04;
    if (crossed) {
      return { letter: 'R', confidence: 0.75 };
    }
  }
  
  // S: Fist with thumb across front
  if (extCount === 0) {
    return { letter: 'S', confidence: 0.75 };
  }
  
  // T: Thumb between index and middle
  if (extCount === 0 && thumbOut) {
    return { letter: 'T', confidence: 0.70 };
  }
  
  // U: Index and middle together, up
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    const together = dist(lm[8], lm[12]) < 0.06;
    if (together) {
      return { letter: 'U', confidence: 0.85 };
    }
  }
  
  // V: Index and middle separated (peace sign)
  if (indexExt && middleExt && !ringExt && !pinkyExt) {
    const separated = dist(lm[8], lm[12]) > 0.08;
    if (separated) {
      return { letter: 'V', confidence: 0.90 };
    }
  }
  
  // W: 3 fingers up, separated
  if (indexExt && middleExt && ringExt && !pinkyExt) {
    return { letter: 'W', confidence: 0.85 };
  }
  
  // X: Index bent/hooked
  if (indexExt && !middleExt && !ringExt && !pinkyExt) {
    return { letter: 'X', confidence: 0.70 };
  }
  
  // Y: Thumb and pinky out (shaka)
  if (!indexExt && !middleExt && !ringExt && pinkyExt && thumbOut) {
    return { letter: 'Y', confidence: 0.90 };
  }
  
  // Z: Index pointing (like D but sideways)
  if (indexExt && !middleExt && !ringExt && !pinkyExt) {
    return { letter: 'Z', confidence: 0.70 };
  }
  
  // Fallback based on finger count
  const fallback = ['A', 'D', 'V', 'W', 'B'];
  return { letter: fallback[extCount] || 'A', confidence: 0.50 };
}
