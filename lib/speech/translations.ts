/**
 * Multilingual Translation System
 * Maps ASL letters and gestures to phrases in multiple languages
 */

export interface Language {
  code: string;
  name: string;
  flag: string;
  voicePrefix: string; // For Web Speech API voice selection
}

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en-US', name: 'English', flag: '🇺🇸', voicePrefix: 'en' },
  { code: 'es-ES', name: 'Spanish', flag: '🇪🇸', voicePrefix: 'es' },
  { code: 'fr-FR', name: 'French', flag: '🇫🇷', voicePrefix: 'fr' },
  { code: 'de-DE', name: 'German', flag: '🇩🇪', voicePrefix: 'de' },
  { code: 'it-IT', name: 'Italian', flag: '🇮🇹', voicePrefix: 'it' },
  { code: 'pt-BR', name: 'Portuguese', flag: '🇧🇷', voicePrefix: 'pt' },
  { code: 'hi-IN', name: 'Hindi', flag: '🇮🇳', voicePrefix: 'hi' },
  { code: 'zh-CN', name: 'Mandarin', flag: '🇨🇳', voicePrefix: 'zh' },
  { code: 'ja-JP', name: 'Japanese', flag: '🇯🇵', voicePrefix: 'ja' },
  { code: 'ar-SA', name: 'Arabic', flag: '🇸🇦', voicePrefix: 'ar' },
];

// Gesture phrase translations
export const GESTURE_TRANSLATIONS: Record<string, Record<string, string>> = {
  'Yes': {
    'en-US': 'Yes',
    'es-ES': 'Sí',
    'fr-FR': 'Oui',
    'de-DE': 'Ja',
    'it-IT': 'Sì',
    'pt-BR': 'Sim',
    'hi-IN': 'हाँ',
    'zh-CN': '是',
    'ja-JP': 'はい',
    'ar-SA': 'نعم',
  },
  'No': {
    'en-US': 'No',
    'es-ES': 'No',
    'fr-FR': 'Non',
    'de-DE': 'Nein',
    'it-IT': 'No',
    'pt-BR': 'Não',
    'hi-IN': 'नहीं',
    'zh-CN': '不',
    'ja-JP': 'いいえ',
    'ar-SA': 'لا',
  },
  'Hello': {
    'en-US': 'Hello',
    'es-ES': 'Hola',
    'fr-FR': 'Bonjour',
    'de-DE': 'Hallo',
    'it-IT': 'Ciao',
    'pt-BR': 'Olá',
    'hi-IN': 'नमस्ते',
    'zh-CN': '你好',
    'ja-JP': 'こんにちは',
    'ar-SA': 'مرحبا',
  },
  'HELLO': {
    'en-US': 'Hello',
    'es-ES': 'Hola',
    'fr-FR': 'Bonjour',
    'de-DE': 'Hallo',
    'it-IT': 'Ciao',
    'pt-BR': 'Olá',
    'hi-IN': 'नमस्ते',
    'zh-CN': '你好',
    'ja-JP': 'こんにちは',
    'ar-SA': 'مرحبا',
  },
  'THANK_YOU': {
    'en-US': 'Thank you',
    'es-ES': 'Gracias',
    'fr-FR': 'Merci',
    'de-DE': 'Danke',
    'it-IT': 'Grazie',
    'pt-BR': 'Obrigado',
    'hi-IN': 'धन्यवाद',
    'zh-CN': '谢谢',
    'ja-JP': 'ありがとう',
    'ar-SA': 'شكرا',
  },
  'PLEASE': {
    'en-US': 'Please',
    'es-ES': 'Por favor',
    'fr-FR': 'S\'il vous plaît',
    'de-DE': 'Bitte',
    'it-IT': 'Per favore',
    'pt-BR': 'Por favor',
    'hi-IN': 'कृपया',
    'zh-CN': '请',
    'ja-JP': 'お願いします',
    'ar-SA': 'من فضلك',
  },
  'Peace': {
    'en-US': 'Peace',
    'es-ES': 'Paz',
    'fr-FR': 'Paix',
    'de-DE': 'Frieden',
    'it-IT': 'Pace',
    'pt-BR': 'Paz',
    'hi-IN': 'शांति',
    'zh-CN': '和平',
    'ja-JP': '平和',
    'ar-SA': 'سلام',
  },
  'Stop': {
    'en-US': 'Stop',
    'es-ES': 'Alto',
    'fr-FR': 'Arrêtez',
    'de-DE': 'Stopp',
    'it-IT': 'Ferma',
    'pt-BR': 'Pare',
    'hi-IN': 'रुको',
    'zh-CN': '停',
    'ja-JP': '止まれ',
    'ar-SA': 'قف',
  },
  'Wait': {
    'en-US': 'Wait',
    'es-ES': 'Espera',
    'fr-FR': 'Attendez',
    'de-DE': 'Warten',
    'it-IT': 'Aspetta',
    'pt-BR': 'Espere',
    'hi-IN': 'प्रतीक्षा करें',
    'zh-CN': '等待',
    'ja-JP': '待って',
    'ar-SA': 'انتظر',
  },
  'Look': {
    'en-US': 'Look',
    'es-ES': 'Mira',
    'fr-FR': 'Regardez',
    'de-DE': 'Schau',
    'it-IT': 'Guarda',
    'pt-BR': 'Olhe',
    'hi-IN': 'देखो',
    'zh-CN': '看',
    'ja-JP': '見て',
    'ar-SA': 'انظر',
  },
  'I love you': {
    'en-US': 'I love you',
    'es-ES': 'Te amo',
    'fr-FR': 'Je t\'aime',
    'de-DE': 'Ich liebe dich',
    'it-IT': 'Ti amo',
    'pt-BR': 'Eu te amo',
    'hi-IN': 'मैं तुमसे प्यार करता हूँ',
    'zh-CN': '我爱你',
    'ja-JP': '愛してる',
    'ar-SA': 'أحبك',
  },
};

