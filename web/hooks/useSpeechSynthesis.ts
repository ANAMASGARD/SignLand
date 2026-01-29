import { useState, useEffect, useCallback, useRef } from 'react';
import type { SpeechOptions } from '@/lib/speech';

export function useSpeechSynthesis() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // Check browser support
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setError('Speech synthesis not supported in this browser');
      setIsLoading(false);
      return;
    }

    let mounted = true;

    const loadVoices = () => {
      const availableVoices = speechSynthesis.getVoices();
      if (mounted && availableVoices.length > 0) {
        console.log('Voices loaded:', availableVoices.length);
        setVoices(availableVoices);
        setIsLoading(false);
      }
    };

    // Load voices immediately (works in Firefox and Safari)
    loadVoices();

    // Also listen for voiceschanged event (required in Chrome and Edge)
    speechSynthesis.addEventListener('voiceschanged', loadVoices);

    return () => {
      mounted = false;
      speechSynthesis.removeEventListener('voiceschanged', loadVoices);
    };
  }, []);

  const speak = useCallback((text: string, options: SpeechOptions = {}) => {
    if (!('speechSynthesis' in window)) {
      console.error('Speech synthesis not supported');
      return;
    }

    // Validate text before speaking
    if (!text || text.trim().length === 0 || text === 'None' || text === 'Unknown') {
      console.warn('Invalid text for speech synthesis:', text);
      return;
    }

    // CRITICAL FIX: Wait for voices to load before speaking
    const speakNow = () => {
      // Cancel any ongoing speech
      speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);

      // Try to use a specific voice if available
      const availableVoices = speechSynthesis.getVoices();
      console.log('Available voices:', availableVoices.length);
      
      if (availableVoices.length > 0 && !options.voice) {
        // Prefer local voices for better reliability
        const localVoice = availableVoices.find(v => v.localService) || availableVoices[0];
        utterance.voice = localVoice;
        console.log('Using voice:', localVoice.name);
      }

      // Apply options
      if (options.voice) utterance.voice = options.voice;
      if (options.rate !== undefined) utterance.rate = options.rate;
      if (options.pitch !== undefined) utterance.pitch = options.pitch;
      if (options.volume !== undefined) utterance.volume = options.volume;
      if (options.lang) utterance.lang = options.lang;

      // Attach event handlers
      utterance.onstart = () => {
        console.log('Speech started:', text);
        setIsSpeaking(true);
        setIsPaused(false);
        options.onStart?.();
      };

      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
        setIsPaused(false);
        currentUtteranceRef.current = null;
        options.onEnd?.();
      };

      utterance.onerror = (event) => {
        // Only log actual errors, not "interrupted" or "cancelled"
        if (event.error !== 'interrupted' && event.error !== 'cancelled') {
          console.error('Speech error:', event.error, 'for text:', text);
        }
        
        setIsSpeaking(false);
        setIsPaused(false);
        currentUtteranceRef.current = null;
        options.onError?.(event);
      };

      utterance.onpause = () => {
        console.log('Speech paused');
        setIsPaused(true);
        options.onPause?.();
      };

      utterance.onresume = () => {
        console.log('Speech resumed');
        setIsPaused(false);
        options.onResume?.();
      };

      currentUtteranceRef.current = utterance;
      speechSynthesis.speak(utterance);
    };

    // Check if voices are loaded
    const availableVoices = speechSynthesis.getVoices();
    if (availableVoices.length > 0) {
      // Voices already loaded, speak immediately
      speakNow();
    } else {
      // Wait for voices to load
      console.log('Waiting for voices to load...');
      const voicesChangedHandler = () => {
        speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
        speakNow();
      };
      speechSynthesis.addEventListener('voiceschanged', voicesChangedHandler);
      
      // Fallback: try after 100ms anyway
      setTimeout(() => {
        speechSynthesis.removeEventListener('voiceschanged', voicesChangedHandler);
        speakNow();
      }, 100);
    }
  }, []);

  const cancel = useCallback(() => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
    currentUtteranceRef.current = null;
  }, []);

  const pause = useCallback(() => {
    if (isSpeaking && !isPaused) {
      speechSynthesis.pause();
    }
  }, [isSpeaking, isPaused]);

  const resume = useCallback(() => {
    if (isSpeaking && isPaused) {
      speechSynthesis.resume();
    }
  }, [isSpeaking, isPaused]);

  return {
    voices,
    isLoading,
    isSpeaking,
    isPaused,
    error,
    speak,
    cancel,
    pause,
    resume,
  };
}
