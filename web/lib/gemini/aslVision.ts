/**
 * Gemini Vision API for ASL Letter Detection
 * Uses Google's Gemini Vision to accurately detect ASL letters from hand images
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';
const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface GeminiASLResult {
  letter: string;
  confidence: number;
  reasoning?: string;
}

/**
 * Convert canvas to base64 image
 */
function canvasToBase64(canvas: HTMLCanvasElement): string {
  return canvas.toDataURL('image/jpeg', 0.8).split(',')[1];
}

/**
 * Detect ASL letter using Gemini Vision
 */
export async function detectASLWithGemini(
  videoElement: HTMLVideoElement
): Promise<GeminiASLResult> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  try {
    // Create temporary canvas to capture frame
    const canvas = document.createElement('canvas');
    canvas.width = videoElement.videoWidth;
    canvas.height = videoElement.videoHeight;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      throw new Error('Could not get canvas context');
    }

    // Draw current video frame
    ctx.drawImage(videoElement, 0, 0);
    
    // Convert to base64
    const base64Image = canvasToBase64(canvas);

    // Call Gemini Vision
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    
    const prompt = `You are an expert in American Sign Language (ASL) alphabet recognition.

Look at this image and identify which ASL alphabet letter (A-Z) the hand is showing.

IMPORTANT RULES:
1. Only respond with a SINGLE letter (A-Z)
2. If you see a clear ASL hand shape, respond with that letter
3. If the hand is not showing a clear ASL letter, respond with "NONE"
4. Be confident - ASL letters have distinct hand shapes

Common ASL letters:
- A: Fist with thumb on side
- B: Flat hand, 4 fingers up together
- C: Curved hand like letter C
- D: Index finger up, other fingers touching thumb
- E: Fingers curled over thumb
- F: Index and thumb touching, other fingers up
- I: Pinky up, other fingers down
- L: Index up, thumb out at 90 degrees
- O: All fingers forming circle
- V: Index and middle fingers up in V shape
- Y: Thumb and pinky out

Respond with ONLY the letter (A-Z) or "NONE". Nothing else.`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          mimeType: 'image/jpeg',
          data: base64Image,
        },
      },
    ]);

    const response = await result.response;
    const text = response.text().trim().toUpperCase();

    // Parse response
    const letter = text.match(/^[A-Z]$/)?.[0] || '';
    
    if (!letter || letter === 'NONE') {
      return { letter: '', confidence: 0 };
    }

    return {
      letter,
      confidence: 0.95, // Gemini is very confident
      reasoning: text,
    };
  } catch (error) {
    console.error('Gemini Vision error:', error);
    throw error;
  }
}

/**
 * Batch detect with rate limiting
 */
let lastDetectionTime = 0;
const MIN_DETECTION_INTERVAL = 800; // 800ms between detections

export async function detectASLWithGeminiThrottled(
  videoElement: HTMLVideoElement
): Promise<GeminiASLResult | null> {
  const now = Date.now();
  
  if (now - lastDetectionTime < MIN_DETECTION_INTERVAL) {
    return null; // Too soon, skip
  }

  lastDetectionTime = now;
  return detectASLWithGemini(videoElement);
}
