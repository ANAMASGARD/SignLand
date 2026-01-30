'use client';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 text-white p-4">
      <div className="max-w-md text-center">
        <div className="text-6xl mb-6">📡</div>
        <h1 className="text-3xl font-bold mb-4">You're Offline</h1>
        <p className="text-slate-300 mb-6">
          SignLand requires an internet connection for the first load. Once cached, you can use Fast Mode offline.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
