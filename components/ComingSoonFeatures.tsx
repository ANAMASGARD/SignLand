'use client';

import { useState } from 'react';

interface PhraseCategory {
  name: string;
  icon: string;
  phrases: Array<{
    name: string;
    motion: string;
    complexity: 'Low' | 'Medium' | 'High';
  }>;
}

const PHRASE_CATEGORIES: PhraseCategory[] = [
  {
    name: 'Greetings & Politeness',
    icon: '🤝',
    phrases: [
      { name: 'HELLO', motion: 'Wave hand side-to-side', complexity: 'Medium' },
      { name: 'GOODBYE', motion: 'Wave hand away', complexity: 'Medium' },
      { name: 'THANK YOU', motion: 'Hand from lips forward', complexity: 'Medium' },
      { name: 'PLEASE', motion: 'Flat hand circle on chest', complexity: 'High' },
      { name: 'SORRY', motion: 'Fist circle on chest', complexity: 'High' },
    ],
  },
  {
    name: 'Basic Needs',
    icon: '🍽️',
    phrases: [
      { name: 'WATER', motion: 'W-shape tap chin', complexity: 'High' },
      { name: 'EAT', motion: 'Fingertips to mouth', complexity: 'Medium' },
      { name: 'DRINK', motion: 'C-shape to mouth tilt', complexity: 'High' },
      { name: 'MORE', motion: 'Fingertips tap together', complexity: 'Medium' },
      { name: 'BATHROOM', motion: 'T-shape shake sideways', complexity: 'High' },
      { name: 'HUNGRY', motion: 'C-hand down throat', complexity: 'High' },
    ],
  },
  {
    name: 'Questions',
    icon: '❓',
    phrases: [
      { name: 'WHERE', motion: 'Index finger wave', complexity: 'Medium' },
      { name: 'WHAT', motion: 'Palms up shrug', complexity: 'Low' },
      { name: 'WHY', motion: 'Fingers to forehead', complexity: 'Low' },
    ],
  },
  {
    name: 'Emotions',
    icon: '😊',
    phrases: [
      { name: 'GOOD', motion: 'Hand from mouth forward', complexity: 'Medium' },
      { name: 'BAD', motion: 'Hand from mouth down', complexity: 'Medium' },
      { name: 'HAPPY', motion: 'Double chest tap upward', complexity: 'High' },
      { name: 'SAD', motion: 'Hands down face slide', complexity: 'Medium' },
      { name: 'TIRED', motion: 'Hands droop shoulders', complexity: 'Medium' },
    ],
  },
  {
    name: 'Emergency',
    icon: '🆘',
    phrases: [
      { name: 'HELP', motion: 'Fist on flat palm lift', complexity: 'High' },
      { name: 'SICK', motion: 'Hand to forehead/stomach', complexity: 'High' },
    ],
  },
];

export function ComingSoonFeatures() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const totalPhrases = PHRASE_CATEGORIES.reduce((sum, cat) => sum + cat.phrases.length, 0);
  const currentFeatures = 33; // 26 letters + 7 gestures
  const totalFeatures = currentFeatures + totalPhrases;
  const progress = (currentFeatures / totalFeatures) * 100;

  return (
    <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">🚀</span>
          <div className="text-left">
            <h3 className="text-lg font-bold text-gray-800">Coming Soon: 20 Motion Phrases</h3>
            <p className="text-sm text-gray-600">Version 2.0 - Q2 2026</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
            ROADMAP
          </span>
          <svg
            className={`w-5 h-5 text-gray-600 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {/* Progress Bar */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-gray-700">Feature Progress</span>
              <span className="text-sm text-gray-600">
                {currentFeatures}/{totalFeatures} features ({Math.round(progress)}%)
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-2 flex items-center gap-4 text-xs text-gray-600">
              <span>✅ 26 Letters</span>
              <span>✅ 7 Gestures</span>
              <span>🔜 20 Motion Phrases</span>
            </div>
          </div>

          {/* Categories */}
          <div className="p-4 space-y-3">
            {PHRASE_CATEGORIES.map((category) => (
              <div key={category.name} className="border border-gray-200 rounded-lg overflow-hidden">
                <button
                  onClick={() =>
                    setExpandedCategory(expandedCategory === category.name ? null : category.name)
                  }
                  className="w-full p-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{category.icon}</span>
                    <span className="font-semibold text-gray-800">{category.name}</span>
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">
                      {category.phrases.length}
                    </span>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-600 transition-transform ${
                      expandedCategory === category.name ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {expandedCategory === category.name && (
                  <div className="border-t border-gray-200 bg-gray-50 p-3 space-y-2">
                    {category.phrases.map((phrase) => (
                      <div
                        key={phrase.name}
                        className="p-3 bg-white rounded-lg border border-gray-200 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-gray-800">{phrase.name}</span>
                            <span
                              className={`px-2 py-0.5 text-xs rounded-full ${
                                phrase.complexity === 'Low'
                                  ? 'bg-green-100 text-green-700'
                                  : phrase.complexity === 'Medium'
                                  ? 'bg-yellow-100 text-yellow-700'
                                  : 'bg-red-100 text-red-700'
                              }`}
                            >
                              {phrase.complexity}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600">{phrase.motion}</p>
                        </div>
                        <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-semibold rounded-full">
                          Coming Soon
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="p-4 bg-gradient-to-r from-purple-50 to-blue-50 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-800 mb-1">Want to be notified?</p>
                <p className="text-xs text-gray-600">Get updates when v2.0 launches in Q2 2026</p>
              </div>
              <a
                href="/ROADMAP.md"
                target="_blank"
                className="px-4 py-2 bg-purple-600 text-white text-sm font-semibold rounded-lg hover:bg-purple-700 transition-colors"
              >
                View Full Roadmap
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
