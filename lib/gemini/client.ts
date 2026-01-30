/**
 * Gemini API Client for Smart Mode Text Refinement
 * Converts rough gesture tokens into natural, conversational language
 */

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = process.env.GEMINI_API_KEY || '';

if (!API_KEY) {
  console.warn('GEMINI_API_KEY not found. Smart Mode will not work.');
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null;

export interface RefineTextOptions {
  tokens: string[];
  context?: string[];
  language?: string;
}

export interface RefineTextResult {
  refined: string;
  confidence: number;
  originalTokens: string[];
}

/**
 * Refine gesture tokens into natural language using Gemini
 */
export async function refineText(options: RefineTextOptions): Promise<RefineTextResult> {
  if (!genAI) {
    throw new Error('Gemini API not configured');
  }

  const { tokens, context = [], language = 'en-US' } = options;

  // Build prompt
  const prompt = buildPrompt(tokens, context, language);

  try {
    // Use stable 1.5 Flash model
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const refined = response.text().trim();

    return {
      refined,
      confidence: 0.9, // Gemini doesn't provide confidence, use high default
      originalTokens: tokens,
    };
  } catch (error) {
    console.error('Gemini API error:', error);
    throw new Error('Failed to refine text');
  }
}

/**
 * Build prompt for Gemini based on tokens and context
 */
function buildPrompt(tokens: string[], context: string[], language: string): string {
  const languageName = getLanguageName(language);
  const tokensText = tokens.join(' ');
  const contextText = context.length > 0 ? context.join('. ') : 'No previous context';

  return `You are an AI assistant helping a non-verbal person communicate using sign language.

The person has spelled out these words using ASL alphabet: "${tokensText}"

Previous conversation context: "${contextText}"

Your task:
1. Convert these rough tokens into a natural, polite, conversational sentence in ${languageName}
2. Add appropriate grammar (articles, verb conjugation, punctuation)
3. Make it sound like something a person would naturally say
4. Keep the core meaning intact
5. Be concise (1-2 sentences maximum)

Examples:
- "HELLO THANK YOU" → "Hello! Thank you so much."
- "WATER PLEASE" → "Could I please have some water?"
- "HELP NEED" → "I need help, please."
- "SORRY LATE" → "I'm sorry I'm late."

Now convert: "${tokensText}"

Respond with ONLY the refined sentence, nothing else.`;
}

/**
 * Get language name from code
 */
function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    'en-US': 'English',
    'es-ES': 'Spanish',
    'fr-FR': 'French',
    'de-DE': 'German',
    'it-IT': 'Italian',
    'pt-BR': 'Portuguese',
    'hi-IN': 'Hindi',
    'zh-CN': 'Mandarin Chinese',
    'ja-JP': 'Japanese',
    'ar-SA': 'Arabic',
  };
  return languages[code] || 'English';
}
