/**
 * Gemini Vision API for ASL Letter Detection
 * Uses Google's Gemini Vision to accurately detect ASL letters from hand images
 */

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
 * Detect ASL letter using Gemini Vision via API route
 */
export async function detectASLWithGemini(
  videoElement: HTMLVideoElement
): Promise<GeminiASLResult> {
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

    // Call our API route (server-side has the key)
    const response = await fetch('/api/detect-asl', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const result = await response.json();
    
    if (!result.letter || result.letter === 'NONE') {
      return { letter: '', confidence: 0 };
    }

    return {
      letter: result.letter,
      confidence: 0.95,
      reasoning: result.reasoning,
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
const MIN_DETECTION_INTERVAL = 1000; // 1 second between detections

export async function detectASLWithGeminiThrottled(
  videoElement: HTMLVideoElement
): Promise<GeminiASLResult | null> {
  const now = Date.now();
  
  if (now - lastDetectionTime < MIN_DETECTION_INTERVAL) {
    return null; // Too soon, skip
  }

  lastDetectionTime = now;
  
  try {
    return await detectASLWithGemini(videoElement);
  } catch (error) {
    console.error('Detection failed:', error);
    return null;
  }
}
