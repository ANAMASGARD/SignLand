import { useState, useEffect, useRef } from 'react';
import { getOptimalCameraResolution } from '@/lib/pwa/utils';

export function useCamera() {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    console.log('Starting camera...');
    setIsLoading(true);
    setError(null);

    try {
      const resolution = getOptimalCameraResolution();
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: resolution.width },
          height: { ideal: resolution.height },
          facingMode: 'user'
        }
      });

      console.log('Camera stream obtained:', mediaStream);
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setIsLoading(false);
      console.log('Camera started successfully');
    } catch (err) {
      console.error('Camera access error:', err);
      setError(err instanceof Error ? err.message : 'Failed to access camera');
      setIsLoading(false);
    }
  };

  const stopCamera = () => {
    console.log('Stopping camera...');
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        console.log('Stopping track:', track.kind);
        track.stop();
      });
      streamRef.current = null;
      setStream(null);
    }
  };

  return { stream, isLoading, error, startCamera, stopCamera };
}
