/**
 * MediaPipe Gesture Recognizer Configuration
 * 
 * This file initializes MediaPipe Tasks Vision for gesture recognition.
 * WASM files are served from /wasm (copied during build via next.config.ts)
 * Model file is served from /gesture_recognizer.task (local for offline support)
 */

import { FilesetResolver, GestureRecognizer } from '@mediapipe/tasks-vision';

let gestureRecognizer: GestureRecognizer | null = null;

/**
 * Initialize MediaPipe Gesture Recognizer
 * @returns Promise<GestureRecognizer>
 */
export async function initializeGestureRecognizer(): Promise<GestureRecognizer> {
  if (gestureRecognizer) {
    return gestureRecognizer;
  }

  // Load WASM files from /wasm (configured in next.config.ts)
  const vision = await FilesetResolver.forVisionTasks('/wasm');

  // Create gesture recognizer with local model for offline support
  gestureRecognizer = await GestureRecognizer.createFromOptions(vision, {
    baseOptions: {
      modelAssetPath: '/gesture_recognizer.task', // Local model file
      delegate: 'GPU', // Use GPU acceleration if available
    },
    runningMode: 'VIDEO', // For continuous video stream
    numHands: 2, // Detect up to 2 hands
  });

  return gestureRecognizer;
}

/**
 * Clean up gesture recognizer
 */
export function cleanupGestureRecognizer(): void {
  if (gestureRecognizer) {
    gestureRecognizer.close();
    gestureRecognizer = null;
  }
}

/**
 * Get current gesture recognizer instance
 */
export function getGestureRecognizer(): GestureRecognizer | null {
  return gestureRecognizer;
}
