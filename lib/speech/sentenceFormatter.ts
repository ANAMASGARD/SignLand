/**
 * Sentence Formatter - Converts ASL word sequences to natural English
 */

// Common nouns that need articles
const NOUNS = new Set([
  'WATER', 'FOOD', 'HELP', 'BATHROOM', 'TOILET', 'PHONE', 'BOOK', 'CAR', 'HOUSE',
  'DOCTOR', 'MEDICINE', 'COFFEE', 'TEA', 'MILK', 'BREAD', 'APPLE', 'CHAIR', 'TABLE'
]);

// Question words
const QUESTION_WORDS = new Set(['WHO', 'WHAT', 'WHERE', 'WHEN', 'WHY', 'HOW']);

// Past tense markers
const PAST_MARKERS = new Set(['YESTERDAY', 'BEFORE', 'AGO', 'LAST']);

// Verb conjugations
const VERB_CONJUGATIONS: Record<string, { base: string; past: string; present: Record<string, string> }> = {
  'GO': { base: 'go', past: 'went', present: { 'I': 'go', 'YOU': 'go', 'HE': 'goes', 'SHE': 'goes', 'WE': 'go', 'THEY': 'go' } },
  'WANT': { base: 'want', past: 'wanted', present: { 'I': 'want', 'YOU': 'want', 'HE': 'wants', 'SHE': 'wants', 'WE': 'want', 'THEY': 'want' } },
  'NEED': { base: 'need', past: 'needed', present: { 'I': 'need', 'YOU': 'need', 'HE': 'needs', 'SHE': 'needs', 'WE': 'need', 'THEY': 'need' } },
  'LIKE': { base: 'like', past: 'liked', present: { 'I': 'like', 'YOU': 'like', 'HE': 'likes', 'SHE': 'likes', 'WE': 'like', 'THEY': 'like' } },
  'HAVE': { base: 'have', past: 'had', present: { 'I': 'have', 'YOU': 'have', 'HE': 'has', 'SHE': 'has', 'WE': 'have', 'THEY': 'have' } },
  'EAT': { base: 'eat', past: 'ate', present: { 'I': 'eat', 'YOU': 'eat', 'HE': 'eats', 'SHE': 'eats', 'WE': 'eat', 'THEY': 'eat' } },
  'DRINK': { base: 'drink', past: 'drank', present: { 'I': 'drink', 'YOU': 'drink', 'HE': 'drinks', 'SHE': 'drinks', 'WE': 'drink', 'THEY': 'drink' } },
};

// Adjectives that need "to be" verb
const ADJECTIVES = new Set(['HAPPY', 'SAD', 'HUNGRY', 'THIRSTY', 'TIRED', 'SICK', 'GOOD', 'BAD', 'HOT', 'COLD']);

function getBeVerb(subject: string, isPast: boolean): string {
  if (isPast) {
    return ['I', 'HE', 'SHE'].includes(subject) ? 'was' : 'were';
  }
  if (subject === 'I') return 'am';
  if (['HE', 'SHE'].includes(subject)) return 'is';
  return 'are';
}

function normalizeWord(word: string): string {
  // Handle pronoun variations
  const pronounMap: Record<string, string> = {
    'ME': 'I', 'MY': 'my', 'MINE': 'mine',
    'YOUR': 'your', 'YOURS': 'yours',
    'HIS': 'his', 'HER': 'her', 'HERS': 'hers'
  };
  return pronounMap[word] || word;
}

export function formatSentence(words: string[]): string {
  if (words.length === 0) return '';

  // Normalize and uppercase
  let tokens = words.map(w => w.toUpperCase().trim()).filter(Boolean);
  if (tokens.length === 0) return '';

  // Check if question
  const isQuestion = QUESTION_WORDS.has(tokens[0]);
  
  // Check for past tense markers
  const hasPastMarker = tokens.some(t => PAST_MARKERS.has(t));
  
  // Get subject (first word or after question word)
  const subjectIdx = isQuestion ? 1 : 0;
  const subject = tokens[subjectIdx] || 'I';
  
  let result: string[] = [];
  let i = 0;

  // Handle question word
  if (isQuestion) {
    result.push(tokens[0].toLowerCase());
    i = 1;
  }

  // Process subject
  if (i < tokens.length) {
    const subj = normalizeWord(tokens[i]);
    result.push(subj === 'I' ? 'I' : subj.toLowerCase());
    i++;
  }

  // Check if next word is adjective (needs "to be")
  if (i < tokens.length && ADJECTIVES.has(tokens[i])) {
    const beVerb = getBeVerb(subject, hasPastMarker);
    result.push(beVerb);
    result.push(tokens[i].toLowerCase());
    i++;
  }
  // Check if next word is verb
  else if (i < tokens.length && VERB_CONJUGATIONS[tokens[i]]) {
    const verb = tokens[i];
    const conjugation = VERB_CONJUGATIONS[verb];
    
    if (hasPastMarker) {
      result.push(conjugation.past);
    } else {
      result.push(conjugation.present[subject] || conjugation.base);
    }
    i++;
  }

  // Process remaining words
  while (i < tokens.length) {
    const word = tokens[i];
    
    // Skip past markers (already handled)
    if (PAST_MARKERS.has(word)) {
      result.push(word.toLowerCase());
      i++;
      continue;
    }

    // Add article before nouns
    if (NOUNS.has(word)) {
      // Check if previous word is already an article
      const prev = result[result.length - 1];
      if (!['a', 'an', 'the', 'some'].includes(prev)) {
        result.push('some');
      }
      result.push(word.toLowerCase());
    } else {
      result.push(normalizeWord(word).toLowerCase());
    }
    
    i++;
  }

  // Capitalize first letter
  if (result.length > 0) {
    result[0] = result[0].charAt(0).toUpperCase() + result[0].slice(1);
  }

  // Join and add punctuation
  let sentence = result.join(' ');
  
  if (isQuestion) {
    sentence += '?';
  } else {
    sentence += '.';
  }

  return sentence;
}

export function shouldIncreasePitch(sentence: string): boolean {
  return sentence.endsWith('?');
}
