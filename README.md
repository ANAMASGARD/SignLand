# SignLand - Real-Time Sign Language to Speech Web App

🗣️ **Empowering non-verbal communication through AI** - A privacy-first, real-time gesture recognition app that converts sign language into spoken audio using only a webcam and speakers.

[![Live Demo](https://img.shields.io/badge/Live-Try%20It-blue)](https://your-amplify-url.amplifyapp.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

## What is SignLand?

SignLand helps mute and non-verbal individuals communicate naturally using hand gestures. Point your webcam, make ASL signs, and hear them spoken instantly - all running locally in your browser with complete privacy.

### ✨ Key Features

- **🔤 ASL Alphabet Detection**: Spell words letter-by-letter with all 26 ASL letters
- **🎯 Gesture Recognition**: 7 common phrases (thumbs up/down, peace, stop, etc.)
- **🗣️ Instant Speech**: Hear letters and words spoken immediately
- **🌍 10 Languages**: English, Spanish, French, German, Italian, Portuguese, Hindi, Mandarin, Japanese, Arabic
- **🤖 Smart Mode**: AI-powered natural language refinement with Gemini
- **🔒 Privacy-First**: All processing happens locally - no video upload
- **⚡ Real-Time**: Sub-second latency from gesture to speech
- **📱 Works Everywhere**: Desktop and mobile browsers

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ANAMASGARD/SignLand.git
cd SignLand
```

### 2. Install Dependencies

```bash
cd web
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Edit `.env.local` with your keys:

```bash
# Required: Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_key
CLERK_SECRET_KEY=your_clerk_secret

# Optional: For Smart Mode
GEMINI_API_KEY=your_gemini_key
```

### 4. Run the App

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start signing!

## How to Use

### ASL Alphabet Mode (Spell Words)

1. Click **"ASL Alphabet"** button
2. Click **"Enable Audio"** to unlock speech
3. Click **"Start Camera"**
4. Sign letters using ASL alphabet
5. Hear each letter spoken as you sign
6. Words auto-complete after 3 seconds

### Gesture Mode (Quick Phrases)

1. Click **"Gesture Mode"** button
2. Make gestures like thumbs up, peace sign, stop hand
3. Hear phrases spoken instantly

### Smart Mode (AI Enhancement)

1. Toggle **"Smart Mode"** ON
2. Sign letters to spell words
3. AI refines your words into natural sentences
4. Hear polished, conversational speech

## Technology Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **AI Vision**: MediaPipe (hand tracking) + Google Gemini (optional)
- **Speech**: Web Speech API (browser-native)
- **Auth**: Clerk
- **Styling**: Tailwind CSS
- **Deployment**: AWS Amplify

## Features in Detail

### 🔤 ASL Alphabet Detection

All 26 letters of the ASL alphabet are supported:
- **A-Z**: Standard ASL hand shapes
- **Real-time detection**: See letters as you sign
- **Immediate speech**: Hear each letter spoken
- **Word building**: Letters combine into words automatically

### 🌍 Multilingual Support

Choose from 10 languages:
- English, Spanish, French, German, Italian
- Portuguese, Hindi, Mandarin, Japanese, Arabic

### 🤖 Smart Mode (AI-Powered)

- Refines rough letter sequences into natural sentences
- Uses Google Gemini AI for context-aware improvements
- Shows before/after comparison
- Optional - works offline without it

### 🔒 Privacy & Security

- **No video upload**: Camera stream stays on your device
- **Local processing**: MediaPipe runs in your browser
- **Secure auth**: Clerk handles user authentication
- **Optional AI**: Smart Mode only sends text, never video

## Project Structure

```
SignLand/
├── web/                    # Next.js application
│   ├── app/               # Pages and API routes
│   ├── components/        # React components
│   ├── lib/              # Core libraries
│   │   ├── mediapipe/    # Hand tracking & ASL detection
│   │   ├── speech/       # Text-to-speech & translations
│   │   └── gemini/       # AI integration
│   └── hooks/            # Custom React hooks
├── docs/                  # Documentation
├── .kiro/                # Kiro CLI configuration
└── README.md             # This file
```

## Development

### Built with Kiro CLI

This project was developed using [Kiro CLI](https://kiro.dev) for AI-assisted development:

- **@prime**: Load project context
- **@plan-feature**: Plan new features
- **@execute**: Implement features systematically
- **@code-review**: Maintain code quality

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Run production build
npm run lint         # Lint code
```

## Deployment

### Deploy to AWS Amplify

1. Connect your GitHub repository to AWS Amplify
2. Set environment variables in Amplify console
3. Deploy automatically on push to main branch

### Environment Variables for Production

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_live_...
CLERK_SECRET_KEY=sk_live_...
GEMINI_API_KEY=...
NEXT_PUBLIC_APP_URL=https://your-domain.com
```

## Browser Support

- ✅ Chrome/Edge (recommended)
- ✅ Firefox
- ✅ Safari
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

**Requirements**: Webcam access, modern browser with Web Speech API

## Troubleshooting

### Camera not working?
- Grant camera permissions in browser settings
- Check if another app is using the camera
- Try refreshing the page

### Speech not working?
- Click "Enable Audio" button first
- Check browser supports Web Speech API
- Ensure volume is not muted

### Letters not detecting?
- Ensure good lighting
- Position hand clearly in frame
- Try AI Vision mode for better accuracy

## Contributing

Contributions welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file

## Acknowledgments

- **MediaPipe**: Hand tracking technology
- **Google Gemini**: AI language refinement
- **Clerk**: Authentication system
- **Kiro CLI**: AI-assisted development

## Support

- **Issues**: [GitHub Issues](https://github.com/ANAMASGARD/SignLand/issues)
- **Documentation**: See `/docs` folder
- **Development Log**: See [DEVLOG.md](DEVLOG.md)

---

**Made with ❤️ for the non-verbal community**

*Empowering communication, one gesture at a time.*
