/**
 * ASL Motion-Based Phrase Detection
 * Detects phrases that require hand movement (HELLO, THANK YOU, PLEASE)
 */

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';
import {
  type MotionHistory,
  detectWaveMotion,
  detectForwardMotion,
  detectCircularMotion,
  isOpenPalm,
  isFlatHand,
} from './motionTracker';

export interface ASLPhraseResult {
  phrase: string;
  confidence: number;
}

/**
 * Detect HELLO gesture (wave side-to-side with open palm)
 */
export function detectHello(
  landmarks: NormalizedLandmark[],
  motionHistory: MotionHistory
): ASLPhraseResult | null {
  // Check hand shape: open palm
  if (!isOpenPalm(landmarks)) {
    return null;
  }

  // Check motion: side-to-side wave
  if (detectWaveMotion(motionHistory)) {
    return {
      phrase: 'HELLO',
      confidence: 0.85,
    };
  }

  return null;
}

/**
 * Detect THANK YOU gesture (flat hand moves from chin forward)
 */
export function detectThankYou(
  landmarks: NormalizedLandmark[],
  motionHistory: MotionHistory
): ASLPhraseResult | null {
  // Check hand shape: flat hand
  if (!isFlatHand(landmarks)) {
    return null;
  }

  // Check if hand starts near chin (wrist Y position should be high)
  const wrist = landmarks[0];
  const isNearChin = wrist.y < 0.3; // Upper part of frame

  if (!isNearChin) {
    return null;
  }

  // Check motion: forward movement
  if (detectForwardMotion(motionHistory)) {
    return {
      phrase: 'THANK_YOU',
      confidence: 0.80,
    };
  }

  return null;
}

/**
 * Detect PLEASE gesture (flat hand circular motion on chest)
 */
export function detectPlease(
  landmarks: NormalizedLandmark[],
  motionHistory: MotionHistory
): ASLPhraseResult | null {
  // Check hand shape: flat hand
  if (!isFlatHand(landmarks)) {
    return null;
  }

  // Check if hand is in chest area (middle of frame)
  const wrist = landmarks[0];
  const isInChestArea = wrist.y > 0.3 && wrist.y < 0.7;

  if (!isInChestArea) {
    return null;
  }

  // Check motion: circular
  if (detectCircularMotion(motionHistory)) {
    return {
      phrase: 'PLEASE',
      confidence: 0.75,
    };
  }

  return null;
}

/**
 * Detect all motion-based ASL phrases
 * Priority: Check in order of likelihood
 */
export function detectASLPhrase(
  landmarks: NormalizedLandmark[],
  motionHistory: MotionHistory
): ASLPhraseResult | null {
  // Try HELLO first (most common greeting)
  const hello = detectHello(landmarks, motionHistory);
  if (hello) return hello;

  // Try THANK YOU
  const thankYou = detectThankYou(landmarks, motionHistory);
  if (thankYou) return thankYou;

  // Try PLEASE
  const please = detectPlease(landmarks, motionHistory);
  if (please) return please;

  return null;
}
