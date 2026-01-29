/**
 * Speech Synthesis Type Definitions
 */

export interface SpeechConfig {
  voice?: SpeechSynthesisVoice;
  rate?: number;      // 0.1 to 10, default 1
  pitch?: number;     // 0 to 2, default 1
  volume?: number;    // 0 to 1, default 1
  lang?: string;      // e.g., 'en-US'
}

export interface SpeechCallbacks {
  onStart?: () => void;
  onEnd?: () => void;
  onError?: (event: SpeechSynthesisErrorEvent) => void;
  onPause?: () => void;
  onResume?: () => void;
}

export interface SpeechOptions extends SpeechConfig, SpeechCallbacks {}

export interface GesturePhraseMap {
  [gestureName: string]: string;
}
