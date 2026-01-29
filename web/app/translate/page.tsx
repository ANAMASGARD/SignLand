'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { GestureRecognizer } from '@/components/GestureRecognizer';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function TranslatePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setIsDark(true);
    }
  }, []);

  const toggleTheme = () => {
    setIsDark((prev) => {
      const newValue = !prev;
      localStorage.setItem('theme', newValue ? 'dark' : 'light');
      return newValue;
    });
  };

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: isDark ? '#0f172a' : '#f8fafc' }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: isDark ? '#a78bfa' : '#9333ea' }}></div>
      </div>
    );
  }

  const theme = {
    bg: isDark ? '#0f172a' : '#f8fafc',
    bgGradient: isDark 
      ? 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #1e293b 100%)'
      : 'linear-gradient(135deg, #f8fafc 0%, #f3e8ff 50%, #dbeafe 100%)',
    headerBg: isDark ? 'rgba(15, 23, 42, 0.8)' : 'rgba(255, 255, 255, 0.8)',
    headerBorder: isDark ? 'rgba(148, 163, 184, 0.1)' : 'rgba(229, 231, 235, 0.5)',
    titleGradient: isDark
      ? 'linear-gradient(to right, #a78bfa, #60a5fa, #818cf8)'
      : 'linear-gradient(to right, #9333ea, #2563eb, #4f46e5)',
    badgeBg: isDark ? '#312e81' : '#f3e8ff',
    badgeText: isDark ? '#c4b5fd' : '#6b7280',
    userText: isDark ? '#cbd5e1' : '#4b5563',
    scrollbarTrack: isDark ? '#1e293b' : '#f3f4f6',
    scrollbarThumb: isDark 
      ? 'linear-gradient(180deg, #7c3aed 0%, #6d28d9 100%)'
      : 'linear-gradient(180deg, #9333ea 0%, #7e22ce 100%)',
  };

  return (
    <>
      <style jsx global>{`
        body {
          overflow: hidden;
        }
        .page-scroll-container::-webkit-scrollbar {
          width: 14px;
        }
        .page-scroll-container::-webkit-scrollbar-track {
          background: ${theme.scrollbarTrack};
        }
        .page-scroll-container::-webkit-scrollbar-thumb {
          background: ${theme.scrollbarThumb};
          border-radius: 7px;
        }
        .page-scroll-container::-webkit-scrollbar-thumb:hover {
          background: ${isDark ? 'linear-gradient(180deg, #6d28d9 0%, #5b21b6 100%)' : 'linear-gradient(180deg, #7e22ce 0%, #6b21a8 100%)'};
        }
      `}</style>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="page-scroll-container h-screen overflow-y-scroll scroll-smooth"
        style={{
          background: theme.bgGradient,
          scrollbarColor: `${isDark ? '#7c3aed' : '#9333ea'} ${theme.scrollbarTrack}`,
          scrollbarWidth: 'auto'
        }}
      >
        <div className="min-h-screen pr-5">
          {/* Header */}
          <motion.header
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="backdrop-blur-md shadow-sm sticky top-0 z-50"
            style={{
              backgroundColor: theme.headerBg,
              borderBottom: `1px solid ${theme.headerBorder}`,
            }}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <a 
                    href="/"
                    className="text-xl md:text-2xl font-bold bg-clip-text text-transparent cursor-pointer hover:opacity-80 transition-opacity"
                    style={{ backgroundImage: theme.titleGradient }}
                  >
                    SignLand
                  </a>
                  <span 
                    className="hidden sm:inline text-xs md:text-sm px-2 py-1 rounded-full"
                    style={{ 
                      backgroundColor: theme.badgeBg,
                      color: theme.badgeText
                    }}
                  >
                    Translate
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 md:space-x-4">
                  <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
                  <span 
                    className="hidden sm:inline text-xs md:text-sm"
                    style={{ color: theme.userText }}
                  >
                    {user.firstName || user.username}
                  </span>
                  <UserButton 
                    appearance={{
                      elements: {
                        avatarBox: "w-8 h-8 md:w-10 md:h-10"
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          </motion.header>

          {/* Main Content */}
          <main className="py-4 md:py-6">
            <GestureRecognizer isDark={isDark} />
          </main>
        </div>
      </motion.div>
    </>
  );
}
