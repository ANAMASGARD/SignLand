/**
 * Control Gesture Detection for Word Builder
 */

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface ControlGestureResult {
  gesture: 'SPACE' | 'PERIOD' | 'BACKSPACE' | null;
  holdProgress: number;
  confidence: number;
}

function dist(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

function isExt(lm: NormalizedLandmark[], base: number): boolean {
  return dist(lm[base + 3], lm[base]) > dist(lm[base + 1], lm[base]) * 1.3;
}

function isCurl(lm: NormalizedLandmark[], base: number): boolean {
  return dist(lm[base + 3], lm[0]) < dist(lm[base], lm[0]) * 1.2;
}

function isFlatHand(lm: NormalizedLandmark[]): number {
  // All fingers extended
  const allExt = isExt(lm, 5) && isExt(lm, 9) && isExt(lm, 13) && isExt(lm, 17);
  if (!allExt) return 0;

  // Fingers should be together (not spread)
  const together = dist(lm[8], lm[12]) < 0.1 && dist(lm[12], lm[16]) < 0.1;
  
  // Palm facing camera (z-depth check)
  const palmFacing = lm[9].z < lm[0].z + 0.05;

  return (together && palmFacing) ? 0.9 : 0.7;
}

function isClosedFist(lm: NormalizedLandmark[]): number {
  // All fingers curled
  const allCurl = isCurl(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17);
  if (!allCurl) return 0;

  // Thumb wrapped over fingers
  const thumbTip = lm[4];
  const indexMcp = lm[5];
  const thumbWrapped = dist(thumbTip, indexMcp) < 0.12 && thumbTip.z < indexMcp.z;

  return thumbWrapped ? 0.95 : 0.75;
}

function isThumbExtended(lm: NormalizedLandmark[]): number {
  // Thumb extended, other fingers curled
  const thumbExt = dist(lm[4], lm[2]) > 0.08;
  const othersCurl = isCurl(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17);
  
  return (thumbExt && othersCurl) ? 0.9 : 0;
}

function getThumbVelocity(current: NormalizedLandmark[], previous: NormalizedLandmark[] | null, deltaTime: number): number {
  if (!previous || deltaTime === 0) return 0;

  const currentThumb = current[4];
  const previousThumb = previous[4];

  // Calculate pixel velocity (assuming 640px width)
  const pixelDist = Math.abs(currentThumb.x - previousThumb.x) * 640;
  const velocity = pixelDist / (deltaTime / 1000); // pixels per second

  return velocity;
}

export function detectControlGesture(
  landmarks: NormalizedLandmark[],
  previousLandmarks: NormalizedLandmark[] | null,
  holdStartTime: number | null,
  currentTime: number,
  previousTime: number
): ControlGestureResult {
  if (!landmarks || landmarks.length !== 21) {
    return { gesture: null, holdProgress: 0, confidence: 0 };
  }

  const deltaTime = currentTime - previousTime;

  // BACKSPACE: Thumb extended + rapid shake (immediate, no hold)
  const thumbConf = isThumbExtended(landmarks);
  if (thumbConf > 0.85) {
    const velocity = getThumbVelocity(landmarks, previousLandmarks, deltaTime);
    if (velocity > 100) { // 100 pixels/second threshold
      return { gesture: 'BACKSPACE', holdProgress: 1, confidence: thumbConf };
    }
  }

  // SPACE: Flat hand held 1 second
  const flatConf = isFlatHand(landmarks);
  if (flatConf > 0.85) {
    const holdDuration = holdStartTime ? (currentTime - holdStartTime) / 1000 : 0;
    const progress = Math.min(holdDuration / 1.0, 1);
    return {
      gesture: progress >= 1 ? 'SPACE' : null,
      holdProgress: progress,
      confidence: flatConf
    };
  }

  // PERIOD: Closed fist held 2 seconds
  const fistConf = isClosedFist(landmarks);
  if (fistConf > 0.85) {
    const holdDuration = holdStartTime ? (currentTime - holdStartTime) / 1000 : 0;
    const progress = Math.min(holdDuration / 2.0, 1);
    return {
      gesture: progress >= 1 ? 'PERIOD' : null,
      holdProgress: progress,
      confidence: fistConf
    };
  }

  return { gesture: null, holdProgress: 0, confidence: 0 };
}
