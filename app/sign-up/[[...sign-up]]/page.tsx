import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import { Hand, Sparkles, Globe, Shield, Zap } from "lucide-react";

export default function Page() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Person using American Sign Language"
          src="/man-sign.jpg"
          className="h-full w-full object-cover"
          priority
          fill
          sizes="100vw"
        />
        {/* Dark overlay for better readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/65 via-black/55 to-black/65" />
      </div>

      {/* Content Overlay */}
      <div className="relative z-10 flex min-h-screen">
        {/* Left Side - Welcome Text */}
        <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-8">
          <div className="max-w-md space-y-6">
            <a className="inline-block" href="/">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🗣️</span>
                <span className="text-2xl font-bold text-white tracking-tight drop-shadow-2xl">SignLand</span>
              </div>
            </a>

            <div className="space-y-3">
              <h2 className="text-4xl font-bold text-white leading-tight drop-shadow-2xl">
                Start Your Journey 🌟
              </h2>

              <p className="text-base leading-relaxed text-white drop-shadow-xl">
                Break communication barriers with AI-powered sign language translation.
              </p>
            </div>

            {/* Feature Points */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm drop-shadow-xl">Instant Translation</h3>
                  <p className="text-white text-xs drop-shadow-lg">Real-time ASL recognition</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm drop-shadow-xl">AI-Powered Smart Mode</h3>
                  <p className="text-white text-xs drop-shadow-lg">Natural conversational speech</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <Globe className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm drop-shadow-xl">10 Languages</h3>
                  <p className="text-white text-xs drop-shadow-lg">Communicate globally</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center shadow-lg">
                  <Shield className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm drop-shadow-xl">100% Privacy</h3>
                  <p className="text-white text-xs drop-shadow-lg">Local processing only</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign Up Form Overlay */}
        <div className="w-full lg:w-1/2 flex items-start justify-center p-4 lg:p-6 overflow-y-auto">
          <div className="w-full max-w-md my-auto">
            {/* Mobile Header */}
            <div className="mb-4 lg:hidden text-center">
              <a
                className="inline-flex items-center justify-center mb-3 hover:opacity-80 transition-all"
                href="/"
              >
                <span className="text-4xl">🗣️</span>
              </a>

              <h1 className="text-xl font-bold text-white drop-shadow-2xl">
                Start Your Journey 🌟
              </h1>

              <p className="mt-1 text-sm text-white drop-shadow-xl">
                Break communication barriers with AI
              </p>
            </div>

            {/* Sign Up Component with glass effect */}
            <div className="bg-white backdrop-blur-md rounded-xl shadow-2xl p-5 lg:p-6 border-0">
              <SignUp 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent w-full border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "bg-white hover:bg-gray-50 border-0 shadow-sm text-sm",
                    formButtonPrimary: "bg-blue-600 hover:bg-blue-700 text-sm normal-case shadow-md border-0",
                    footerAction: "hidden",
                    formFieldInput: "border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-lg text-sm",
                    identityPreviewEditButton: "border-0",
                    formFieldLabel: "text-sm",
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
