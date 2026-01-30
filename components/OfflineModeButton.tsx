'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { enableOfflineMode } from '@/lib/offline/offlineMode';
import { WifiOff } from 'lucide-react';
import { motion } from 'framer-motion';

export function OfflineModeButton() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [showDialog, setShowDialog] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleOfflineMode = () => {
    setShowDialog(true);
  };

  const startOffline = () => {
    const name = username.trim() || 'Guest';
    enableOfflineMode(name);
    setShowDialog(false); // Close dialog immediately
    router.push('/offline-translate');
  };

  if (showDialog) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <motion.div 
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ type: "spring", duration: 0.3 }}
          className="relative max-w-sm w-full"
        >
          {/* Glass card */}
          <div 
            className="rounded-2xl p-6 shadow-2xl border"
            style={{
              background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0.9) 100%)',
              backdropFilter: 'blur(20px)',
              borderColor: 'rgba(255, 255, 255, 0.5)',
            }}
          >
            {/* Icon & Title */}
            <div className="flex items-center gap-3 mb-4">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                }}
              >
                <WifiOff className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Offline Mode</h3>
                <p className="text-xs text-slate-500">No internet required</p>
              </div>
            </div>
            
            {/* Description */}
            <p className="text-sm text-slate-600 mb-4">
              Use Fast Mode without login. AI features need internet.
            </p>
            
            {/* Name Input */}
            <div className="mb-4">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name (optional)"
                className="w-full px-4 py-2.5 text-sm border border-slate-200 rounded-xl focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-all outline-none"
                style={{
                  background: 'rgba(248, 250, 252, 0.8)',
                }}
              />
              <button
                onClick={() => setUsername('')}
                className="text-xs text-slate-500 hover:text-slate-700 mt-1.5 transition-colors"
              >
                Skip name
              </button>
            </div>
            
            {/* Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowDialog(false)}
                className="flex-1 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all"
              >
                Cancel
              </button>
              <button
                onClick={startOffline}
                className="flex-1 px-4 py-2.5 text-sm font-semibold text-white rounded-xl transition-all shadow-lg hover:shadow-xl"
                style={{
                  background: 'linear-gradient(135deg, #475569 0%, #334155 100%)',
                }}
              >
                Start
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="relative">
      <motion.div
        onClick={handleOfflineMode}
        className="px-8 py-3.5 text-base rounded-full font-medium relative overflow-hidden cursor-pointer"
        style={{
          background: 'linear-gradient(135deg, rgba(71, 85, 105, 0.95) 0%, rgba(51, 65, 85, 0.9) 100%)',
          backdropFilter: 'blur(40px) saturate(200%)',
          WebkitBackdropFilter: 'blur(40px) saturate(200%)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 2px 4px rgba(255, 255, 255, 0.2), inset 0 -2px 4px rgba(0, 0, 0, 0.2)',
          border: '1.5px solid rgba(148, 163, 184, 0.5)',
          color: '#ffffff',
        }}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ scale: 1.05, y: -4 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {/* Iridescent overlay */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(135deg, rgba(100, 116, 139, 0.3) 0%, rgba(71, 85, 105, 0.3) 50%, rgba(51, 65, 85, 0.3) 100%)',
            opacity: 0.7,
          }}
        />

        {/* Spotlight effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle 100px at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.2), transparent 80%)`,
            opacity: isHovered ? 1 : 0,
          }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.2 }}
        />

        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
            transform: 'translateX(-100%)',
          }}
          animate={isHovered ? { x: ['0%', '200%'] } : {}}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
        />

        {/* Button content */}
        <span className="relative z-10 flex items-center justify-center gap-2" style={{ fontFamily: 'var(--font-sf)' }}>
          <WifiOff className="w-5 h-5" />
          Use Offline Mode
        </span>
      </motion.div>

      {/* Badge - positioned absolutely on top right */}
      <motion.span
        className="absolute -top-1 -right-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-lg z-20"
        animate={{ scale: [1, 1.05, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        No Login
      </motion.span>
    </div>
  );
}
