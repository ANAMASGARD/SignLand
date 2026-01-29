/**
 * ASL Alphabet Detection using MediaPipe Hand Landmarks
 * Analyzes 21 hand landmarks to detect ASL letters A-Z
 */

import type { NormalizedLandmark } from '@mediapipe/tasks-vision';

export interface ASLDetectionResult {
  letter: string;
  confidence: number;
}

// Helper: Calculate distance between two landmarks
function dist(a: NormalizedLandmark, b: NormalizedLandmark): number {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2 + (a.z - b.z) ** 2);
}

// Helper: Get angle between three points (in degrees)
function getAngle(a: NormalizedLandmark, b: NormalizedLandmark, c: NormalizedLandmark): number {
  const ba = { x: a.x - b.x, y: a.y - b.y };
  const bc = { x: c.x - b.x, y: c.y - b.y };
  
  const dot = ba.x * bc.x + ba.y * bc.y;
  const magBa = Math.sqrt(ba.x * ba.x + ba.y * ba.y);
  const magBc = Math.sqrt(bc.x * bc.x + bc.y * bc.y);
  
  return Math.acos(dot / (magBa * magBc)) * (180 / Math.PI);
}

// Helper: Check if finger is extended with joint angle analysis
function isExt(lm: NormalizedLandmark[], base: number): boolean {
  const tip = lm[base + 3];
  const dip = lm[base + 2];
  const pip = lm[base + 1];
  const mcp = lm[base];
  
  // Check if tip is far from MCP
  const tipDist = dist(tip, mcp);
  const pipDist = dist(pip, mcp);
  
  // Check joint angles (should be relatively straight)
  const pipAngle = getAngle(mcp, pip, dip);
  const dipAngle = getAngle(pip, dip, tip);
  
  return tipDist > pipDist * 1.3 && pipAngle > 140 && dipAngle > 140;
}

// Helper: Check if finger is curled with joint analysis
function isCurl(lm: NormalizedLandmark[], base: number): boolean {
  const tip = lm[base + 3];
  const mcp = lm[base];
  const wrist = lm[0];
  
  const tipToWrist = dist(tip, wrist);
  const mcpToWrist = dist(mcp, wrist);
  
  // Check joint angles (should be bent)
  const pip = lm[base + 1];
  const dip = lm[base + 2];
  const pipAngle = getAngle(mcp, pip, dip);
  const dipAngle = getAngle(pip, dip, tip);
  
  return tipToWrist < mcpToWrist * 1.2 && (pipAngle < 140 || dipAngle < 140);
}

// Helper: Check if thumb is extended
function isThumbExt(lm: NormalizedLandmark[]): boolean {
  return dist(lm[4], lm[5]) > dist(lm[4], lm[2]) * 0.8;
}

// Helper: Check if fingers are together
function areTogether(lm: NormalizedLandmark[], b1: number, b2: number): boolean {
  return dist(lm[b1 + 3], lm[b2 + 3]) < 0.08;
}

// Helper: Check if hand is fist
function isFist(lm: NormalizedLandmark[]): boolean {
  return isCurl(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17);
}

// Letter detectors
function detectA(lm: NormalizedLandmark[]): number {
  // A: Fist with thumb on side
  const checks = [];
  checks.push(isFist(lm));
  checks.push(dist(lm[4], lm[5]) < 0.15);
  checks.push(lm[4].x > lm[5].x - 0.08); // Thumb on side
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.90 : 0;
}

function detectB(lm: NormalizedLandmark[]): number {
  // B: Four fingers up, together, thumb across palm
  const checks = [];
  checks.push(isExt(lm, 5) && isExt(lm, 9) && isExt(lm, 13) && isExt(lm, 17));
  checks.push(areTogether(lm, 5, 9) && areTogether(lm, 9, 13));
  checks.push(dist(lm[4], lm[5]) < dist(lm[4], lm[17])); // Thumb across
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.92 : 0;
}

