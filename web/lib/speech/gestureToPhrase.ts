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
 * @returns Phrase to speak, or null if gesture should not be spoken
 */
export function gestureToPhrase(gestureName: string): string | null {
  // Filter out invalid gestures
  if (!gestureName || gestureName === 'None' || gestureName === 'Unknown') {
    return null;
  }
  
  // Check if we have a mapping
  if (GESTURE_PHRASE_MAP[gestureName]) {
    return GESTURE_PHRASE_MAP[gestureName];
  }
  
  // Fallback: convert gesture name to readable format
  // "Thumb_Up" -> "Thumb Up"
  return gestureName.replace(/_/g, ' ');
}
