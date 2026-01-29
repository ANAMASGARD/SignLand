import { useState, useEffect } from 'react';
import { GestureRecognizer } from '@mediapipe/tasks-vision';
import { initializeGestureRecognizer, cleanupGestureRecognizer } from '@/lib/mediapipe';

export function useMediaPipe() {
  const [recognizer, setRecognizer] = useState<GestureRecognizer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      try {
        const gestureRecognizer = await initializeGestureRecognizer();
        
        if (mounted) {
          setRecognizer(gestureRecognizer);
          setIsLoading(false);
        }
      } catch (err) {
        console.error('MediaPipe initialization error:', err);
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Failed to initialize MediaPipe');
          setIsLoading(false);
        }
      }
    };

    initialize();

    return () => {
      mounted = false;
      cleanupGestureRecognizer();
    };
  }, []);

  return { recognizer, isLoading, error };
}
