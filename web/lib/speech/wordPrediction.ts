/**
 * Word Prediction System with Trie Data Structure
 */

// Top 1000 most common English words (abbreviated for size)
const COMMON_WORDS = [
  'THE', 'BE', 'TO', 'OF', 'AND', 'A', 'IN', 'THAT', 'HAVE', 'I',
  'IT', 'FOR', 'NOT', 'ON', 'WITH', 'HE', 'AS', 'YOU', 'DO', 'AT',
  'THIS', 'BUT', 'HIS', 'BY', 'FROM', 'THEY', 'WE', 'SAY', 'HER', 'SHE',
  'OR', 'AN', 'WILL', 'MY', 'ONE', 'ALL', 'WOULD', 'THERE', 'THEIR', 'WHAT',
  'SO', 'UP', 'OUT', 'IF', 'ABOUT', 'WHO', 'GET', 'WHICH', 'GO', 'ME',
  'WHEN', 'MAKE', 'CAN', 'LIKE', 'TIME', 'NO', 'JUST', 'HIM', 'KNOW', 'TAKE',
  'PEOPLE', 'INTO', 'YEAR', 'YOUR', 'GOOD', 'SOME', 'COULD', 'THEM', 'SEE', 'OTHER',
  'THAN', 'THEN', 'NOW', 'LOOK', 'ONLY', 'COME', 'ITS', 'OVER', 'THINK', 'ALSO',
  'BACK', 'AFTER', 'USE', 'TWO', 'HOW', 'OUR', 'WORK', 'FIRST', 'WELL', 'WAY',
  'EVEN', 'NEW', 'WANT', 'BECAUSE', 'ANY', 'THESE', 'GIVE', 'DAY', 'MOST', 'US',
  'HELLO', 'HELP', 'HELD', 'HERE', 'WATER', 'FOOD', 'NEED', 'PLEASE', 'THANK', 'SORRY',
  'YES', 'NO', 'MAYBE', 'OKAY', 'SURE', 'GREAT', 'GOOD', 'BAD', 'HAPPY', 'SAD',
  'HUNGRY', 'THIRSTY', 'TIRED', 'SICK', 'BATHROOM', 'TOILET', 'PHONE', 'DOCTOR', 'MEDICINE',
  'HOME', 'HOUSE', 'WORK', 'SCHOOL', 'STORE', 'HOSPITAL', 'RESTAURANT', 'PARK',
  'MORNING', 'AFTERNOON', 'EVENING', 'NIGHT', 'TODAY', 'TOMORROW', 'YESTERDAY',
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY',
  'JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST',
  'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER', 'COFFEE', 'TEA', 'MILK', 'JUICE',
  'BREAD', 'BUTTER', 'CHEESE', 'MEAT', 'CHICKEN', 'FISH', 'RICE', 'PASTA',
  'APPLE', 'BANANA', 'ORANGE', 'GRAPE', 'STRAWBERRY', 'VEGETABLE', 'SALAD',
  'HOT', 'COLD', 'WARM', 'COOL', 'BIG', 'SMALL', 'LARGE', 'LITTLE', 'TALL', 'SHORT',
  'FAST', 'SLOW', 'QUICK', 'EASY', 'HARD', 'DIFFICULT', 'SIMPLE', 'COMPLEX',
  'LOVE', 'HATE', 'LIKE', 'DISLIKE', 'ENJOY', 'PREFER', 'CHOOSE', 'SELECT',
  'BUY', 'SELL', 'PAY', 'COST', 'PRICE', 'MONEY', 'DOLLAR', 'CENT',
  'READ', 'WRITE', 'SPEAK', 'LISTEN', 'WATCH', 'SEE', 'HEAR', 'FEEL',
  'WALK', 'RUN', 'JUMP', 'SIT', 'STAND', 'LIE', 'SLEEP', 'WAKE',
  'EAT', 'DRINK', 'COOK', 'CLEAN', 'WASH', 'DRY', 'OPEN', 'CLOSE',
  'START', 'STOP', 'BEGIN', 'END', 'FINISH', 'CONTINUE', 'PAUSE', 'WAIT',
  'CALL', 'TEXT', 'EMAIL', 'MESSAGE', 'SEND', 'RECEIVE', 'REPLY', 'ANSWER',
  'QUESTION', 'PROBLEM', 'SOLUTION', 'IDEA', 'PLAN', 'GOAL', 'DREAM', 'HOPE'
];

