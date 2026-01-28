'use client';

import { useRef, useEffect, useState } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useMediaPipe } from '@/hooks/useMediaPipe';
import { drawLandmarks } from '@/lib/mediapipe/drawLandmarks';
import { cn } from '@/lib/utils';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import type { GestureRecognizerResult } from '@mediapipe/tasks-vision';

export function GestureRecognizer() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const detectGesturesRef = useRef<(() => void) | null>(null);

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<GestureRecognizerResult | null>(null);
  const [fps, setFps] = useState(0);

  const { stream, isLoading: cameraLoading, error: cameraError, startCamera, stopCamera } = useCamera();
  const { recognizer, isLoading: mediapipeLoading, error: mediapipeError } = useMediaPipe();

  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Initialize lastFrameTimeRef on mount
  useEffect(() => {
    lastFrameTimeRef.current = performance.now();
  }, []);

  // Attach stream to video element and play
  useEffect(() => {
    if (stream && videoRef.current) {
      console.log('Attaching stream to video element');
      videoRef.current.srcObject = stream;
      // Explicitly play the video
      videoRef.current.play()
        .then(() => {
          console.log('Video playing successfully');
          // Set canvas size once when video is ready
          if (canvasRef.current && videoRef.current) {
            const container = canvasRef.current.parentElement;
            if (container) {
              canvasRef.current.width = container.clientWidth;
              canvasRef.current.height = container.clientHeight;
            }
          }
        })
        .catch(err => {
          console.error('Error playing video:', err);
        });
    }
  }, [stream]);

  // Detection loop
  useEffect(() => {
    detectGesturesRef.current = () => {
      if (!videoRef.current || !canvasRef.current || !recognizer || !isRunning) {
        return;
      }

      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');

      if (!ctx) return;

      // Check if video has valid dimensions
      if (video.videoWidth === 0 || video.videoHeight === 0) {
        animationFrameRef.current = requestAnimationFrame(() => detectGesturesRef.current?.());
        return;
      }

      // Only process if video time has changed (new frame)
      if (video.currentTime !== lastVideoTimeRef.current) {
        lastVideoTimeRef.current = video.currentTime;

        try {
          // Recognize gestures in current video frame
          const timestamp = performance.now();
          const gestureResults = recognizer.recognizeForVideo(video, timestamp);
          setResults(gestureResults);

          // Clear canvas
          ctx.clearRect(0, 0, canvas.width, canvas.height);

          // Draw landmarks for each detected hand
          if (gestureResults.landmarks) {
            gestureResults.landmarks.forEach((handLandmarks) => {
              drawLandmarks(ctx, handLandmarks, canvas.width, canvas.height);
            });
          }

          // Calculate FPS
          frameCountRef.current++;
          const now = performance.now();
          const elapsed = now - lastFrameTimeRef.current;
          if (elapsed >= 1000) {
            setFps(Math.round((frameCountRef.current * 1000) / elapsed));
            frameCountRef.current = 0;
            lastFrameTimeRef.current = now;
          }
        } catch (error) {
          console.error('Gesture recognition error:', error);
        }
      }

      animationFrameRef.current = requestAnimationFrame(() => detectGesturesRef.current?.());
    };
  }, [recognizer, isRunning]);

  // Start detection
  const handleStart = async () => {
    try {
      if (!stream) {
        await startCamera();
      }
      
      // Wait for video to be ready
      if (videoRef.current) {
        await new Promise<void>((resolve) => {
          const checkVideo = () => {
            if (videoRef.current && videoRef.current.readyState >= 2) {
              resolve();
            } else {
              setTimeout(checkVideo, 100);
            }
          };
          checkVideo();
        });
      }
      
      setIsRunning(true);
    } catch (error) {
      console.error('Error starting camera:', error);
    }
  };

  // Stop detection
  const handleStop = () => {
    setIsRunning(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    // Stop camera when stopping detection
    stopCamera();
  };

  // Start/stop detection loop based on isRunning
  useEffect(() => {
    if (isRunning && recognizer && stream && detectGesturesRef.current) {
      detectGesturesRef.current();
    }

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isRunning, recognizer, stream]);

  // Cleanup on unmount only
  useEffect(() => {
    const cleanup = () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      stopCamera();
    };

    return cleanup;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = cameraLoading || mediapipeLoading;
  const error = cameraError || mediapipeError;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid lg:grid-cols-3 gap-4 md:gap-6">
        {/* Video and Canvas - Left Side */}
        <div className="lg:col-span-2">
          <div className="relative bg-black rounded-xl md:rounded-2xl overflow-hidden shadow-2xl h-[60vh] min-h-[400px] max-h-[700px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
              onCanPlay={(e) => {
                e.currentTarget.play().catch(err => {
                  console.error('Error playing video on canPlay:', err);
                });
              }}
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full pointer-events-none"
            />
            {!stream && (
              <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-purple-900/90 via-blue-900/90 to-indigo-900/90 backdrop-blur-sm">
                <div className="text-center space-y-4 px-4">
                  <div className="w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
                    <svg className="w-8 h-8 md:w-10 md:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-white text-lg md:text-xl font-medium">Camera Off</p>
                  <p className="text-white/70 text-xs md:text-sm">Click Start to begin</p>
                </div>
              </div>
            )}
            
            {/* FPS Counter */}
            {isRunning && (
              <div className="absolute top-3 right-3 md:top-4 md:right-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full border border-white/10">
                <span className="text-white text-xs md:text-sm font-medium">{fps} FPS</span>
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="mt-3 md:mt-4 flex justify-center">
            {!isRunning ? (
              <ShimmerButton
                onClick={handleStart}
                disabled={isLoading}
                background="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {isLoading ? 'Initializing...' : 'Start Camera'}
              </ShimmerButton>
            ) : (
              <ShimmerButton
                onClick={handleStop}
                background="linear-gradient(135deg, #f093fb 0%, #f5576c 100%)"
              >
                <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                </svg>
                Stop Camera
              </ShimmerButton>
            )}
          </div>

          {error && (
            <div className="mt-4 p-3 md:p-4 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <p className="text-red-800 text-sm font-medium">{error}</p>
                  <p className="text-red-600 text-xs mt-1">Please allow camera access in your browser settings</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Panel - Right Side */}
        <div className="lg:col-span-1">
          <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 border border-gray-100 h-[60vh] min-h-[400px] max-h-[700px] overflow-y-auto">
            <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 md:w-7 md:h-7 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
              </svg>
              Detected Gestures
            </h3>

            {!isRunning && (
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium text-sm md:text-base">Press Start to begin</p>
                <p className="text-gray-400 text-xs md:text-sm mt-1">Your gestures will appear here</p>
              </div>
            )}

            {isRunning && !results?.gestures?.[0]?.[0] && (
              <div className="text-center py-8 md:py-12">
                <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4 rounded-full bg-purple-100 flex items-center justify-center animate-pulse">
                  <svg className="w-6 h-6 md:w-8 md:h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <p className="text-gray-600 font-medium text-sm md:text-base">Show your hand</p>
                <p className="text-gray-400 text-xs md:text-sm mt-1">Make a gesture to see results</p>
              </div>
            )}

            {isRunning && results?.gestures && results.gestures.length > 0 && (
              <div className="space-y-3 md:space-y-4">
                {results.gestures.map((handGestures, handIndex) => {
                  const gesture = handGestures[0];
                  const handedness = results.handedness?.[handIndex]?.[0];

                  if (!gesture) return null;

                  return (
                    <div key={handIndex} className="p-4 md:p-5 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl border-2 border-purple-200 shadow-lg transform transition-all hover:scale-105">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2.5 h-2.5 md:w-3 md:h-3 rounded-full bg-green-500 animate-pulse"></div>
                          <span className="text-xs md:text-sm font-semibold text-gray-700">
                            {handedness?.categoryName || 'Unknown'} Hand
                          </span>
                        </div>
                        <span className="text-xs font-medium text-purple-600 bg-purple-100 px-2 py-1 rounded-full">
                          {Math.round((handedness?.score || 0) * 100)}%
                        </span>
                      </div>

                      <div className="text-2xl md:text-3xl font-bold text-purple-600 mb-3">
                        {gesture.categoryName.replace('_', ' ')}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 md:h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${gesture.score * 100}%` }}
                          />
                        </div>
                        <span className="text-base md:text-lg font-bold text-gray-700 min-w-[3rem] text-right">
                          {Math.round(gesture.score * 100)}%
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
