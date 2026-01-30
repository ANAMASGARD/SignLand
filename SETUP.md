# Setup Guide for Judges

This guide will help you get SignLand running locally in under 5 minutes.

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed ([Download here](https://nodejs.org/))
- **npm** (comes with Node.js)
- A **modern web browser** (Chrome, Firefox, Safari, or Edge)
- A **webcam** (built-in or external)

## Quick Setup (5 Minutes)

### Step 1: Clone the Repository

```bash
git clone https://github.com/ANAMASGARD/SignLand.git
cd SignLand
```

### Step 2: Install Dependencies

```bash
npm install
```

This will install all required packages (~2 minutes).

### Step 3: Set Up Environment Variables

```bash
cp .env.example .env.local
```

Now edit `.env.local` with your credentials:

#### Get Clerk Keys (Required - 2 minutes)

1. Go to [https://clerk.com](https://clerk.com) and sign up (free)
2. Create a new application
3. Copy your keys from the dashboard:
   - **Publishable Key**: Starts with `pk_test_`
   - **Secret Key**: Starts with `sk_test_`
4. Paste them into `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

#### Get Gemini API Key (Optional - 1 minute)

Smart Mode requires a Gemini API key. The app works fully without it.

1. Go to [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Add to `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_key_here
```

### Step 4: Run the Application

```bash
npm run dev
```

The app will start at [http://localhost:3000](http://localhost:3000)

### Step 5: Test the Application

1. **Open** [http://localhost:3000](http://localhost:3000) in your browser
2. **Click** "Get Started" or "Sign in"
3. **Create an account** using email or social login
4. **Grant camera permissions** when prompted
5. **Click "Enable Audio"** to unlock speech synthesis
6. **Click "Start Camera"** to begin gesture recognition
7. **Make ASL signs** and hear them spoken!

## Testing Different Modes

### ASL Alphabet Mode
1. Click **"ASL Alphabet"** button
2. Sign letters A-Z using ASL hand shapes
3. Hear each letter spoken immediately
4. Words auto-complete after 3 seconds

### Gesture Mode
1. Click **"Gesture Mode"** button
2. Make gestures: 👍 👎 ✌️ ✋
3. Hear phrases spoken instantly

### Smart Mode (if Gemini API key is set)
1. Toggle **"Smart Mode"** ON
2. Sign letters to spell words
3. AI refines text into natural sentences
4. See before/after comparison

## Troubleshooting

### "Camera not working"
- **Solution**: Grant camera permissions in browser settings
- **Chrome**: Click the camera icon in address bar
- **Firefox**: Click the shield icon in address bar
- **Safari**: System Preferences → Security & Privacy → Camera

### "Speech not working"
- **Solution**: Click "Enable Audio" button first (required on mobile)
- **Check**: Browser supports Web Speech API (all modern browsers do)
- **Verify**: Volume is not muted

### "Clerk authentication error"
- **Solution**: Double-check your Clerk keys in `.env.local`
- **Verify**: Keys start with `pk_test_` and `sk_test_`
- **Restart**: Stop the dev server (Ctrl+C) and run `npm run dev` again

### "Smart Mode not working"
- **Solution**: Check `GEMINI_API_KEY` is set correctly
- **Note**: Smart Mode is optional - Fast Mode works without it
- **Verify**: API key has quota remaining (check Google Cloud Console)

### "Build errors"
- **Solution**: Delete `node_modules` and `.next` folders
- **Run**: `npm install` again
- **Restart**: `npm run dev`

## Production Build

To test the production build locally:

```bash
npm run build
npm start
```

The production build will be available at [http://localhost:3000](http://localhost:3000)

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+ (Desktop & Mobile)
- ✅ Firefox 88+ (Desktop & Mobile)
- ✅ Safari 14+ (Desktop & Mobile)
- ✅ Edge 90+ (Desktop)

## System Requirements

**Minimum**:
- 2 GB RAM
- Dual-core processor
- Webcam (any resolution)
- Modern browser

**Recommended**:
- 4 GB RAM
- Quad-core processor
- HD webcam (720p+)
- Chrome browser

## Features to Test

### Core Functionality
- [ ] Camera initialization and permission handling
- [ ] ASL alphabet detection (A-Z)
- [ ] Gesture phrase recognition (7 gestures)
- [ ] Speech synthesis (immediate audio output)
- [ ] Word building and auto-completion
- [ ] Language switching (10 languages)

### Advanced Features
- [ ] Smart Mode AI refinement (if Gemini key set)
- [ ] Dark/light theme toggle
- [ ] Mobile responsiveness
- [ ] Offline functionality (Fast Mode)
- [ ] User authentication flow

### Privacy Features
- [ ] No video upload (check Network tab in DevTools)
- [ ] Local processing (MediaPipe runs in browser)
- [ ] Optional AI (Smart Mode can be disabled)

## Performance Metrics

Expected performance on mid-range hardware:
- **Latency**: < 500ms (gesture to speech)
- **Frame Rate**: 30 FPS (hand tracking)
- **Accuracy**: 85%+ (ASL alphabet)
- **Load Time**: < 3 seconds (initial page load)

## Support

If you encounter any issues:

1. **Check the console**: Open DevTools (F12) and look for errors
2. **Review DEVLOG.md**: See known issues and solutions
3. **GitHub Issues**: [Report a bug](https://github.com/ANAMASGARD/SignLand/issues)

## Demo Video

Watch the 3-minute demo video to see SignLand in action:
[Link to demo video]

---

**Thank you for testing SignLand!** 🗣️

We hope this tool demonstrates the potential of privacy-first, real-time sign language communication.