function detectC(lm: NormalizedLandmark[]): number {
  // C: Curved hand forming C shape
  const checks = [];
  const curved = !isExt(lm, 5) && !isCurl(lm, 5);
  checks.push(curved);
  checks.push(dist(lm[4], lm[8]) > 0.08 && dist(lm[4], lm[8]) < 0.25);
  checks.push(lm[8].x < lm[4].x); // Opening faces left/right
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.88 : 0;
}

function detectD(lm: NormalizedLandmark[]): number {
  // D: Index up, thumb touching middle/ring forming circle
  const checks = [];
  checks.push(isExt(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(dist(lm[4], lm[10]) < 0.12 || dist(lm[4], lm[12]) < 0.15);
  checks.push(lm[8].y < lm[5].y - 0.03); // Index pointing up
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.93 : (passed >= 2 ? 0.70 : 0);
}

function detectE(lm: NormalizedLandmark[]): number {
  // E: Fist with thumb touching fingertips
  const checks = [];
  checks.push(isFist(lm));
  checks.push(dist(lm[4], lm[8]) < 0.10);
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.88 : 0;
}

function detectF(lm: NormalizedLandmark[]): number {
  // F: Index curled, thumb touching index, other 3 fingers up
  const checks = [];
  checks.push(isCurl(lm, 5) && isExt(lm, 9) && isExt(lm, 13) && isExt(lm, 17));
  checks.push(dist(lm[4], lm[8]) < 0.10);
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.90 : 0;
}

function detectG(lm: NormalizedLandmark[]): number {
  // G: Index and thumb extended horizontally, pointing sideways
  const checks = [];
  checks.push(isExt(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(isThumbExt(lm));
  checks.push(Math.abs(lm[8].y - lm[4].y) < 0.12); // Horizontal
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.87 : 0;
}

function detectH(lm: NormalizedLandmark[]): number {
  // H: Index and middle extended horizontally, together
  const checks = [];
  checks.push(isExt(lm, 5) && isExt(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(dist(lm[8], lm[12]) < 0.06); // Very close together
  checks.push(Math.abs(lm[8].y - lm[12].y) < 0.04); // Horizontal
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.92 : (passed >= 2 ? 0.68 : 0);
}

function detectI(lm: NormalizedLandmark[]): number {
  // I: Pinky up, others curled, thumb across
  const checks = [];
  checks.push(isCurl(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isExt(lm, 17));
  checks.push(dist(lm[4], lm[5]) < dist(lm[4], lm[17]));
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.91 : 0;
}

function detectJ(lm: NormalizedLandmark[]): number {
  return detectI(lm) * 0.7;
}

function detectK(lm: NormalizedLandmark[]): number {
  // K: Index and middle in V, thumb between them
  const checks = [];
  checks.push(isExt(lm, 5) && isExt(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(dist(lm[8], lm[12]) > 0.08); // V shape
  checks.push(lm[4].y > lm[8].y && lm[4].y < lm[12].y); // Thumb between
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.87 : 0;
}

function detectL(lm: NormalizedLandmark[]): number {
  // L: Index up, thumb out at 90 degrees
  const checks = [];
  checks.push(isExt(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(isThumbExt(lm));
  const angle = getAngle(lm[4], lm[2], lm[8]);
  checks.push(angle >= 75 && angle <= 105); // ~90 degrees
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.91 : (passed >= 2 ? 0.65 : 0);
}

function detectM(lm: NormalizedLandmark[]): number {
  // M: Three fingers over thumb, pinky curled
  const checks = [];
  checks.push(isExt(lm, 5) && isExt(lm, 9) && isExt(lm, 13) && isCurl(lm, 17));
  checks.push(lm[4].y > lm[8].y - 0.02); // Thumb under fingertips
  checks.push(dist(lm[8], lm[12]) < 0.07 && dist(lm[12], lm[16]) < 0.07); // Close together
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.89 : (passed >= 2 ? 0.60 : 0);
}

function detectN(lm: NormalizedLandmark[]): number {
  // N: Two fingers over thumb, ring and pinky curled
  const checks = [];
  checks.push(isExt(lm, 5) && isExt(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(lm[4].y > lm[8].y - 0.02); // Thumb under
  checks.push(dist(lm[8], lm[12]) < 0.07); // Close together
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.88 : (passed >= 2 ? 0.58 : 0);
}

function detectO(lm: NormalizedLandmark[]): number {
  // O: All fingertips touching thumb forming circle
  const checks = [];
  checks.push(dist(lm[4], lm[8]) < 0.12);
  checks.push(dist(lm[4], lm[12]) < 0.14);
  checks.push(dist(lm[4], lm[16]) < 0.16);
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.90 : 0;
}

function detectP(lm: NormalizedLandmark[]): number {
  const shape = isExt(lm, 5) && isExt(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17);
  const down = lm[8].y > lm[0].y;
  return shape && down ? 0.8 : 0;
}

function detectQ(lm: NormalizedLandmark[]): number {
  const shape = isExt(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17);
  const down = lm[8].y > lm[0].y;
  return shape && isThumbExt(lm) && down ? 0.8 : 0;
}

function detectR(lm: NormalizedLandmark[]): number {
  // R: Index and middle crossed
  const checks = [];
  
  // Check 1: Index and middle extended
  checks.push(isExt(lm, 5) && isExt(lm, 9));
  
  // Check 2: Ring and pinky curled
  checks.push(isCurl(lm, 13) && isCurl(lm, 17));
  
  // Check 3: Fingers crossed (index over middle)
  const crossed = lm[8].x > lm[12].x && lm[6].x < lm[10].x;
  checks.push(crossed);
  
  // Check 4: Calculate cross point
  const crossDist = dist(lm[7], lm[11]); // DIP joints close
  checks.push(crossDist < 0.05);
  
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.85 : (passed >= 2 ? 0.6 : 0);
}

function detectS(lm: NormalizedLandmark[]): number {
  // S: Fist with thumb in front
  const checks = [];
  checks.push(isFist(lm));
  checks.push(dist(lm[4], lm[5]) < 0.14 && dist(lm[4], lm[9]) < 0.14);
  checks.push(lm[4].z < lm[5].z + 0.02); // Thumb in front
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.87 : 0;
}

function detectT(lm: NormalizedLandmark[]): number {
  // T: Fist with thumb between index and middle
  const checks = [];
  checks.push(isCurl(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(dist(lm[4], lm[8]) < 0.12 && dist(lm[4], lm[12]) < 0.12);
  checks.push(lm[4].y < lm[5].y); // Thumb sticking up
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.86 : 0;
}

function detectU(lm: NormalizedLandmark[]): number {
  // U: Index and middle together, parallel, pointing up
  const checks = [];
  checks.push(isExt(lm, 5) && isExt(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(dist(lm[8], lm[12]) < 0.06); // Very close
  checks.push(Math.abs(lm[8].y - lm[12].y) < 0.04); // Parallel
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.91 : (passed >= 2 ? 0.65 : 0);
}

function detectV(lm: NormalizedLandmark[]): number {
  // V: Index and middle in V shape, apart
  const checks = [];
  checks.push(isExt(lm, 5) && isExt(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(dist(lm[8], lm[12]) > 0.07); // Apart
  checks.push(lm[8].y < lm[5].y && lm[12].y < lm[9].y); // Pointing up
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.92 : (passed >= 2 ? 0.67 : 0);
}

function detectW(lm: NormalizedLandmark[]): number {
  // W: Three fingers up with spacing, pinky curled
  const checks = [];
  checks.push(isExt(lm, 5) && isExt(lm, 9) && isExt(lm, 13) && isCurl(lm, 17));
  checks.push(dist(lm[8], lm[12]) > 0.05 && dist(lm[12], lm[16]) > 0.05); // Spacing
  checks.push(lm[8].y < lm[5].y && lm[16].y < lm[13].y); // Pointing up
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.90 : (passed >= 2 ? 0.64 : 0);
}

function detectX(lm: NormalizedLandmark[]): number {
  const othersCurl = isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17);
  const hooked = dist(lm[8], lm[5]) < dist(lm[6], lm[5]) * 1.5;
  return othersCurl && hooked ? 0.8 : 0;
}

function detectY(lm: NormalizedLandmark[]): number {
  // Y: Thumb and pinky extended, others curled
  const checks = [];
  checks.push(isCurl(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isExt(lm, 17));
  checks.push(isThumbExt(lm));
  checks.push(dist(lm[4], lm[20]) > 0.15); // Thumb and pinky apart
  const passed = checks.filter(Boolean).length;
  return passed >= 2 ? 0.92 : 0;
}

function detectZ(lm: NormalizedLandmark[]): number {
  // Z: Index pointing forward/sideways (not up like D)
  const checks = [];
  checks.push(isExt(lm, 5) && isCurl(lm, 9) && isCurl(lm, 13) && isCurl(lm, 17));
  checks.push(Math.abs(lm[8].x - lm[5].x) > Math.abs(lm[8].y - lm[5].y)); // Pointing sideways
  checks.push(!(lm[8].y < lm[5].y - 0.06)); // NOT pointing straight up
  const passed = checks.filter(Boolean).length;
  return passed >= 3 ? 0.88 : (passed >= 2 ? 0.65 : 0);
}

/**
 * Detect ASL alphabet letter from hand landmarks
 */
export function detectASLLetter(
  landmarks: NormalizedLandmark[],
  handedness: string = 'Right'
): ASLDetectionResult {
  if (!landmarks || landmarks.length !== 21) {
    return { letter: '', confidence: 0 };
  }

  let lm = landmarks;
  if (handedness === 'Left') {
    lm = landmarks.map(l => ({ ...l, x: 1 - l.x }));
  }

  const results = [
    { letter: 'A', confidence: detectA(lm) },
    { letter: 'B', confidence: detectB(lm) },
    { letter: 'C', confidence: detectC(lm) },
    { letter: 'D', confidence: detectD(lm) },
    { letter: 'E', confidence: detectE(lm) },
    { letter: 'F', confidence: detectF(lm) },
    { letter: 'G', confidence: detectG(lm) },
    { letter: 'H', confidence: detectH(lm) },
    { letter: 'I', confidence: detectI(lm) },
    { letter: 'J', confidence: detectJ(lm) },
    { letter: 'K', confidence: detectK(lm) },
    { letter: 'L', confidence: detectL(lm) },
    { letter: 'M', confidence: detectM(lm) },
    { letter: 'N', confidence: detectN(lm) },
    { letter: 'O', confidence: detectO(lm) },
    { letter: 'P', confidence: detectP(lm) },
    { letter: 'Q', confidence: detectQ(lm) },
    { letter: 'R', confidence: detectR(lm) },
    { letter: 'S', confidence: detectS(lm) },
    { letter: 'T', confidence: detectT(lm) },
    { letter: 'U', confidence: detectU(lm) },
    { letter: 'V', confidence: detectV(lm) },
    { letter: 'W', confidence: detectW(lm) },
    { letter: 'X', confidence: detectX(lm) },
    { letter: 'Y', confidence: detectY(lm) },
    { letter: 'Z', confidence: detectZ(lm) },
  ];

  // Sort by confidence and get top 2
  const sorted = results.sort((a, b) => b.confidence - a.confidence);
  const best = sorted[0];
  const second = sorted[1];
  
  // Require clear winner: best must be higher than second (reduced margin for speed)
  const clearWinner = best.confidence > second.confidence + 0.10;
  
  // Lower minimum confidence for faster detection
  const difficultLetters = ['M', 'N', 'R', 'S', 'T'];
  const minConfidence = difficultLetters.includes(best.letter) ? 0.50 : 0.60;
  
  if (best.confidence < minConfidence || !clearWinner) {
    return { letter: '', confidence: 0 };
  }
  
  return best;
}
