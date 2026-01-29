'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, saveLanguagePreference, loadLanguagePreference, type Language } from '@/lib/speech/translations';

interface LanguageSelectorProps {
  onLanguageChange: (languageCode: string) => void;
}

export function LanguageSelector({ onLanguageChange }: LanguageSelectorProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('en-US');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const saved = loadLanguagePreference();
    setSelectedLanguage(saved);
    onLanguageChange(saved);
  }, [onLanguageChange]);

  const handleSelect = (languageCode: string) => {
    setSelectedLanguage(languageCode);
    saveLanguagePreference(languageCode);
    onLanguageChange(languageCode);
    setIsOpen(false);
  };

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === selectedLanguage) || SUPPORTED_LANGUAGES[0];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 border border-purple-400/30"
      >
        <span className="text-2xl">{currentLang.flag}</span>
        <div className="flex flex-col items-start">
          <span className="text-xs text-purple-100 font-medium">Language</span>
          <span className="text-sm font-semibold">{currentLang.name}</span>
        </div>
        <svg
          className={`w-4 h-4 text-white transition-transform ${isOpen ? 'rotate-0' : 'rotate-180'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-full mb-2 left-0 w-48 bg-white rounded-lg shadow-xl z-50 overflow-hidden border border-purple-300">
            <div className="p-1.5 space-y-0.5 max-h-80 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md transition-all text-sm ${
                    selectedLanguage === lang.code
                      ? 'bg-purple-100 text-purple-900 font-semibold'
                      : 'hover:bg-purple-50 text-gray-900'
                  }`}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.name}</span>
                  {selectedLanguage === lang.code && (
                    <svg className="w-4 h-4 text-purple-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
