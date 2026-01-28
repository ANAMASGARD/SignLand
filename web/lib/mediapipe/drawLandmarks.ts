/**
 * Draw hand landmarks on canvas
 */

// Hand landmark connections (MediaPipe hand model)
const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index finger
  [0, 9], [9, 10], [10, 11], [11, 12], // Middle finger
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring finger
  [0, 17], [17, 18], [18, 19], [19, 20], // Pinky
  [5, 9], [9, 13], [13, 17] // Palm
];

interface Landmark {
  x: number;
  y: number;
  z?: number;
}

export function drawLandmarks(
  ctx: CanvasRenderingContext2D,
  landmarks: Landmark[],
  canvasWidth: number,
  canvasHeight: number
) {
  if (!landmarks || landmarks.length === 0) return;

  // Draw connections (hand skeleton)
  ctx.strokeStyle = '#FFFFFF';
  ctx.lineWidth = 2;
  ctx.beginPath();

  HAND_CONNECTIONS.forEach(([start, end]) => {
    const startPoint = landmarks[start];
    const endPoint = landmarks[end];

    if (startPoint && endPoint) {
      const x1 = startPoint.x * canvasWidth;
      const y1 = startPoint.y * canvasHeight;
      const x2 = endPoint.x * canvasWidth;
      const y2 = endPoint.y * canvasHeight;

      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
    }
  });

  ctx.stroke();

  // Draw landmark points
  ctx.fillStyle = '#00FF00';
  landmarks.forEach((landmark) => {
    const x = landmark.x * canvasWidth;
    const y = landmark.y * canvasHeight;

    ctx.beginPath();
    ctx.arc(x, y, 5, 0, 2 * Math.PI);
    ctx.fill();
  });
}
