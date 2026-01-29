import type { GesturePhraseMap } from './types';

/**
 * Maps MediaPipe gesture names to spoken phrases
 * 
 * MediaPipe built-in gestures:
 * - Thumb_Up, Thumb_Down
 * - Victory (peace sign)
 * - Open_Palm
 * - Closed_Fist
 * - Pointing_Up
 * - ILoveYou
 */
export const GESTURE_PHRASE_MAP: GesturePhraseMap = {
  // Basic responses
  'Thumb_Up': 'Yes',
  'Thumb_Down': 'No',
  
  // Greetings
  'Open_Palm': 'Hello',
  'Victory': 'Peace',
  
  // Actions
  'Closed_Fist': 'Stop',
  'Pointing_Up': 'Look',
  
  // Expressions
  'ILoveYou': 'I love you',
};

/**
 * Extended phrase vocabulary (30 phrases)
 * These require motion detection and will be implemented in future version
 */
export const EXTENDED_PHRASES = {
  // Greetings & Politeness
  'HELLO': { gesture: 'Open_Palm', motion: 'wave', description: 'Open palm with wave motion' },
  'GOODBYE': { gesture: 'Open_Palm', motion: 'wave_away', description: 'Wave motion away from body' },
  'THANK_YOU': { gesture: 'Flat_Hand', motion: 'lips_forward', description: 'Fingers to lips then forward' },
  'PLEASE': { gesture: 'Flat_Hand', motion: 'circular_chest', description: 'Circular motion on chest' },
  'SORRY': { gesture: 'Closed_Fist', motion: 'circular_chest', description: 'Fist circle on chest' },
  'EXCUSE_ME': { gesture: 'Flat_Hand', motion: 'tap', description: 'Tap gesture' },
  
  // Needs & Requests
  'HELP': { gesture: 'Flat_Hand', motion: 'fist_lift', description: 'Flat hand on fist lift up' },
  'WATER': { gesture: 'W_Shape', motion: 'tap_chin', description: 'W shape tap chin' },
  'EAT': { gesture: 'Fingertips', motion: 'to_mouth', description: 'Fingertips to mouth' },
  'FOOD': { gesture: 'Fingertips', motion: 'to_mouth', description: 'Similar to eat' },
  'DRINK': { gesture: 'C_Shape', motion: 'to_mouth', description: 'C shape to mouth' },
  'MORE': { gesture: 'Fingertips', motion: 'tapping', description: 'Fingertips tapping together' },
  'FINISHED': { gesture: 'Flat_Hands', motion: 'flip_down', description: 'Hands flip palms down' },
  'BATHROOM': { gesture: 'T_Shape', motion: 'shake', description: 'T shape shake' },
  
  // Questions
  'WHERE': { gesture: 'Pointing', motion: 'questioning', description: 'Pointing with questioning motion' },
  'WHAT': { gesture: 'Palms_Up', motion: 'shrug', description: 'Palms up shrug' },
  'WHEN': { gesture: 'Finger_Circle', motion: 'point', description: 'Finger circle point' },
  'WHO': { gesture: 'Finger_Circle', motion: 'mouth', description: 'Finger circle at mouth' },
  'WHY': { gesture: 'Fingers', motion: 'forehead', description: 'Fingers to forehead' },
  'HOW': { gesture: 'Hands_Together', motion: 'apart', description: 'Hands together then apart' },
  
  // Emotions & States
  'GOOD': { gesture: 'Flat_Hand', motion: 'mouth_forward', description: 'Hand from mouth forward' },
  'BAD': { gesture: 'Flat_Hand', motion: 'mouth_down', description: 'Hand from mouth down throw' },
  'BEAUTIFUL': { gesture: 'Flat_Hand', motion: 'circle_face', description: 'Hand circle face' },
  'HAPPY': { gesture: 'Flat_Hands', motion: 'chest_pat', description: 'Double chest pat' },
  'SAD': { gesture: 'Flat_Hands', motion: 'down_face', description: 'Hands down face' },
  'SICK': { gesture: 'Flat_Hand', motion: 'forehead_stomach', description: 'Hand to forehead and stomach' },
  'TIRED': { gesture: 'Flat_Hands', motion: 'droop', description: 'Hands droop shoulders' },
  'HOT': { gesture: 'Flat_Hand', motion: 'mouth_out', description: 'Hand from mouth out' },
  'COLD': { gesture: 'Fists', motion: 'shiver', description: 'Shiver arms' },
  'LIKE': { gesture: 'Thumb_Middle', motion: 'pull_chest', description: 'Thumb middle finger pull from chest' },
  'DONT_LIKE': { gesture: 'Flat_Hand', motion: 'push_away', description: 'Hand push away' },
};

/**
 * Get phrase description for UI display
 */
export function getPhraseDescription(phraseName: string): string {
  const extended = EXTENDED_PHRASES[phraseName as keyof typeof EXTENDED_PHRASES];
  return extended ? extended.description : '';
}

/**
 * Get all available phrases for UI display
 */
export function getAllPhrases(): Array<{ name: string; description: string; implemented: boolean }> {
  const phrases: Array<{ name: string; description: string; implemented: boolean }> = [];
  
  // Currently implemented (MediaPipe built-in)
  Object.entries(GESTURE_PHRASE_MAP).forEach(([gesture, phrase]) => {
    phrases.push({
      name: phrase,
      description: `${gesture.replace('_', ' ')} gesture`,
      implemented: true
    });
  });
  
  // Extended phrases (future implementation)
  Object.entries(EXTENDED_PHRASES).forEach(([name, config]) => {
    phrases.push({
      name: name.replace('_', ' '),
      description: config.description,
      implemented: false
    });
  });
  
  return phrases;
}

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
