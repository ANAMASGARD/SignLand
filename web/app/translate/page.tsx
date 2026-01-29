'use client';

import { UserButton, useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { GestureRecognizer } from '@/components/GestureRecognizer';

export default function TranslatePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      router.push('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  if (!isLoaded || !isSignedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

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
          background: #f3f4f6;
        }
        .page-scroll-container::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #9333ea 0%, #7e22ce 100%);
          border-radius: 7px;
        }
        .page-scroll-container::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #7e22ce 0%, #6b21a8 100%);
        }
      `}</style>
      <div 
        className="page-scroll-container h-screen overflow-y-scroll scroll-smooth"
        style={{
          scrollbarColor: '#9333ea #f3f4f6',
          scrollbarWidth: 'auto'
        }}
      >
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-50 pr-5">
          {/* Header - Reduced Height */}
          <header className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3 md:space-x-4">
                  <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    SignLand
                  </h1>
                  <span className="hidden sm:inline text-xs md:text-sm text-gray-500 px-2 py-1 bg-purple-100 rounded-full">
                    Translate
                  </span>
                </div>
                
                <div className="flex items-center space-x-2 md:space-x-4">
                  <span className="hidden sm:inline text-xs md:text-sm text-gray-600">
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
          </header>

          {/* Main Content */}
          <main className="py-4 md:py-6">
            <GestureRecognizer />
          </main>
        </div>
      </div>
    </>
  );
}
