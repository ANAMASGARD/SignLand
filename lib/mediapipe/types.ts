/**
 * MediaPipe Type Definitions
 */

export interface GestureResult {
  gestures: Array<{
    categoryName: string;
    score: number;
  }>;
  landmarks: Array<{
    x: number;
    y: number;
    z: number;
  }>;
  worldLandmarks: Array<{
    x: number;
    y: number;
    z: number;
  }>;
  handedness: Array<{
    categoryName: string; // 'Left' or 'Right'
    score: number;
  }>;
}

export interface MediaPipeConfig {
  modelAssetPath?: string;
  delegate?: 'CPU' | 'GPU';
  runningMode?: 'IMAGE' | 'VIDEO';
  numHands?: number;
}
