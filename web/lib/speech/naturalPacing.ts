/**
 * Natural Speech Pacing System
 * Provides human-like conversation timing with pauses and emphasis
 */

interface SpeechOptions {
  voice?: SpeechSynthesisVoice;
  baseRate?: number;
  basePitch?: number;
  baseVolume?: number;
}

// Common simple phrases that can be spoken faster
const SIMPLE_PHRASES = new Set([
  'yes', 'no', 'hello', 'hi', 'bye', 'thanks', 'thank you', 'please',
  'sorry', 'okay', 'ok', 'good', 'bad', 'help', 'stop', 'wait'
]);

function isSimplePhrase(sentence: string): boolean {
  const words = sentence.toLowerCase().replace(/[.,!?]/g, '').split(' ');
  return words.length <= 3 && words.every(w => SIMPLE_PHRASES.has(w));
}

function isComplexSentence(sentence: string): boolean {
  const words = sentence.split(' ');
  return words.length > 8;
}

function hasExclamation(sentence: string): boolean {
  return sentence.includes('!');
}

function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function speakWord(
  word: string,
  rate: number,
  pitch: number,
  volume: number,
  voice?: SpeechSynthesisVoice
): Promise<void> {
  return new Promise((resolve, reject) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;
    if (voice) utterance.voice = voice;

    utterance.onend = () => resolve();
    utterance.onerror = (e) => {
      console.warn('Speech error:', e);
      resolve(); // Continue even on error
    };

    speechSynthesis.speak(utterance);
  });
}

export async function speakNaturally(
  sentence: string,
  options: SpeechOptions = {}
): Promise<void> {
  if (!sentence || !('speechSynthesis' in window)) {
    return;
  }

  // Cancel any ongoing speech
  speechSynthesis.cancel();

  // Determine base rate
  let baseRate = options.baseRate || 1.0;
  if (isSimplePhrase(sentence)) {
    baseRate = 1.3; // Faster for simple phrases
  } else if (isComplexSentence(sentence)) {
    baseRate = 1.0; // Normal for complex sentences
  }

  // Check for question
  const isQuestion = sentence.includes('?');
  const basePitch = isQuestion ? 1.2 : (options.basePitch || 1.0);

  // Check for exclamation
  const isExclamation = hasExclamation(sentence);
  const baseVolume = isExclamation ? (options.baseVolume || 1.0) * 1.2 : (options.baseVolume || 1.0);
  if (isExclamation) {
    baseRate *= 1.1; // 10% faster for exclamations
  }

  // Split into words and punctuation
  const tokens = sentence.split(/(\s+|[.,!?])/g).filter(t => t.trim());

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];

    // Skip whitespace
    if (!token.trim()) continue;

    // Handle punctuation
    if (token === ',') {
      await wait(400); // 400ms pause for comma
      continue;
    }
    if (token === '.') {
      await wait(800); // 800ms pause for period
      continue;
    }
    if (token === '?') {
      await wait(600); // 600ms pause for question
      continue;
    }
    if (token === '!') {
      await wait(500); // 500ms pause for exclamation
      continue;
    }

    // Determine rate for this word
    let wordRate = baseRate;
    
    // Check if word is all caps (technical/spelled word)
    if (token === token.toUpperCase() && token.length > 2) {
      wordRate = 0.8; // Slower for technical words
    }

    // Speak the word
    await speakWord(token, wordRate, basePitch, baseVolume, options.voice);

    // Pause after word (except last word)
    if (i < tokens.length - 1 && tokens[i + 1].trim() && ![',', '.', '?', '!'].includes(tokens[i + 1])) {
      await wait(200); // 200ms pause between words
    }
  }
}
