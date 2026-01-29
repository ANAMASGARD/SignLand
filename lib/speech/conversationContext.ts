/**
 * Conversation Context System
 * Maintains history of recent sentences for improved grammar and flow
 */

interface ContextEntry {
  sentence: string;
  words: string[];
  timestamp: number;
}

const MAX_CONTEXT = 5;
const STORAGE_KEY = 'signland_conversation_context';

// Load context from session storage
function loadContext(): ContextEntry[] {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

// Save context to session storage
function saveContext(context: ContextEntry[]): void {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(context));
  } catch (e) {
    console.warn('Failed to save context:', e);
  }
}

let contextBuffer: ContextEntry[] = loadContext();

export function getContext(): ContextEntry[] {
  return [...contextBuffer];
}

export function updateContext(sentence: string, words: string[]): void {
  const entry: ContextEntry = {
    sentence,
    words: words.map(w => w.toUpperCase()),
    timestamp: Date.now()
  };

  contextBuffer.push(entry);
  
  // Keep only last 5 entries (circular buffer)
  if (contextBuffer.length > MAX_CONTEXT) {
    contextBuffer.shift();
  }

  saveContext(contextBuffer);
}

export function clearContext(): void {
  contextBuffer = [];
  saveContext(contextBuffer);
}

// Extract nouns from previous sentences
function getPreviousNouns(): Set<string> {
  const nouns = new Set<string>();
  contextBuffer.forEach(entry => {
    entry.words.forEach(word => {
      // Simple noun detection (could be expanded)
      if (word.length > 2 && !['I', 'YOU', 'HE', 'SHE', 'WE', 'THEY', 'AM', 'IS', 'ARE'].includes(word)) {
        nouns.add(word);
      }
    });
  });
  return nouns;
}

// Find last mentioned person/name
function getLastMentionedPerson(): string | null {
  for (let i = contextBuffer.length - 1; i >= 0; i--) {
    const words = contextBuffer[i].words;
    // Look for capitalized names (simple heuristic)
    for (const word of words) {
      if (word.length > 2 && word === word.toUpperCase() && 
          !['I', 'YOU', 'HE', 'SHE', 'WE', 'THEY', 'WANT', 'NEED', 'LIKE', 'GO', 'EAT'].includes(word)) {
        return word;
      }
    }
  }
  return null;
}

// Check if topic was mentioned recently
function wasTopicMentioned(topic: string): boolean {
  return contextBuffer.some(entry => 
    entry.words.includes(topic.toUpperCase())
  );
}

// Get last sentence about a topic
function getLastSentenceAbout(topic: string): ContextEntry | null {
  for (let i = contextBuffer.length - 1; i >= 0; i--) {
    if (contextBuffer[i].words.includes(topic.toUpperCase())) {
      return contextBuffer[i];
    }
  }
  return null;
}

export function enhanceWithContext(words: string[]): string[] {
  if (words.length === 0 || contextBuffer.length === 0) {
    return words;
  }

  const enhanced = [...words];
  const firstWord = words[0].toUpperCase();

  // Handle "MORE" - reference previous want/need
  if (firstWord === 'MORE') {
    const lastSentence = contextBuffer[contextBuffer.length - 1];
    if (lastSentence) {
      const hasWant = lastSentence.words.includes('WANT');
      const hasNeed = lastSentence.words.includes('NEED');
      
      if (hasWant || hasNeed) {
        // Find the object (noun after WANT/NEED)
        const wantIdx = lastSentence.words.indexOf('WANT');
        const needIdx = lastSentence.words.indexOf('NEED');
        const idx = wantIdx !== -1 ? wantIdx : needIdx;
        
        if (idx !== -1 && idx + 1 < lastSentence.words.length) {
          const object = lastSentence.words[idx + 1];
          // "MORE" → "I WANT MORE WATER"
          return ['I', hasWant ? 'WANT' : 'NEED', 'MORE', object];
        }
      }
    }
  }

  // Handle pronoun "HE" or "SHE" - reference last mentioned person
  if (['HE', 'SHE'].includes(firstWord)) {
    const person = getLastMentionedPerson();
    if (person && words.length >= 2) {
      // "HE TALL" → "JOHN TALL" (will be formatted to "John is tall")
      enhanced[0] = person;
    }
  }

  // Handle repeated topics - use "the" instead of "a/some"
  const nouns = getPreviousNouns();
  for (let i = 0; i < enhanced.length; i++) {
    const word = enhanced[i].toUpperCase();
    if (nouns.has(word) && wasTopicMentioned(word)) {
      // Insert "THE" before repeated noun if not already there
      if (i > 0 && !['THE', 'A', 'AN', 'SOME'].includes(enhanced[i - 1].toUpperCase())) {
        enhanced.splice(i, 0, 'THE');
        break; // Only add once
      }
    }
  }

  // Add transition words based on context
  if (contextBuffer.length >= 2) {
    const lastWords = contextBuffer[contextBuffer.length - 1].words;
    const currentTopic = enhanced[enhanced.length - 1];
    
    // If continuing same topic, add "ALSO"
    if (lastWords.includes(currentTopic.toUpperCase())) {
      enhanced.unshift('ALSO');
    }
    // If sentence starts with BUT/HOWEVER, keep it
    else if (!['ALSO', 'THEN', 'BUT', 'HOWEVER'].includes(firstWord)) {
      // Check if this is a contrasting statement
      const lastHadPositive = lastWords.some(w => ['GOOD', 'HAPPY', 'LIKE', 'WANT'].includes(w));
      const currentHasNegative = enhanced.some(w => ['BAD', 'SAD', 'NOT', 'NO'].includes(w.toUpperCase()));
      
      if (lastHadPositive && currentHasNegative) {
        enhanced.unshift('HOWEVER');
      }
    }
  }

  return enhanced;
}
