'use client';

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-blue-50 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 px-8">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-xl text-gray-600">
              Sign in to continue your journey with SignLand
            </p>
          </div>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Real-time Translation</h3>
                <p className="text-gray-600">Instant sign language to speech conversion</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Privacy First</h3>
                <p className="text-gray-600">Your video never leaves your device</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Works Offline</h3>
                <p className="text-gray-600">Fast mode requires no internet connection</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Sign In Form */}
        <div className="flex items-center justify-center">
          <div className="w-full max-w-md">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-2xl rounded-2xl",
                }
              }}
              routing="path"
              path="/sign-in"
              signUpUrl="/sign-up"
              forceRedirectUrl="/translate"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
