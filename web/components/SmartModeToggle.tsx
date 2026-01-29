'use client';

interface SmartModeToggleProps {
  enabled: boolean;
  onToggle: (enabled: boolean) => void;
  isRefining?: boolean;
  isDark?: boolean;
}

export function SmartModeToggle({ enabled, onToggle, isRefining, isDark = false }: SmartModeToggleProps) {
  return (
    <div className="relative">
      <button
        onClick={() => onToggle(!enabled)}
        disabled={isRefining}
        className="group relative px-5 py-3 rounded-2xl font-semibold text-sm transition-all duration-300 overflow-hidden backdrop-blur-md disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: enabled
            ? 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)'
            : isDark ? 'rgba(71, 85, 105, 0.6)' : 'rgba(148, 163, 184, 0.3)',
          color: enabled ? '#ffffff' : isDark ? '#cbd5e1' : '#475569',
          border: `2px solid ${enabled ? '#a78bfa' : isDark ? '#475569' : '#cbd5e1'}`,
          boxShadow: enabled 
            ? '0 8px 20px rgba(139, 92, 246, 0.3)' 
            : '0 4px 12px rgba(0, 0, 0, 0.05)',
        }}
      >
        <span className="relative z-10 flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-bold flex items-center gap-1">
              Smart Mode
              {enabled && (
                <span className="px-1.5 py-0.5 bg-white/20 text-xs rounded-full font-bold">
                  AI
                </span>
              )}
            </span>
            <span className="text-xs opacity-90">
              {enabled ? 'Natural language' : 'Direct translation'}
            </span>
          </div>
        </span>
      </button>
      
      {isRefining && (
        <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-2xl" style={{ background: 'rgba(0, 0, 0, 0.3)' }}>
          <div className="flex items-center gap-2 text-white">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-bold">Refining...</span>
          </div>
        </div>
      )}
    </div>
  );
}
