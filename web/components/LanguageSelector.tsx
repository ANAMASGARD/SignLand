'use client';

import { useState, useEffect } from 'react';
import { SUPPORTED_LANGUAGES, saveLanguagePreference, loadLanguagePreference, type Language } from '@/lib/speech/translations';

interface LanguageSelectorProps {
  onLanguageChange: (languageCode: string) => void;
  isDark?: boolean;
}

export function LanguageSelector({ onLanguageChange, isDark = false }: LanguageSelectorProps) {
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
        className="group relative px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden backdrop-blur-md"
        style={{
          background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
          color: '#ffffff',
          border: '2px solid #818cf8',
          boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)',
        }}
      >
        <span className="relative z-10 flex items-center gap-2">
          <span className="text-2xl">{currentLang.flag}</span>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-bold opacity-90">Language</span>
            <span className="text-sm font-bold">{currentLang.name}</span>
          </div>
          <svg
            className={`w-4 h-4 transition-transform duration-300 ${isOpen ? 'rotate-0' : 'rotate-180'}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </span>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <div 
            className="absolute bottom-full mb-2 left-0 w-56 rounded-2xl shadow-2xl z-50 overflow-hidden backdrop-blur-xl"
            style={{
              background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
              border: `2px solid ${isDark ? 'rgba(139, 92, 246, 0.3)' : 'rgba(139, 92, 246, 0.2)'}`,
            }}
          >
            <div className="p-2 space-y-1 max-h-80 overflow-y-auto">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium"
                  style={{
                    background: selectedLanguage === lang.code
                      ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
                      : 'transparent',
                    color: selectedLanguage === lang.code
                      ? '#ffffff'
                      : isDark ? '#e2e8f0' : '#1f2937',
                  }}
                >
                  <span className="text-xl">{lang.flag}</span>
                  <span className="flex-1 text-left font-semibold">{lang.name}</span>
                  {selectedLanguage === lang.code && (
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
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
