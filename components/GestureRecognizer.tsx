'use client';

import { useRef, useEffect, useState } from 'react';
import { useCamera } from '@/hooks/useCamera';
import { useMediaPipe } from '@/hooks/useMediaPipe';
import { useSpeechSynthesis } from '@/hooks/useSpeechSynthesis';
import { drawLandmarks } from '@/lib/mediapipe/drawLandmarks';
import { detectASLLetter, type ASLDetectionResult } from '@/lib/mediapipe/aslAlphabetSimple';
import { detectControlGesture } from '@/lib/mediapipe/controlGestures';
import { detectASLPhrase } from '@/lib/mediapipe/aslPhrases';
import { createMotionHistory, addFrame, type MotionHistory } from '@/lib/mediapipe/motionTracker';
import { detectASLWithGeminiThrottled } from '@/lib/gemini/aslVision';
import { playBeep, playWhoosh } from '@/lib/audio/soundEffects';
import { gestureToPhrase, letterToPhrase, formatSentence, shouldIncreasePitch, speakNaturally, enhanceWithContext, updateContext, clearContext, predictWord, trackWordUsage, saveToDictionary, translateGesture, translateWord, loadLanguagePreference } from '@/lib/speech';
import { ShimmerButton } from '@/components/ui/ShimmerButton';
import { ComingSoonFeatures } from '@/components/ComingSoonFeatures';
import { LanguageSelector } from '@/components/LanguageSelector';
import { SmartModeToggle } from '@/components/SmartModeToggle';
import { SmartModeResult } from '@/components/SmartModeResult';
import type { GestureRecognizerResult, NormalizedLandmark } from '@mediapipe/tasks-vision';

