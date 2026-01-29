'use client';

import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  isDark: boolean;
  onToggle: () => void;
}

export function ThemeToggle({ isDark, onToggle }: ThemeToggleProps) {
  return (
    <motion.button
      onClick={onToggle}
      className="relative w-16 h-8 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
      style={{
        backgroundColor: isDark ? '#1e293b' : '#e2e8f0',
      }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Toggle Circle */}
      <motion.div
        className="absolute top-1 w-6 h-6 rounded-full shadow-lg flex items-center justify-center"
        style={{
          backgroundColor: isDark ? '#0f172a' : '#ffffff',
        }}
        animate={{
          x: isDark ? 32 : 0,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        {isDark ? (
          <Moon className="w-4 h-4 text-purple-400" />
        ) : (
          <Sun className="w-4 h-4 text-yellow-500" />
        )}
      </motion.div>

      {/* Background Icons */}
      <div className="flex items-center justify-between px-2">
        <Sun className={`w-3 h-3 ${isDark ? 'text-slate-600' : 'text-yellow-400'}`} />
        <Moon className={`w-3 h-3 ${isDark ? 'text-purple-400' : 'text-slate-400'}`} />
      </div>
    </motion.button>
  );
}
