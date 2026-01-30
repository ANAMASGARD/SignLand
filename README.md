# 🗣️ SignLand

### Real-Time Sign Language to Speech Communication

> **Empowering non-verbal individuals to communicate naturally through AI-powered gesture recognition**

<div align="center">

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-Try_Now-blue?style=for-the-badge)](https://your-deployment-url.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

</div>

---

## 🌟 What is SignLand?

SignLand is a **privacy-first**, **real-time** web application that converts American Sign Language (ASL) into spoken audio. Using only a webcam and speakers, non-verbal individuals can communicate naturally without specialized hardware or continuous internet connectivity.

### ✨ Key Highlights

- 🔤 **26 ASL Letters** - Complete alphabet recognition with real-time detection
- 🎯 **7 Common Gestures** - Quick phrases (thumbs up, peace, stop, etc.)
- 🗣️ **Instant Speech** - Sub-500ms latency from gesture to audio
- 🌍 **10 Languages** - Multilingual support for global accessibility
- 🤖 **AI-Powered Smart Mode** - Natural language refinement with Gemini
- 🔒 **100% Privacy** - All processing happens locally in your browser
- ⚡ **Works Offline** - Fast Mode requires no internet connection
- 📱 **Cross-Platform** - Desktop and mobile browsers

---

## 🎥 Demo Video

> **[Watch the 3-minute demo video](https://your-video-url.com)** to see SignLand in action!

---

## 🚀 Quick Start for Judges (5 Minutes - 100% FREE)

### Prerequisites

- **Node.js** 18+ ([Download here](https://nodejs.org/))
- **Modern browser** with webcam (Chrome, Firefox, Safari, Edge)
- **5 minutes** of your time

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the repository
git clone https://github.com/ANAMASGARD/SignLand.git
cd SignLand

# Install dependencies
npm install
```

### Step 2: Get FREE API Keys (2 minutes)

#### Required: Clerk Authentication (FREE - 2 minutes)

1. **Go to**: [https://clerk.com](https://clerk.com)
2. **Click**: "Start building for free"
3. **Sign up**: Use Google/GitHub (instant)
4. **Create application**: Click "Add application" → Name it "SignLand"
5. **Copy keys**: You'll see them immediately on the dashboard
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` (starts with `pk_test_`)
   - `CLERK_SECRET_KEY` (starts with `sk_test_`)

**Clerk Free Tier**: 10,000 monthly active users - more than enough for testing!

#### Optional: Gemini API (FREE - 1 minute)

Smart Mode is **optional** - the app works 100% without it!

If you want to test Smart Mode:

1. **Go to**: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. **Click**: "Create API key"
3. **Copy**: Your API key

**Gemini Free Tier**: 60 requests per minute - plenty for testing!

### Step 3: Configure Environment (30 seconds)

```bash
# Copy the example file
cp .env.example .env.local
```

**Edit `.env.local`** and paste your keys:

```bash
# Required: Paste your Clerk keys here
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_YOUR_KEY_HERE
CLERK_SECRET_KEY=sk_test_YOUR_KEY_HERE

# Optional: Paste Gemini key here (or leave empty)
GEMINI_API_KEY=YOUR_GEMINI_KEY_HERE

# These are already set correctly:
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/translate
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/translate
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Step 4: Run the App (30 seconds)

```bash
npm run dev
```

**Open**: [http://localhost:3000](http://localhost:3000)

### Step 5: Test the App (2 minutes)

1. **Click** "Get Started" or "Sign in"
2. **Create account** (email or Google/GitHub)
3. **Grant camera permission** when prompted
4. **Click "Enable Audio"** to unlock speech
5. **Click "Start Camera"**
6. **Make ASL signs** and hear them spoken!

---

## 💰 API Costs & Rate Limits

### Clerk (Required)
- **Cost**: FREE forever
- **Free Tier**: 10,000 monthly active users
- **Rate Limits**: None for testing
- **No credit card required**

### Google Gemini (Optional - Smart Mode Only)
- **Cost**: FREE
- **Free Tier**: 60 requests per minute, 1,500 per day
- **Rate Limits**: More than enough for testing
- **No credit card required**

### MediaPipe (Hand Tracking)
- **Cost**: FREE
- **Runs locally** in browser (no API calls)
- **No rate limits**

### Web Speech API (Text-to-Speech)
- **Cost**: FREE
- **Built into browser** (no API calls)
- **No rate limits**

**Total Cost to Test**: $0.00 🎉

---

## 🧪 Testing Without Smart Mode

**Don't want to set up Gemini?** No problem!

The app works **100% without it**:

1. Set up only Clerk keys (required)
2. Leave `GEMINI_API_KEY` empty in `.env.local`
3. Run the app normally
4. Use **Fast Mode** (default) - works offline!
5. Smart Mode toggle will be disabled (expected behavior)

**You can still test**:
- ✅ ASL alphabet detection (26 letters)
- ✅ Gesture recognition (7 phrases)
- ✅ Speech synthesis (10 languages)
- ✅ Word building
- ✅ Language switching
- ✅ Dark/light theme
- ✅ All core features

---

## 🚀 Quick Start

---

## 📖 How to Use

### 1️⃣ ASL Alphabet Mode (Spell Words)

Perfect for spelling out names, places, or specific words.

1. Click **"ASL Alphabet"** button
2. Click **"Enable Audio"** to unlock speech synthesis
3. Click **"Start Camera"** to begin detection
4. Sign letters using standard ASL hand shapes
5. Hear each letter spoken as you sign
6. Words auto-complete after 3 seconds of inactivity

**Supported Letters**: A-Z (all 26 ASL alphabet letters)

### 2️⃣ Gesture Mode (Quick Phrases)

Express common phrases with simple gestures.

1. Click **"Gesture Mode"** button
2. Make gestures in front of your webcam
3. Hear phrases spoken instantly

**Supported Gestures**:
- 👍 Thumbs Up → "Yes" / "Good"
- 👎 Thumbs Down → "No" / "Bad"
- ✌️ Peace Sign → "Peace" / "Victory"
- ✋ Stop Hand → "Stop" / "Wait"
- 👀 Look Gesture → "Look" / "See"
- ❤️ I Love You → "I love you"

### 3️⃣ Smart Mode (AI Enhancement)

Refine your signs into natural, conversational speech.

1. Toggle **"Smart Mode"** ON
2. Sign letters to spell words
3. AI refines your text into natural sentences
4. Hear polished, conversational speech

**Example**:
- **Input**: H-E-L-L-O H-O-W A-R-E Y-O-U
- **Output**: "Hello! How are you doing today?"

### 4️⃣ Language Selection

Communicate in your preferred language.

1. Click the **language selector** dropdown
2. Choose from 10 supported languages
3. Speech output automatically switches

**Supported Languages**:
- 🇺🇸 English
- 🇪🇸 Spanish
- 🇫🇷 French
- 🇩🇪 German
- 🇮🇹 Italian
- 🇵🇹 Portuguese
- 🇮🇳 Hindi
- 🇨🇳 Mandarin
- 🇯🇵 Japanese
- 🇸🇦 Arabic

---

## 🏗️ Architecture

### Technology Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Framework** | Next.js 16 | App Router, SSR, API routes |
| **Language** | TypeScript 5 | Type safety, developer experience |
| **UI Library** | React 19 | Component-based architecture |
| **Styling** | Tailwind CSS 4 | Utility-first styling |
| **Animation** | Framer Motion | Smooth transitions |
| **3D Graphics** | Three.js + R3F | Landing page robot |
| **Hand Tracking** | MediaPipe WASM | Client-side gesture recognition |
| **AI Enhancement** | Google Gemini | Natural language refinement |
| **Speech Synthesis** | Web Speech API | Browser-native TTS |
| **Authentication** | Clerk | User management, protected routes |
| **Deployment** | Vercel | Serverless, edge functions |

### System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Browser (Client)                      │
├─────────────────────────────────────────────────────────────┤
│  Webcam Stream → MediaPipe WASM (Hand Tracking)             │
│       ↓                                                      │
│  ASL Detection (26 Letters + 7 Gestures)                    │
│       ↓                                                      │
│  Word Building & Stabilization                              │
│       ↓                                                      │
│  ┌──────────────────┐         ┌────────────────────┐       │
│  │   Fast Mode      │         │   Smart Mode       │       │
│  │   (Offline)      │         │   (Optional)       │       │
│  │                  │         │                    │       │
│  │  Local TTS  ────►│         │  → API → Gemini   │       │
│  │  Immediate       │         │  → Refined Text    │       │
│  │  Speech          │         │  → Natural TTS     │       │
│  └──────────────────┘         └────────────────────┘       │
└─────────────────────────────────────────────────────────────┘
```

### Privacy-First Design

- ✅ **No Video Upload**: Webcam stream never leaves your device
- ✅ **Local Processing**: MediaPipe runs entirely in browser
- ✅ **Optional Cloud**: Smart Mode only sends text (never video)
- ✅ **User Control**: Explicit opt-in for AI features
- ✅ **Secure Auth**: Clerk handles authentication securely

---

## 📁 Project Structure

```
SignLand/
├── app/                          # Next.js App Router
│   ├── api/                      # API routes
│   │   ├── refine/              # Gemini text refinement
│   │   └── detect-asl/          # Gemini Vision ASL detection
│   ├── sign-in/                 # Clerk authentication pages
│   ├── sign-up/
│   ├── translate/               # Main app interface (protected)
│   ├── layout.tsx               # Root layout with providers
│   ├── page.tsx                 # Landing page
│   └── globals.css              # Global styles
├── components/                   # React components
│   ├── landing/                 # Landing page components
│   │   ├── Hero.tsx            # Hero section with 3D robot
│   │   ├── HeroScene.tsx       # Three.js scene wrapper
│   │   └── HeroModel.tsx       # 3D robot model loader
│   ├── ui/                      # Reusable UI components
│   │   ├── GlassButton.tsx     # Glassmorphism button
│   │   └── ShimmerButton.tsx   # Animated shimmer button
│   ├── GestureRecognizer.tsx   # Main gesture recognition (56KB)
│   ├── LanguageSelector.tsx    # Language dropdown
│   ├── SmartModeToggle.tsx     # AI mode toggle
│   ├── SmartModeResult.tsx     # Refinement display
│   └── ThemeToggle.tsx         # Dark/light theme
├── lib/                         # Core libraries
│   ├── mediapipe/              # Hand tracking & ASL detection
│   │   ├── aslAlphabetSimple.ts # 26 ASL letters
│   │   ├── aslPhrases.ts       # Common phrases
│   │   ├── controlGestures.ts  # UI control gestures
│   │   ├── motionTracker.ts    # Motion detection
│   │   └── drawLandmarks.ts    # Hand visualization
│   ├── speech/                 # Text-to-speech & translations
│   │   ├── translations.ts     # 10 languages
│   │   ├── gestureToPhrase.ts  # Gesture mapping
│   │   ├── naturalPacing.ts    # Speech timing
│   │   └── conversationContext.ts # Context tracking
│   ├── gemini/                 # AI integration
│   │   ├── client.ts           # Text refinement
│   │   └── aslVision.ts        # Vision API
│   ├── audio/                  # Sound effects
│   └── utils.ts                # General utilities
├── hooks/                       # Custom React hooks
│   ├── useCamera.ts            # Webcam management
│   ├── useMediaPipe.ts         # MediaPipe lifecycle
│   ├── useSpeechSynthesis.ts   # TTS management
│   └── useTheme.tsx            # Theme management
├── public/                      # Static assets
│   ├── wasm/                   # MediaPipe WASM files
│   ├── man-sign.jpg            # Sign-up background
│   ├── GIRL-IMAGE.jpg          # Sign-in background
│   └── Robot-Dex.glb           # 3D robot model
├── .kiro/                      # Kiro CLI configuration
│   ├── steering/               # Project context documents
│   │   ├── product.md         # Product overview
│   │   ├── tech.md            # Technical architecture
│   │   └── structure.md       # File organization
│   └── prompts/                # Custom workflow prompts
│       ├── prime.md           # Load project context
│       ├── plan-feature.md    # Feature planning
│       ├── execute.md         # Implementation
│       └── code-review.md     # Quality checks
├── scripts/                     # Build scripts
│   └── copy-wasm.sh            # Copy MediaPipe WASM files
├── proxy.ts                    # Clerk middleware (Next.js 16)
├── next.config.ts              # Next.js configuration
├── tailwind.config.js          # Tailwind CSS configuration
├── tsconfig.json               # TypeScript configuration
├── package.json                # Dependencies and scripts
├── DEVLOG.md                   # Development timeline
└── README.md                   # This file
```

---

## 🛠️ Development

### Available Scripts

```bash
# Development
npm run dev          # Start dev server with Turbopack
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Lint code with ESLint

# Utilities
npm run copy-wasm    # Copy MediaPipe WASM files
```

### Built with Kiro CLI

This project was developed using **[Kiro CLI](https://kiro.dev)** for AI-assisted development, reducing development time by 33%.

**Key Kiro Features Used**:
- `@prime` - Load project context at session start
- `@plan-feature` - Create comprehensive feature plans
- `@execute` - Systematic task-by-task implementation
- `@code-review` - Maintain code quality
- `/paste` - Implement UI from visual references

**Custom Prompts Created**:
- Feature planning workflow
- Execution with validation steps
- Code review with best practices
- System-wide analysis

---

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**:
   ```bash
   git push origin main
   ```

2. **Import to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your GitHub repository

3. **Configure Environment Variables**:
   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
   CLERK_SECRET_KEY=sk_live_...
   GEMINI_API_KEY=...
   NEXT_PUBLIC_APP_URL=https://your-domain.com
   ```

4. **Deploy**:
   - Vercel automatically builds and deploys
   - Updates deploy on every push to main

### Deploy to Other Platforms

SignLand uses Next.js standalone output and can be deployed to:
- **AWS Amplify**: Configure `amplify.yml` (included)
- **Netlify**: Use Next.js plugin
- **Docker**: Build with standalone output
- **Self-hosted**: Run with Node.js server

---

## 🧪 Testing

### Manual Testing Checklist

- [ ] Camera permissions work on first load
- [ ] ASL letters detect accurately (A-Z)
- [ ] Gestures trigger correct phrases
- [ ] Speech synthesis works on mobile
- [ ] Smart Mode refines text naturally
- [ ] Language switching works correctly
- [ ] Dark/light theme toggles properly
- [ ] Authentication flow completes
- [ ] Offline mode functions (Fast Mode)

### Browser Compatibility

| Browser | Desktop | Mobile | Notes |
|---------|---------|--------|-------|
| Chrome | ✅ | ✅ | Recommended |
| Edge | ✅ | ✅ | Chromium-based |
| Firefox | ✅ | ✅ | Full support |
| Safari | ✅ | ✅ | iOS 14+ |
| Opera | ✅ | ✅ | Chromium-based |

**Requirements**:
- Webcam access
- Web Speech API support
- Modern JavaScript (ES2020+)

---

## 🐛 Troubleshooting

### Camera Not Working

**Issue**: Camera permission denied or not detected

**Solutions**:
1. Grant camera permissions in browser settings
2. Check if another app is using the camera
3. Try refreshing the page (Ctrl+R / Cmd+R)
4. Ensure HTTPS connection (required for camera access)

### Speech Not Working

**Issue**: No audio output when gestures detected

**Solutions**:
1. Click "Enable Audio" button first (required on mobile)
2. Check browser supports Web Speech API
3. Ensure volume is not muted
4. Try different voice in language selector
5. Test on different browser (Chrome recommended)

### Letters Not Detecting

**Issue**: ASL letters not recognized accurately

**Solutions**:
1. Ensure good lighting conditions
2. Position hand clearly in camera frame
3. Hold gesture steady for 1-2 seconds
4. Try AI Vision mode for difficult letters
5. Check hand is fully visible (all fingers)

### Smart Mode Not Working

**Issue**: AI refinement fails or times out

**Solutions**:
1. Check `GEMINI_API_KEY` is set correctly
2. Verify API key has quota remaining
3. Check internet connection
4. Try Fast Mode as fallback
5. Review browser console for errors

---

## 🤝 Contributing

Contributions are welcome! Please follow these guidelines:

### How to Contribute

1. **Fork the repository**
2. **Create a feature branch**:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**:
   - Follow existing code style
   - Add tests if applicable
   - Update documentation
4. **Commit your changes**:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
5. **Push to your fork**:
   ```bash
   git push origin feature/amazing-feature
   ```
6. **Open a Pull Request**

### Code Standards

- **TypeScript**: Strict mode, explicit types
- **ESLint**: Follow configured rules
- **Prettier**: Auto-format on save
- **Commits**: Use conventional commits format
- **Tests**: Add tests for new features

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

### Technologies

- **[MediaPipe](https://mediapipe.dev/)** - Excellent hand tracking library
- **[Google Gemini](https://deepmind.google/technologies/gemini/)** - Powerful AI language model
- **[Clerk](https://clerk.com/)** - Seamless authentication
- **[Next.js](https://nextjs.org/)** - React framework
- **[Vercel](https://vercel.com/)** - Deployment platform
- **[Kiro CLI](https://kiro.dev/)** - AI-assisted development tool

### Inspiration

This project is dedicated to the **deaf and mute community** worldwide. Your resilience and creativity inspire us to build tools that break down communication barriers.

### Special Thanks

- **Deaf Community**: For inspiration and purpose
- **Open Source Contributors**: For amazing libraries
- **Beta Testers**: For valuable feedback
- **Kiro CLI Team**: For revolutionary development tools

---

## 📞 Support & Contact

### Get Help

- **Issues**: [GitHub Issues](https://github.com/ANAMASGARD/SignLand/issues)
- **Documentation**: See [DEVLOG.md](DEVLOG.md) for development details
- **Email**: [your-email@example.com]

### Stay Updated

- ⭐ **Star this repo** to show support
- 👀 **Watch** for updates and new features
- 🍴 **Fork** to create your own version

---

<div align="center">

### Made with ❤️ for the non-verbal community

**Empowering communication, one gesture at a time.** 🗣️

[Live Demo](https://your-deployment-url.vercel.app) • [Documentation](DEVLOG.md) • [Report Bug](https://github.com/ANAMASGARD/SignLand/issues) • [Request Feature](https://github.com/ANAMASGARD/SignLand/issues)

</div>

---

*Last Updated: January 30, 2026*

