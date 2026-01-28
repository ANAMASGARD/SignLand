'use client';

import { SignUp } from '@clerk/nextjs';

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Sign Up Form */}
        <div className="flex items-center justify-center order-2 lg:order-1">
          <div className="w-full max-w-md">
            <SignUp 
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "shadow-2xl rounded-2xl",
                }
              }}
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
              forceRedirectUrl="/translate"
            />
          </div>
        </div>

        {/* Right side - Branding */}
        <div className="hidden lg:flex flex-col justify-center space-y-6 px-8 order-1 lg:order-2">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Start Your Journey
            </h1>
            <p className="text-xl text-gray-600">
              Join SignLand and communicate effortlessly with sign language
            </p>
          </div>
          
          <div className="space-y-4 pt-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Easy to Use</h3>
                <p className="text-gray-600">Start communicating in seconds with just your webcam</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Multilingual</h3>
                <p className="text-gray-600">Choose from multiple languages and voices</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">AI-Powered</h3>
                <p className="text-gray-600">Smart mode refines gestures into natural speech</p>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              🔒 Your privacy is our priority. Video processing happens locally on your device.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