export function GestureRecognizer({ isDark = false, offlineMode = false }: { isDark?: boolean; offlineMode?: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastVideoTimeRef = useRef<number>(-1);
  const detectGesturesRef = useRef<(() => void) | null>(null);
  const previousLandmarksRef = useRef<NormalizedLandmark[] | null>(null);
  const previousTimeRef = useRef<number>(0);
  const motionHistoryRef = useRef<MotionHistory>(createMotionHistory(30));

  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<GestureRecognizerResult | null>(null);
  const [fps, setFps] = useState(0);

  const { stream, isLoading: cameraLoading, error: cameraError, startCamera, stopCamera } = useCamera();
  const { recognizer, isLoading: mediapipeLoading, error: mediapipeError } = useMediaPipe();
  const { speak, isSpeaking, error: speechError } = useSpeechSynthesis();

  const [lastSpokenGesture, setLastSpokenGesture] = useState<string | null>(null);
  const [currentPhrase, setCurrentPhrase] = useState<string>('');
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [audioMuted, setAudioMuted] = useState(false);
  
  // Multilingual support
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  
  // Smart Mode state (disabled in offline mode)
  const [smartModeEnabled, setSmartModeEnabled] = useState<boolean>(false);
  const [isRefining, setIsRefining] = useState<boolean>(false);
  const [lastRefinement, setLastRefinement] = useState<{ original: string; refined: string } | null>(null);

  // Disable Smart Mode and AI Vision in offline mode
  useEffect(() => {
    if (offlineMode) {
      setSmartModeEnabled(false);
      setUseAIVision(false);
    }
  }, [offlineMode]);

  // Theme colors
  const theme = {
    card: isDark ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    cardBorder: isDark ? 'rgba(148, 163, 184, 0.2)' : 'rgba(229, 231, 235, 0.5)',
    text: isDark ? '#f1f5f9' : '#1f2937',
    textMuted: isDark ? '#94a3b8' : '#6b7280',
    textLight: isDark ? '#cbd5e1' : '#9ca3af',
    badge: isDark ? '#312e81' : '#ede9fe',
    badgeText: isDark ? '#c4b5fd' : '#7c3aed',
    success: isDark ? '#065f46' : '#d1fae5',
    successText: isDark ? '#6ee7b7' : '#059669',
    error: isDark ? '#7f1d1d' : '#fee2e2',
    errorText: isDark ? '#fca5a5' : '#dc2626',
    button: isDark ? '#1e293b' : '#ffffff',
    buttonHover: isDark ? '#334155' : '#f3f4f6',
    border: isDark ? '#334155' : '#e5e7eb',
    scrollbarTrack: isDark ? '#1e293b' : '#f3f4f6',
  };
  
  // AI Vision Mode for ASL detection
  const [useAIVision, setUseAIVision] = useState<boolean>(false); // Default OFF - user can enable
  const [isDetectingWithAI, setIsDetectingWithAI] = useState<boolean>(false);
  
  // Word builder state
  const [wordBuffer, setWordBuffer] = useState<string>('');
  const [sentenceBuffer, setSentenceBuffer] = useState<string[]>([]);
  const [controlGestureHoldStart, setControlGestureHoldStart] = useState<number | null>(null);
  const [controlGestureProgress, setControlGestureProgress] = useState<number>(0);
  const [currentControlGesture, setCurrentControlGesture] = useState<string | null>(null);
  const [detectedLetter, setDetectedLetter] = useState<string>('');
  const [letterHistory, setLetterHistory] = useState<string[]>([]);
  const [detectionMode, setDetectionMode] = useState<'gesture' | 'letter'>('gesture');
  const [predictions, setPredictions] = useState<Array<{ word: string; confidence: number }>>([]);
  const [lastLetterTime, setLastLetterTime] = useState<number>(Date.now());
  const [showCommitSuccess, setShowCommitSuccess] = useState(false);
  
  // Letter stabilization buffer (last 5 detections)
  const letterBufferRef = useRef<Array<{ letter: string; confidence: number }>>([]);

  // Speak wrapper that checks mute state
  const speakIfNotMuted = (text: string, options?: any) => {
    if (!audioMuted && audioUnlocked) {
      speak(text, options);
      // Vibrate on mobile for tactile feedback
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
  };

  const lastFrameTimeRef = useRef<number>(0);
  const frameCountRef = useRef<number>(0);

  // Commit word function with Smart Mode support
  const commitWord = async () => {
    if (!wordBuffer) return;
    
    if (smartModeEnabled) {
      // Smart Mode: Refine with Gemini AI
      setIsRefining(true);
      try {
        const originalTokens = sentenceBuffer.concat(wordBuffer).join(' ');
        const response = await fetch('/api/refine', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokens: sentenceBuffer.concat(wordBuffer),
            context: sentenceBuffer.slice(-3), // Last 3 words as context
            language: selectedLanguage,
          }),
        });

        if (!response.ok) throw new Error('Refinement failed');

        const result = await response.json();
        const refinedText = result.refined;

        // Show the AI refinement visually
        setLastRefinement({ original: originalTokens, refined: refinedText });
        
        speakIfNotMuted(refinedText, { rate: 1.0, pitch: 1.0, volume: 1.0, lang: selectedLanguage });
        setSentenceBuffer(prev => [...prev, wordBuffer]);
        trackWordUsage(wordBuffer, false);
        playWhoosh();
        setCurrentPhrase(`✨ ${refinedText}`);
        
        // Hide refinement after 8 seconds
        setTimeout(() => setLastRefinement(null), 8000);
      } catch (error) {
        console.error('Smart Mode error:', error);
        // Fallback to regular mode
        const translatedWord = translateWord(wordBuffer, selectedLanguage);
        speakIfNotMuted(translatedWord, { rate: 1.0, pitch: 1.0, volume: 1.0, lang: selectedLanguage });
        setCurrentPhrase(`⚠️ ${translatedWord} (fallback)`);
        setLastRefinement(null);
      } finally {
        setIsRefining(false);
      }
    } else {
      // Fast Mode: Direct translation
      const translatedWord = translateWord(wordBuffer, selectedLanguage);
      speakIfNotMuted(translatedWord, { rate: 1.0, pitch: 1.0, volume: 1.0, lang: selectedLanguage });
      setSentenceBuffer(prev => [...prev, wordBuffer]);
      trackWordUsage(wordBuffer, false);
      playWhoosh();
      setLastRefinement(null); // Clear any previous refinement
      setCurrentPhrase(`✓ ${translatedWord}`);
    }
    
    // Success animation
    setShowCommitSuccess(true);
    setTimeout(() => setShowCommitSuccess(false), 1000);
    
    // Haptic feedback
    if ('vibrate' in navigator) navigator.vibrate(100);
    
    setWordBuffer('');
    setPredictions([]);
  };

  // Initialize lastFrameTimeRef on mount
  useEffect(() => {
    lastFrameTimeRef.current = performance.now();
  }, []);

  // Auto-commit after 3 seconds of inactivity
  useEffect(() => {
    if (!wordBuffer || detectionMode !== 'letter') return;
    
    const timer = setTimeout(() => {
      const timeSinceLastLetter = Date.now() - lastLetterTime;
      if (timeSinceLastLetter >= 3000 && wordBuffer) {
        commitWord();
      }
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [wordBuffer, lastLetterTime, detectionMode]);

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

  // Unlock audio with user interaction
  const handleUnlockAudio = () => {
    // Speak a very short audible utterance to reliably unlock audio
    // (some browsers ignore empty/silent utterances)
    const utterance = new SpeechSynthesisUtterance('Audio enabled');
    // Keep volume very low so this unlock does not annoy the user
    utterance.volume = 0.01;
    // Ensure any suspended speech is resumed before speaking
    try {
      if (typeof speechSynthesis.resume === 'function') speechSynthesis.resume();
    } catch (e) {
      // ignore
    }
    // Cancel any pending speech and speak the short utterance
    speechSynthesis.cancel();
    speechSynthesis.speak(utterance);
    setAudioUnlocked(true);
    console.log('Audio unlocked');
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

  // Trigger speech when gesture is detected OR handle word builder
  useEffect(() => {
    if (!isRunning || !audioUnlocked || !results) {
      return;
    }

    const currentTime = performance.now();

    // Word builder mode - check control gestures first
    if (detectionMode === 'letter' && results.landmarks?.[0]) {
      const landmarks = results.landmarks[0];
      const controlResult = detectControlGesture(
        landmarks,
        previousLandmarksRef.current,
        controlGestureHoldStart,
        currentTime,
        previousTimeRef.current
      );

      // Update previous landmarks and time for velocity tracking
      previousLandmarksRef.current = landmarks;
      previousTimeRef.current = currentTime;

      // Update progress bar
      setControlGestureProgress(controlResult.holdProgress);

      // Start hold timer if gesture detected
      if (controlResult.holdProgress > 0 && !controlGestureHoldStart) {
        setControlGestureHoldStart(currentTime);
        setCurrentControlGesture(controlResult.gesture || 'HOLD');
      }

      // Reset hold timer if gesture released
      if (controlResult.holdProgress === 0 && controlGestureHoldStart) {
        setControlGestureHoldStart(null);
        setCurrentControlGesture(null);
      }

      // Handle completed control gestures
      if (controlResult.gesture === 'SPACE' && controlResult.holdProgress >= 1) {
        if (wordBuffer) {
          speakIfNotMuted(wordBuffer, { rate: 1.0, pitch: 1.0, volume: 1.0 });
          setSentenceBuffer(prev => [...prev, wordBuffer]);
          trackWordUsage(wordBuffer, false); // Track as manually completed
          setWordBuffer('');
          setPredictions([]);
          playWhoosh();
          setCurrentPhrase(`✓ Word: ${wordBuffer}`);
          // Haptic feedback
          if ('vibrate' in navigator) navigator.vibrate(50);
        }
        setControlGestureHoldStart(null);
        setCurrentControlGesture(null);
        setControlGestureProgress(0);
      } else if (controlResult.gesture === 'PERIOD' && controlResult.holdProgress >= 1) {
        if (sentenceBuffer.length > 0 || wordBuffer) {
          const words = [...sentenceBuffer, wordBuffer].filter(Boolean);
          const enhancedWords = enhanceWithContext(words);
          const formattedSentence = formatSentence(enhancedWords);
          speakNaturally(formattedSentence);
          updateContext(formattedSentence, words);
          setCurrentPhrase(`✓ ${formattedSentence}`);
          setSentenceBuffer([]);
          setWordBuffer('');
          playWhoosh();
          // Haptic feedback
          if ('vibrate' in navigator) navigator.vibrate([50, 50, 50]);
        }
        setControlGestureHoldStart(null);
        setCurrentControlGesture(null);
        setControlGestureProgress(0);
      } else if (controlResult.gesture === 'BACKSPACE') {
        if (wordBuffer) {
          setWordBuffer(prev => prev.slice(0, -1));
          playBeep();
          // Haptic feedback
          if ('vibrate' in navigator) navigator.vibrate(30);
          playBeep();
        }
      }
      // Check for thumbs up to commit word (hold 1 second)
      else if (!currentControlGesture && wordBuffer && results.gestures?.[0]?.[0]) {
        const gesture = results.gestures[0][0];
        if (gesture.categoryName === 'Thumb_Up' && gesture.score > 0.7) {
          const holdDuration = controlGestureHoldStart ? (currentTime - controlGestureHoldStart) / 1000 : 0;
          
          if (!controlGestureHoldStart) {
            setControlGestureHoldStart(currentTime);
            setCurrentControlGesture('THUMBS_UP');
          }
          
          const progress = Math.min(holdDuration / 1.0, 1);
          setControlGestureProgress(progress);
          
          if (progress >= 1) {
            commitWord();
            setControlGestureHoldStart(null);
            setCurrentControlGesture(null);
            setControlGestureProgress(0);
          }
        } else if (currentControlGesture === 'THUMBS_UP') {
          // Released before 1 second
          setControlGestureHoldStart(null);
          setCurrentControlGesture(null);
          setControlGestureProgress(0);
        }
      }
      // Check for thumbs up to accept prediction
      else if (!currentControlGesture && predictions.length > 0 && results.gestures?.[0]?.[0]) {
        const gesture = results.gestures[0][0];
        if (gesture.categoryName === 'Thumb_Up' && gesture.score > 0.7) {
          // Accept first prediction
          const accepted = predictions[0].word;
          setWordBuffer(accepted);
          setPredictions([]);
          trackWordUsage(accepted, true);
          playWhoosh();
          setCurrentPhrase(`✓ ${accepted}`);
          setTimeout(() => setCurrentPhrase(''), 2000);
        }
      }
      // Detect letters only if no control gesture active
      else if (!currentControlGesture && detectionMode === 'letter') {
        // AI Vision Mode - Use Gemini for accurate detection
        if (useAIVision && videoRef.current && !isDetectingWithAI) {
          setIsDetectingWithAI(true);
          
          detectASLWithGeminiThrottled(videoRef.current)
            .then((result) => {
              if (result && result.letter && result.letter !== lastSpokenGesture) {
                const stableLetter = result.letter;
                const newWord = wordBuffer + stableLetter;
                setWordBuffer(newWord);
                setLastLetterTime(Date.now());
                setDetectedLetter(stableLetter);
                playBeep();
                
                // Speak the letter immediately
                speakIfNotMuted(stableLetter, { rate: 1.1, pitch: 1.0, volume: 1.0 });
                setCurrentPhrase(stableLetter);
                
                console.log('🤖 AI DETECTED:', stableLetter, '→ Word:', newWord);
                
                // Update predictions
                if (newWord.length >= 3) {
                  setPredictions(predictWord(newWord));
                }
                
                setLastSpokenGesture(stableLetter);
                setTimeout(() => setLastSpokenGesture(null), 800);
              }
            })
            .catch((error) => {
              console.error('AI detection error:', error);
            })
            .finally(() => {
              setIsDetectingWithAI(false);
            });
        }
        // Fallback: Simple rule-based detection
        else if (!useAIVision) {
          const handedness = results.handednesses?.[0]?.[0]?.categoryName || 'Right';
          const aslResult = detectASLLetter(landmarks, handedness);
          
          if (aslResult.letter) {
            console.log('📏 Detected:', aslResult.letter, 'Confidence:', aslResult.confidence.toFixed(2));
          }
          
          // VERY LOW threshold - accept almost anything
          if (aslResult.letter && aslResult.confidence > 0.3 && aslResult.letter !== lastSpokenGesture) {
            const stableLetter = aslResult.letter;
            const newWord = wordBuffer + stableLetter;
            setWordBuffer(newWord);
            setLastLetterTime(Date.now());
            setDetectedLetter(stableLetter);
            playBeep();
            
            // Speak the letter immediately in a natural way
            speakIfNotMuted(stableLetter, { rate: 1.1, pitch: 1.0, volume: 1.0 });
            setCurrentPhrase(stableLetter);
            
            console.log('✅ ADDED:', stableLetter, '→ Word:', newWord);
            
            if (newWord.length >= 3) {
              setPredictions(predictWord(newWord));
            }
            
            setLastSpokenGesture(stableLetter);
            setTimeout(() => setLastSpokenGesture(null), 400);
          }
        }
      }
    }
    // Gesture mode - check motion phrases first, then static gestures
    else if (detectionMode === 'gesture') {
      // Add current frame to motion history
      if (results.landmarks?.[0]) {
        addFrame(motionHistoryRef.current, results.landmarks[0]);
        
        // Check for motion-based phrases (HELLO, THANK YOU, PLEASE)
        const phraseResult = detectASLPhrase(results.landmarks[0], motionHistoryRef.current);
        
        if (phraseResult && phraseResult.phrase !== lastSpokenGesture) {
          const translatedPhrase = translateGesture(phraseResult.phrase, selectedLanguage);
          setCurrentPhrase(`👋 ${translatedPhrase}`);
          speakIfNotMuted(translatedPhrase, { rate: 1.0, pitch: 1.0, volume: 1.0, lang: selectedLanguage });
          setLastSpokenGesture(phraseResult.phrase);
          playWhoosh();
          
          setTimeout(() => setLastSpokenGesture(null), 3000);
        }
      }
      
      // Check static gestures if no motion phrase detected
      if (results.gestures?.[0]?.[0] && !lastSpokenGesture) {
        const gesture = results.gestures[0][0];
        const gestureName = gesture.categoryName;
        const confidence = gesture.score;

        if (confidence > 0.7 && gestureName !== lastSpokenGesture) {
          const phrase = gestureToPhrase(gestureName);
          
          if (phrase) {
            // Translate gesture to selected language
            const translatedPhrase = translateGesture(phrase, selectedLanguage);
            setCurrentPhrase(translatedPhrase);
            speakIfNotMuted(translatedPhrase, { rate: 1.0, pitch: 1.0, volume: 1.0, lang: selectedLanguage });
            setLastSpokenGesture(gestureName);
            
            setTimeout(() => setLastSpokenGesture(null), 2000);
          }
        }
      }
    }
  }, [results, isRunning, audioUnlocked, lastSpokenGesture, speak, detectionMode, wordBuffer, sentenceBuffer, controlGestureHoldStart, currentControlGesture, selectedLanguage]);

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
          <div className="mt-3 md:mt-4 space-y-4">
            {/* Mode Toggle - Premium Design */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setDetectionMode('gesture')}
                className="group relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden"
                style={{
                  background: detectionMode === 'gesture' 
                    ? 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)'
                    : isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                  color: detectionMode === 'gesture' ? '#ffffff' : theme.text,
                  border: `2px solid ${detectionMode === 'gesture' ? '#a855f7' : theme.border}`,
                  boxShadow: detectionMode === 'gesture' 
                    ? '0 8px 20px rgba(147, 51, 234, 0.3)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11" />
                  </svg>
                  Gesture Mode
                </span>
              </button>
              <button
                onClick={() => setDetectionMode('letter')}
                className="group relative px-6 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden"
                style={{
                  background: detectionMode === 'letter' 
                    ? 'linear-gradient(135deg, #9333ea 0%, #7c3aed 100%)'
                    : isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255, 255, 255, 0.8)',
                  color: detectionMode === 'letter' ? '#ffffff' : theme.text,
                  border: `2px solid ${detectionMode === 'letter' ? '#a855f7' : theme.border}`,
                  boxShadow: detectionMode === 'letter' 
                    ? '0 8px 20px rgba(147, 51, 234, 0.3)' 
                    : '0 4px 12px rgba(0, 0, 0, 0.05)',
                }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  ASL Alphabet
                </span>
              </button>
            </div>

            {/* Control Buttons - Premium Design - Single Row */}
            <div className="flex flex-wrap justify-center items-center gap-3">
              {/* Language Selector */}
              <LanguageSelector onLanguageChange={setSelectedLanguage} isDark={isDark} />
              
              {/* AI Vision Toggle - Only in Letter Mode and NOT in offline mode */}
              {isRunning && detectionMode === 'letter' && !offlineMode && (
                <button
                  onClick={() => setUseAIVision(!useAIVision)}
                  className="group relative px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden backdrop-blur-md"
                  style={{
                    background: useAIVision
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(148, 163, 184, 0.3)',
                    color: useAIVision ? '#ffffff' : theme.textMuted,
                    border: `2px solid ${useAIVision ? '#34d399' : theme.border}`,
                    boxShadow: useAIVision 
                      ? '0 8px 20px rgba(16, 185, 129, 0.3)' 
                      : '0 4px 12px rgba(0, 0, 0, 0.05)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    <div className="flex flex-col items-start leading-tight">
                      <span className="text-xs font-bold">AI Vision</span>
                      <span className="text-xs opacity-90">{useAIVision ? 'ON' : 'OFF'}</span>
                    </div>
                  </span>
                </button>
              )}
              
              {/* Smart Mode Toggle (disabled in offline mode) */}
              {isRunning && !offlineMode && (
                <SmartModeToggle 
                  enabled={smartModeEnabled} 
                  onToggle={setSmartModeEnabled}
                  isRefining={isRefining}
                  isDark={isDark}
                />
              )}
              
              {/* Start/Stop Camera */}
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  disabled={isLoading}
                  className="group relative px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 overflow-hidden backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    color: '#ffffff',
                    border: '2px solid #a78bfa',
                    boxShadow: '0 8px 24px rgba(139, 92, 246, 0.4)',
                  }}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    {isLoading ? 'Initializing...' : 'Start Camera'}
                  </span>
                </button>
              ) : (
                <>
                  <button
                    onClick={handleStop}
                    className="group relative px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 overflow-hidden backdrop-blur-md"
                    style={{
                      background: 'linear-gradient(135deg, #ec4899 0%, #ef4444 100%)',
                      color: '#ffffff',
                      border: '2px solid #f472b6',
                      boxShadow: '0 8px 24px rgba(236, 72, 153, 0.4)',
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                      </svg>
                      Stop Camera
                    </span>
                  </button>
                
                  {/* Audio Toggle Button - Mute/Unmute */}
                  <button
                    onClick={() => {
                      if (!audioUnlocked) {
                        handleUnlockAudio();
                      } else {
                        setAudioMuted(!audioMuted);
                      }
                    }}
                    className="group relative px-8 py-3 rounded-2xl font-bold text-sm transition-all duration-300 overflow-hidden backdrop-blur-md"
                    style={{
                      background: !audioUnlocked || audioMuted
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      color: '#ffffff',
                      border: `2px solid ${!audioUnlocked || audioMuted ? '#f87171' : '#34d399'}`,
                      boxShadow: !audioUnlocked || audioMuted
                        ? '0 8px 24px rgba(239, 68, 68, 0.4)'
                        : '0 8px 24px rgba(16, 185, 129, 0.4)',
                    }}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      {!audioUnlocked ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                          Enable Audio
                        </>
                      ) : audioMuted ? (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                          </svg>
                          Audio Muted
                        </>
                      ) : (
                        <>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                          </svg>
                          Audio On
                        </>
                      )}
                    </span>
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Smart Mode AI Refinement Result */}
          {smartModeEnabled && lastRefinement && (
            <SmartModeResult
              originalTokens={lastRefinement.original}
              refinedText={lastRefinement.refined}
              isVisible={true}
            />
          )}

          {/* Word Builder Display */}
          {detectionMode === 'letter' && (
            <div className="mt-4 flex flex-col h-[calc(100vh-300px)] min-h-[500px]">
              {/* Current Word Being Spelled - Fixed Top */}
              <div className={`flex-shrink-0 p-6 bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg border-2 transition-all duration-300 ${showCommitSuccess ? 'border-green-400 bg-green-50' : 'border-purple-200'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="text-xs font-semibold text-purple-600">CURRENT WORD</div>
                  {wordBuffer && (
                    <button
                      onClick={commitWord}
                      className="px-3 py-1 bg-purple-600 text-white text-xs rounded-lg hover:bg-purple-700 transition-colors"
                    >
                      Speak Word
                    </button>
                  )}
                </div>
                <div className="text-5xl font-bold text-purple-900 min-h-[4rem] flex items-center">
                  {wordBuffer ? (
                    <>
                      {wordBuffer}
                      <span className="animate-pulse ml-1">|</span>
                    </>
                  ) : (
                    <span className="text-gray-400 text-2xl">
                      {showCommitSuccess ? '✓ Ready for next word' : 'Start spelling...'}
                    </span>
                  )}
                </div>
                {wordBuffer && (
                  <div className="mt-3 text-sm text-purple-600 flex items-center gap-2">
                    <span>👍</span>
                    <span>Hold Thumbs Up 1s to speak word</span>
                  </div>
                )}
              </div>

              {/* Thumbs Up Progress - Fixed */}
              {currentControlGesture === 'THUMBS_UP' && controlGestureProgress > 0 && (
                <div className="flex-shrink-0 mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-700">👍 Hold to speak...</span>
                    <span className="text-xs text-green-600">{Math.round(controlGestureProgress * 100)}%</span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-100"
                      style={{ width: `${controlGestureProgress * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Word Predictions - Fixed */}
              {predictions.length > 0 && !wordBuffer.includes(' ') && (
                <div className="flex-shrink-0 mt-3 p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl shadow-lg border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-xs font-semibold text-blue-600">PREDICTIONS</div>
                    <div className="text-xs text-blue-500">👍 Quick tap to accept</div>
                  </div>
                  <div className="space-y-2">
                    {predictions.map((pred, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors ${idx === 0 ? 'bg-blue-100 border-2 border-blue-300' : 'bg-white'}`}
                        onClick={() => {
                          setWordBuffer(pred.word);
                          setPredictions([]);
                          trackWordUsage(pred.word, true);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-lg font-bold text-gray-800">{pred.word}</span>
                          <span className="text-sm text-gray-600">{pred.confidence}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Divider */}
              {sentenceBuffer.length > 0 && (
                <div className="flex-shrink-0 my-4 border-t-2" style={{ borderColor: theme.border }} />
              )}

              {/* Word History - Scrollable Area with Fixed Height */}
              {sentenceBuffer.length > 0 && (
                <div className="flex-shrink-0 mt-3 rounded-xl shadow-lg" style={{ height: '400px', display: 'flex', flexDirection: 'column', backgroundColor: theme.card, border: `1px solid ${theme.cardBorder}` }}>
                  <div className="flex-shrink-0 p-3 border-b flex items-center justify-between" style={{ 
                    background: isDark ? 'linear-gradient(to right, rgba(88, 28, 135, 0.3), rgba(67, 56, 202, 0.3))' : 'linear-gradient(to right, #faf5ff, #eef2ff)',
                    borderColor: theme.cardBorder
                  }}>
                    <div className="text-xs font-semibold" style={{ color: isDark ? '#c4b5fd' : '#7c3aed' }}>WORD HISTORY ({sentenceBuffer.length} words)</div>
                    {sentenceBuffer.length > 5 && (
                      <button
                        onClick={(e) => {
                          const scrollContainer = e.currentTarget.parentElement?.nextElementSibling as HTMLElement;
                          if (scrollContainer) {
                            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                          }
                        }}
                        className="text-xs font-medium hover:opacity-80"
                        style={{ color: isDark ? '#a78bfa' : '#7c3aed' }}
                      >
                        ↑ Scroll to top
                      </button>
                    )}
                  </div>
                  <div 
                    className="flex-1 overflow-y-scroll p-4"
                    style={{
                      scrollbarColor: `${isDark ? '#7c3aed' : '#9333ea'} ${theme.scrollbarTrack}`
                    }}
                  >
                    <style jsx>{`
                      div::-webkit-scrollbar {
                        width: 12px;
                      }
                      div::-webkit-scrollbar-track {
                        background: #f3f4f6;
                        border-radius: 6px;
                      }
                      div::-webkit-scrollbar-thumb {
                        background: linear-gradient(180deg, #9333ea 0%, #7e22ce 100%);
                        border-radius: 6px;
                      }
                      div::-webkit-scrollbar-thumb:hover {
                        background: linear-gradient(180deg, #7e22ce 0%, #6b21a8 100%);
                      }
                    `}</style>
                    <div className="space-y-2">
                      {sentenceBuffer.map((word, idx) => (
                        <div 
                          key={idx}
                          className="p-3 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-lg border border-purple-200 hover:border-purple-300 transition-colors min-h-[40px] flex items-center"
                        >
                          <span className="text-sm font-medium text-purple-900 mr-2">#{idx + 1}</span>
                          <span className="text-lg text-gray-800 font-medium">{word}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Control Gesture Timer - Fixed Bottom */}
              {controlGestureProgress > 0 && currentControlGesture !== 'THUMBS_UP' && (
                <div className="flex-shrink-0 mt-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-green-700">
                      {currentControlGesture === 'HOLD' ? 'Hold gesture...' : 
                       currentControlGesture === 'SPACE' ? 'SPACE (1s)' : 'PERIOD (2s)'}
                    </span>
                    <span className="text-xs text-green-600">
                      {Math.round(controlGestureProgress * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-green-500 to-emerald-500 h-full transition-all duration-100"
                      style={{ width: `${controlGestureProgress * 100}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Control Gesture Instructions - Fixed Bottom */}
              <div className="flex-shrink-0 mt-3 p-4 rounded-xl" style={{ backgroundColor: isDark ? 'rgba(30, 41, 59, 0.6)' : 'rgba(249, 250, 251, 0.8)', border: `1px solid ${theme.cardBorder}` }}>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-xs font-semibold" style={{ color: theme.text }}>CONTROL GESTURES</div>
                  <button
                    onClick={() => {
                      clearContext();
                      setCurrentPhrase('✓ Context cleared');
                      setTimeout(() => setCurrentPhrase(''), 2000);
                    }}
                    className="text-xs font-medium hover:opacity-80"
                    style={{ color: isDark ? '#60a5fa' : '#2563eb' }}
                  >
                    Reset Context
                  </button>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: theme.button, border: `1px solid ${theme.border}` }}>
                    <div className="text-2xl">✋</div>
                    <div className="flex-1">
                      <div className="font-semibold" style={{ color: theme.text }}>SPACE (1s)</div>
                      <div style={{ color: theme.textMuted }}>Flat hand, palm forward → Speak word</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: theme.button, border: `1px solid ${theme.border}` }}>
                    <div className="text-2xl">✊</div>
                    <div className="flex-1">
                      <div className="font-semibold" style={{ color: theme.text }}>PERIOD (2s)</div>
                      <div style={{ color: theme.textMuted }}>Closed fist, thumb wrapped → Speak sentence</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 p-2 rounded-lg" style={{ backgroundColor: theme.button, border: `1px solid ${theme.border}` }}>
                    <div className="text-2xl">👍</div>
                    <div className="flex-1">
                      <div className="font-semibold" style={{ color: theme.text }}>BACKSPACE</div>
                      <div style={{ color: theme.textMuted }}>Thumb out, shake left-right → Delete letter</div>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-2 italic">
                    💡 Hold gestures steady for timer to fill
                  </div>
                </div>
              </div>

              {/* Coming Soon Features */}
              <ComingSoonFeatures />
            </div>
          )}

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

          {speechError && (
            <div className="mt-4 p-3 md:p-4 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <div>
                  <p className="text-yellow-800 text-sm font-medium">Speech synthesis unavailable</p>
                  <p className="text-yellow-600 text-xs mt-1">{speechError}</p>
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

            {/* Current Phrase Display */}
            {currentPhrase && (
              <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border-2 border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  </svg>
                  <span className="text-xs font-semibold text-green-700">
                    {isSpeaking ? 'Speaking...' : 'Last Spoken'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-green-800">{currentPhrase}</p>
              </div>
            )}

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

            {isRunning && results?.landmarks && results.landmarks.length > 0 && (
              <div className="space-y-3 md:space-y-4">
                {results.landmarks.map((landmarks, handIndex) => {
                  const handedness = results.handedness?.[handIndex]?.[0];
                  
                  // In letter mode, detect and show ASL letter
                  let displayText = 'Detecting...';
                  let confidence = 0;
                  
                  if (detectionMode === 'letter') {
                    const aslResult = detectASLLetter(landmarks, handedness?.categoryName || 'Right');
                    if (aslResult.letter) {
                      displayText = `Letter: ${aslResult.letter}`;
                      confidence = aslResult.confidence;
                    }
                  } else {
                    // Gesture mode - show MediaPipe gesture
                    const gesture = results.gestures?.[handIndex]?.[0];
                    if (gesture) {
                      displayText = gesture.categoryName.replace('_', ' ');
                      confidence = gesture.score;
                    }
                  }

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
                        {displayText}
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2.5 md:h-3 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-purple-600 to-blue-600 h-full rounded-full transition-all duration-300 ease-out"
                            style={{ width: `${confidence * 100}%` }}
                          />
                        </div>
                        <span className="text-base md:text-lg font-bold text-gray-700 min-w-[3rem] text-right">
                          {Math.round(confidence * 100)}%
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
