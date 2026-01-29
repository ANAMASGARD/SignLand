'use client';

interface SmartModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isRefining?: boolean;
}

export function SmartModeToggle({ enabled, onToggle, isRefining }: SmartModeToggleProps) {
  return (
    <div className="relative">
      <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl shadow-lg border border-indigo-400/30">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-white font-semibold text-sm">Smart Mode</span>
            {enabled && (
              <span className="px-2 py-0.5 bg-white/20 text-white text-xs rounded-full font-medium">
                AI
              </span>
            )}
          </div>
          <p className="text-white/80 text-xs mt-0.5">
            {enabled ? 'Natural language with Gemini' : 'Direct translation'}
          </p>
        </div>
        
        <button
          onClick={() => onToggle(!enabled)}
          disabled={isRefining}
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${
            enabled ? 'bg-green-400' : 'bg-gray-400'
          } ${isRefining ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-md'}`}
        >
          <span
            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow-md transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
      
      {isRefining && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm rounded-xl">
          <div className="flex items-center gap-2 text-white">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium">Refining...</span>
          </div>
        </div>
      )}
    </div>
  );
}
