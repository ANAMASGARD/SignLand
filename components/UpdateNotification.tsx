'use client';

import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';

export function UpdateNotification() {
  const [showUpdate, setShowUpdate] = useState(false);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                setShowUpdate(true);
              }
            });
          }
        });
      });
    }
  }, []);

  const handleUpdate = () => {
    window.location.reload();
  };

  if (!showUpdate) return null;

  return (
    <div className="fixed top-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50 animate-slide-down">
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl shadow-xl p-4 backdrop-blur-xl border border-white/20">
        <div className="flex items-center gap-3">
          <RefreshCw className="w-5 h-5 flex-shrink-0" />
          <div className="flex-1">
            <p className="font-semibold text-sm">Update Available</p>
            <p className="text-xs text-white/90">A new version is ready</p>
          </div>
          <button
            onClick={handleUpdate}
            className="bg-white text-green-600 font-semibold py-2 px-4 rounded-lg text-sm hover:bg-white/90 transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}