// Common words translations (for word builder)
export const WORD_TRANSLATIONS: Record<string, Record<string, string>> = {
  'HELLO': {
    'en-US': 'Hello',
    'es-ES': 'Hola',
    'fr-FR': 'Bonjour',
    'de-DE': 'Hallo',
    'it-IT': 'Ciao',
    'pt-BR': 'Olá',
    'hi-IN': 'नमस्ते',
    'zh-CN': '你好',
    'ja-JP': 'こんにちは',
    'ar-SA': 'مرحبا',
  },
  'THANK': {
    'en-US': 'Thank',
    'es-ES': 'Gracias',
    'fr-FR': 'Merci',
    'de-DE': 'Danke',
    'it-IT': 'Grazie',
    'pt-BR': 'Obrigado',
    'hi-IN': 'धन्यवाद',
    'zh-CN': '谢谢',
    'ja-JP': 'ありがとう',
    'ar-SA': 'شكرا',
  },
  'PLEASE': {
    'en-US': 'Please',
    'es-ES': 'Por favor',
    'fr-FR': 'S\'il vous plaît',
    'de-DE': 'Bitte',
    'it-IT': 'Per favore',
    'pt-BR': 'Por favor',
    'hi-IN': 'कृपया',
    'zh-CN': '请',
    'ja-JP': 'お願いします',
    'ar-SA': 'من فضلك',
  },
  'SORRY': {
    'en-US': 'Sorry',
    'es-ES': 'Lo siento',
    'fr-FR': 'Désolé',
    'de-DE': 'Entschuldigung',
    'it-IT': 'Scusa',
    'pt-BR': 'Desculpe',
    'hi-IN': 'माफ़ करना',
    'zh-CN': '对不起',
    'ja-JP': 'ごめんなさい',
    'ar-SA': 'آسف',
  },
  'HELP': {
    'en-US': 'Help',
    'es-ES': 'Ayuda',
    'fr-FR': 'Aide',
    'de-DE': 'Hilfe',
    'it-IT': 'Aiuto',
    'pt-BR': 'Ajuda',
    'hi-IN': 'मदद',
    'zh-CN': '帮助',
    'ja-JP': '助けて',
    'ar-SA': 'مساعدة',
  },
  'WATER': {
    'en-US': 'Water',
    'es-ES': 'Agua',
    'fr-FR': 'Eau',
    'de-DE': 'Wasser',
    'it-IT': 'Acqua',
    'pt-BR': 'Água',
    'hi-IN': 'पानी',
    'zh-CN': '水',
    'ja-JP': '水',
    'ar-SA': 'ماء',
  },
  'FOOD': {
    'en-US': 'Food',
    'es-ES': 'Comida',
    'fr-FR': 'Nourriture',
    'de-DE': 'Essen',
    'it-IT': 'Cibo',
    'pt-BR': 'Comida',
    'hi-IN': 'खाना',
    'zh-CN': '食物',
    'ja-JP': '食べ物',
    'ar-SA': 'طعام',
  },
};

/**
 * Translate a gesture phrase to the target language
 */
export function translateGesture(gesture: string, languageCode: string): string {
  return GESTURE_TRANSLATIONS[gesture]?.[languageCode] || gesture;
}

/**
 * Translate a spelled word to the target language
 */
export function translateWord(word: string, languageCode: string): string {
  const upperWord = word.toUpperCase();
  return WORD_TRANSLATIONS[upperWord]?.[languageCode] || word;
}

/**
 * Get language by code
 */
export function getLanguage(code: string): Language | undefined {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
}

/**
 * Save selected language to localStorage
 */
export function saveLanguagePreference(languageCode: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem('signland_language', languageCode);
  }
}

/**
 * Load language preference from localStorage
 */
export function loadLanguagePreference(): string {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('signland_language') || 'en-US';
  }
  return 'en-US';
}
