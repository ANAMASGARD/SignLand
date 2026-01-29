/**
 * Motion Tracking System for ASL Phrases
 * Tracks hand movement over time to detect motion-based gestures
 */

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface MotionFrame {
  landmarks: NormalizedLandmark[];
  timestamp: number;
}

export interface MotionHistory {
  frames: MotionFrame[];
  maxFrames: number;
}

/**
 * Create a new motion history tracker
 */
export function createMotionHistory(maxFrames: number = 30): MotionHistory {
  return {
    frames: [],
    maxFrames,
  };
}

/**
 * Add a frame to motion history
 */
export function addFrame(history: MotionHistory, landmarks: NormalizedLandmark[]): void {
  history.frames.push({
    landmarks,
    timestamp: Date.now(),
  });

  // Keep only last N frames
  if (history.frames.length > history.maxFrames) {
    history.frames.shift();
  }
}

/**
 * Calculate velocity between two frames
 */
export function calculateVelocity(
  frame1: MotionFrame,
  frame2: MotionFrame,
  landmarkIndex: number
): { x: number; y: number; z: number } {
  const dt = (frame2.timestamp - frame1.timestamp) / 1000; // seconds
  if (dt === 0) return { x: 0, y: 0, z: 0 };

  const p1 = frame1.landmarks[landmarkIndex];
  const p2 = frame2.landmarks[landmarkIndex];

  return {
    x: (p2.x - p1.x) / dt,
    y: (p2.y - p1.y) / dt,
    z: (p2.z - p1.z) / dt,
  };
}

/**
 * Detect side-to-side wave motion (for HELLO)
 */
export function detectWaveMotion(history: MotionHistory): boolean {
  if (history.frames.length < 15) return false;

  const wristIndex = 0; // Wrist landmark
  const recentFrames = history.frames.slice(-15);
  
  let directionChanges = 0;
  let lastDirection = 0;

  for (let i = 1; i < recentFrames.length; i++) {
    const velocity = calculateVelocity(recentFrames[i - 1], recentFrames[i], wristIndex);
    const currentDirection = Math.sign(velocity.x);

    if (currentDirection !== 0 && currentDirection !== lastDirection && lastDirection !== 0) {
      directionChanges++;
    }
    if (currentDirection !== 0) {
      lastDirection = currentDirection;
    }
  }

  // Wave should have at least 2 direction changes (left-right-left or right-left-right)
  return directionChanges >= 2 && Math.abs(lastDirection) > 0;
}

/**
 * Detect forward motion (for THANK YOU)
 */
export function detectForwardMotion(history: MotionHistory): boolean {
  if (history.frames.length < 10) return false;

  const wristIndex = 0;
  const recentFrames = history.frames.slice(-10);
  
  let totalZMovement = 0;
  let forwardFrames = 0;

  for (let i = 1; i < recentFrames.length; i++) {
    const velocity = calculateVelocity(recentFrames[i - 1], recentFrames[i], wristIndex);
    totalZMovement += velocity.z;
    
    // Z increases when moving toward camera
    if (velocity.z > 0.3) {
      forwardFrames++;
    }
  }

  // Consistent forward motion
  return forwardFrames >= 5 && totalZMovement > 1.5;
}

/**
 * Detect circular motion (for PLEASE)
 */
export function detectCircularMotion(history: MotionHistory): boolean {
  if (history.frames.length < 20) return false;

  const wristIndex = 0;
  const recentFrames = history.frames.slice(-20);
  
  // Calculate angles between consecutive movements
  let totalAngleChange = 0;
  let lastAngle = 0;

  for (let i = 2; i < recentFrames.length; i++) {
    const v1 = calculateVelocity(recentFrames[i - 2], recentFrames[i - 1], wristIndex);
    const v2 = calculateVelocity(recentFrames[i - 1], recentFrames[i], wristIndex);

    const angle1 = Math.atan2(v1.y, v1.x);
    const angle2 = Math.atan2(v2.y, v2.x);
    
    let angleDiff = angle2 - angle1;
    
    // Normalize to -π to π
    while (angleDiff > Math.PI) angleDiff -= 2 * Math.PI;
    while (angleDiff < -Math.PI) angleDiff += 2 * Math.PI;
    
    totalAngleChange += Math.abs(angleDiff);
  }

  // Full circle is ~2π radians (6.28), look for at least 270° (4.7 radians)
  return totalAngleChange > 4.7;
}

/**
 * Check if hand is in open palm position (for HELLO)
 */
export function isOpenPalm(landmarks: NormalizedLandmark[]): boolean {
  // Check if all fingers are extended
  const fingersExtended = [
    landmarks[8].y < landmarks[6].y,  // Index
    landmarks[12].y < landmarks[10].y, // Middle
    landmarks[16].y < landmarks[14].y, // Ring
    landmarks[20].y < landmarks[18].y, // Pinky
  ];

  return fingersExtended.filter(Boolean).length >= 3;
}

/**
 * Check if hand is in flat position (for THANK YOU and PLEASE)
 */
export function isFlatHand(landmarks: NormalizedLandmark[]): boolean {
  // All fingers should be close together and extended
  const fingersExtended = [
    landmarks[8].y < landmarks[6].y,
    landmarks[12].y < landmarks[10].y,
    landmarks[16].y < landmarks[14].y,
    landmarks[20].y < landmarks[18].y,
  ];

  // Check if fingers are close together (not spread)
  const fingerSpacing = Math.abs(landmarks[8].x - landmarks[12].x) + 
                        Math.abs(landmarks[12].x - landmarks[16].x);

  return fingersExtended.filter(Boolean).length >= 3 && fingerSpacing < 0.15;
}
