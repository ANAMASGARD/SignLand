'use client';

interface SmartModeResultProps {
  originalTokens: string;
  refinedText: string;
  isVisible: boolean;
}

export function SmartModeResult({ originalTokens, refinedText, isVisible }: SmartModeResultProps) {
  if (!isVisible) return null;

  return (
    <div className="mt-4 p-4 bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50 rounded-xl border-2 border-purple-300 shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 mb-3">
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
        <span className="text-sm font-bold text-purple-900">✨ Gemini AI Refinement</span>
      </div>
      
      <div className="space-y-3">
        {/* Original Tokens */}
        <div className="bg-white/60 rounded-lg p-3 border border-gray-200">
          <div className="text-xs font-semibold text-gray-500 mb-1">Your Input:</div>
          <div className="text-sm text-gray-700 font-mono">{originalTokens}</div>
        </div>
        
        {/* Arrow */}
        <div className="flex justify-center">
          <svg className="w-6 h-6 text-purple-500 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
        
        {/* Refined Output */}
        <div className="bg-gradient-to-r from-purple-100 to-indigo-100 rounded-lg p-3 border-2 border-purple-400">
          <div className="text-xs font-semibold text-purple-700 mb-1">AI Enhanced:</div>
          <div className="text-base text-purple-900 font-semibold">{refinedText}</div>
        </div>
      </div>
      
      <div className="mt-3 flex items-center gap-2 text-xs text-purple-600">
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
        </svg>
        <span>Natural language with proper grammar and politeness</span>
      </div>
    </div>
  );
}