interface TrieNode {
  children: Map<string, TrieNode>;
  isWord: boolean;
  word?: string;
  frequency: number;
}

class Trie {
  root: TrieNode;

  constructor() {
    this.root = { children: new Map(), isWord: false, frequency: 0 };
  }

  insert(word: string, frequency: number = 1): void {
    let node = this.root;
    for (const char of word) {
      if (!node.children.has(char)) {
        node.children.set(char, { children: new Map(), isWord: false, frequency: 0 });
      }
      node = node.children.get(char)!;
    }
    node.isWord = true;
    node.word = word;
    node.frequency += frequency;
  }

  findWords(prefix: string, limit: number = 3): Array<{ word: string; confidence: number }> {
    let node = this.root;
    
    // Navigate to prefix
    for (const char of prefix) {
      if (!node.children.has(char)) return [];
      node = node.children.get(char)!;
    }

    // Collect all words with this prefix
    const words: Array<{ word: string; frequency: number }> = [];
    this.collectWords(node, words);

    // Sort by frequency and return top N
    words.sort((a, b) => b.frequency - a.frequency);
    const topWords = words.slice(0, limit);

    // Calculate confidence percentages
    const total = topWords.reduce((sum, w) => sum + w.frequency, 0);
    return topWords.map(w => ({
      word: w.word,
      confidence: total > 0 ? Math.round((w.frequency / total) * 100) : 33
    }));
  }

  private collectWords(node: TrieNode, words: Array<{ word: string; frequency: number }>): void {
    if (node.isWord && node.word) {
      words.push({ word: node.word, frequency: node.frequency });
    }
    for (const child of node.children.values()) {
      this.collectWords(child, words);
    }
  }
}

// Initialize trie with common words
const wordTrie = new Trie();
COMMON_WORDS.forEach((word, index) => {
  // Higher frequency for more common words (reverse index)
  wordTrie.insert(word.toUpperCase(), COMMON_WORDS.length - index);
});

// Custom dictionary storage
const CUSTOM_DICT_KEY = 'signland_custom_dictionary';
const USAGE_STATS_KEY = 'signland_word_usage';

function loadCustomDictionary(): string[] {
  try {
    const stored = localStorage.getItem(CUSTOM_DICT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveCustomDictionary(words: string[]): void {
  try {
    localStorage.setItem(CUSTOM_DICT_KEY, JSON.stringify(words));
  } catch (e) {
    console.warn('Failed to save custom dictionary:', e);
  }
}

// Load custom words into trie
loadCustomDictionary().forEach(word => {
  wordTrie.insert(word.toUpperCase(), 1000); // High frequency for custom words
});

export function saveToDictionary(word: string): void {
  const custom = loadCustomDictionary();
  const upper = word.toUpperCase();
  
  if (!custom.includes(upper)) {
    custom.push(upper);
    saveCustomDictionary(custom);
    wordTrie.insert(upper, 1000);
  }
}

interface UsageStats {
  [word: string]: {
    completed: number;
    predicted: number;
  };
}

function loadUsageStats(): UsageStats {
  try {
    const stored = localStorage.getItem(USAGE_STATS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
}

function saveUsageStats(stats: UsageStats): void {
  try {
    localStorage.setItem(USAGE_STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.warn('Failed to save usage stats:', e);
  }
}

export function trackWordUsage(word: string, wasPredicted: boolean): void {
  const stats = loadUsageStats();
  const upper = word.toUpperCase();
  
  if (!stats[upper]) {
    stats[upper] = { completed: 0, predicted: 0 };
  }
  
  if (wasPredicted) {
    stats[upper].predicted++;
    // Boost frequency for predicted words
    wordTrie.insert(upper, 10);
  } else {
    stats[upper].completed++;
    // Slight boost for completed words
    wordTrie.insert(upper, 2);
  }
  
  saveUsageStats(stats);
}

export function predictWord(prefix: string): Array<{ word: string; confidence: number }> {
  if (prefix.length < 3) return [];
  
  return wordTrie.findWords(prefix.toUpperCase(), 3);
}
