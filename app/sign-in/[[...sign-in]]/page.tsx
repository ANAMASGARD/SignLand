import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import { Hand, Mic, Lock, Wifi, Users } from "lucide-react";

export default function Page() {
  return (
    <section className="relative min-h-screen w-full overflow-hidden">
      {/* Full Screen Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          alt="Person communicating with American Sign Language"
          src="/GIRL-IMAGE.jpg"
          className="h-full w-full object-cover brightness-125"
          priority
          fill
          sizes="100vw"
        />
        {/* Lighter overlay for better visibility */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-black/30 to-black/40" />
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
                Welcome Back 👋
              </h2>

              <p className="text-base leading-relaxed text-white drop-shadow-xl">
                Continue your journey of seamless communication through sign language.
              </p>
            </div>

            {/* Feature Points */}
            <div className="space-y-2.5 pt-2">
              <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
                  <Hand className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm drop-shadow-xl">26 ASL Letters + Phrases</h3>
                  <p className="text-white text-xs drop-shadow-lg">Complete alphabet recognition</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                  <Mic className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm drop-shadow-xl">Natural Voice Output</h3>
                  <p className="text-white text-xs drop-shadow-lg">High-quality text-to-speech</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-green-500 flex items-center justify-center shadow-lg">
                  <Wifi className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm drop-shadow-xl">Works Offline</h3>
                  <p className="text-white text-xs drop-shadow-lg">No internet required</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-pink-500 flex items-center justify-center shadow-lg">
                  <Lock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm drop-shadow-xl">Your Privacy Matters</h3>
                  <p className="text-white text-xs drop-shadow-lg">Zero video upload</p>
                </div>
              </div>

              <div className="flex items-start gap-3 bg-white/20 backdrop-blur-md rounded-lg p-3 border border-white/30">
                <div className="flex-shrink-0 w-9 h-9 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-white text-sm drop-shadow-xl">Empowering Community</h3>
                  <p className="text-white text-xs drop-shadow-lg">Join thousands worldwide</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Sign In Form Overlay */}
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
                Welcome Back 👋
              </h1>

              <p className="mt-1 text-sm text-white drop-shadow-xl">
                Continue your communication journey
              </p>
            </div>

            {/* Sign In Component with glass effect */}
            <div className="bg-white backdrop-blur-md rounded-xl shadow-2xl p-5 lg:p-6 border-0">
              <SignIn 
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    card: "shadow-none bg-transparent w-full border-0",
                    headerTitle: "hidden",
                    headerSubtitle: "hidden",
                    socialButtonsBlockButton: "bg-white hover:bg-gray-50 border-0 shadow-sm text-sm",
                    formButtonPrimary: "bg-purple-600 hover:bg-purple-700 text-sm normal-case shadow-md border-0",
                    footerAction: "hidden",
                    formFieldInput: "border border-gray-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 rounded-lg text-sm",
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
