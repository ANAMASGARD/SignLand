# Product Overview

## Product Purpose
SignLand (SignSpeak) is a real-time sign language to speech communication tool that empowers mute and non-verbal individuals to communicate naturally using only their webcam and speakers. The app converts hand gestures and signs into spoken audio instantly, with a strong focus on privacy, low latency, and offline-first operation. By running gesture recognition locally in the browser using MediaPipe and leveraging the Web Speech API for text-to-speech, SignLand provides immediate, accessible communication without requiring specialized hardware or continuous internet connectivity.

The optional "Smart Interpreter" mode uses Gemini AI to refine rough gesture tokens into natural, polite sentences, bridging the gap between sign language gloss and conversational speech.

## Target Users

### Primary Users
Mute and non-verbal individuals who:
- Already know basic signs/gestures
- Need fast, real-time communication in everyday situations (meetings, classrooms, shops, public places)
- Want to use only a phone/laptop webcam and speakers
- Value privacy and don't want their video uploaded continuously
- Need a solution that works with minimal setup and low bandwidth

### Secondary Users
- **Caregivers**: Need to facilitate communication with non-verbal individuals
- **Teachers**: Working with non-verbal students in educational settings
- **Colleagues**: Collaborating with non-verbal team members in professional environments
- **Customer-facing staff**: Retail, hospitality, and service workers who need to communicate with non-verbal customers

### Accessibility Focus
People who need communication aids that:
- Work with minimal technical setup
- Function in low-bandwidth environments
- Respect privacy (no continuous video upload)
- Provide instant feedback without delays
- Are accessible on common devices (phones, laptops, tablets)

## Key Features

### Core Functionality
- **Real-time Gesture Recognition**: MediaPipe-powered hand gesture detection running locally in the browser
- **Instant Speech Output**: Browser-native text-to-speech for immediate audio feedback
- **Offline-First Fast Mode**: Complete gesture-to-speech pipeline runs locally without internet
- **Smart Interpreter Mode**: Optional online mode that refines gesture tokens into natural language using Gemini AI
- **Gesture Stabilization**: Intelligent debouncing and time-window consensus to prevent false positives and repeated phrases

### User Experience
- **One-Click Start**: Simple "Start" button to begin gesture recognition
- **Live Captions**: On-screen text display of recognized gestures and phrases
- **Audio Enable Control**: Explicit button to unlock speech synthesis (mobile browser requirement)
- **Multilingual Support**: Choose output language and voice for speech synthesis
- **User Authentication**: Clerk-based auth for personalized settings and preferences

### Privacy & Performance
- **No Video Upload**: Webcam stream never leaves the device in Fast Mode
- **Token-Only Transmission**: Only text tokens sent to server in Smart Mode (not video)
- **Low-Latency Local Voices**: Prioritizes local TTS voices to avoid network delays
- **Mobile-Optimized**: Works on phone browsers with appropriate permission handling

## Business Objectives

### Primary Goals
1. **Accessibility Impact**: Enable real-time communication for non-verbal individuals in everyday situations
2. **Privacy Leadership**: Demonstrate that powerful AI-assisted communication can respect user privacy
3. **Performance Excellence**: Achieve sub-second latency from gesture to speech in Fast Mode
4. **Adoption & Usability**: Create a tool simple enough for immediate use without training

### Success Metrics
- **Latency**: < 500ms from stable gesture recognition to speech output in Fast Mode
- **Accuracy**: > 85% gesture recognition accuracy for trained gesture set
- **Privacy**: Zero video data transmission in Fast Mode (100% local processing)
- **Usability**: Users can start communicating within 30 seconds of opening the app
- **Accessibility**: Works on 95%+ of modern mobile and desktop browsers

## User Journey

### First-Time User Flow
1. **Landing**: User arrives at SignLand homepage, sees clear value proposition
2. **Sign Up/Login**: Quick authentication via Clerk (email, social login)
3. **Onboarding**: Brief tutorial showing supported gestures and how to use the app
4. **Permission Grant**: User grants camera and microphone permissions
5. **Audio Unlock**: User clicks "Enable Audio" to activate speech synthesis
6. **First Gesture**: User performs a gesture, sees caption, hears speech output
7. **Mode Selection**: User can toggle between Fast Mode (instant) and Smart Mode (refined)

### Typical Usage Session
1. **Quick Start**: User opens app, clicks "Start" button
2. **Gesture Communication**: User performs signs/gestures in front of webcam
3. **Real-Time Feedback**: App displays captions and speaks recognized phrases
4. **Mode Switching**: User toggles Smart Mode for more natural phrasing when needed
5. **Settings Adjustment**: User changes voice, language, or gesture sensitivity as needed
6. **Session End**: User clicks "Stop" when done, session data saved to preferences

### Advanced User Flow
1. **Custom Gestures**: User trains or configures custom gesture mappings
2. **Phrase Library**: User builds frequently-used phrases for quick access
3. **Multilingual Communication**: User switches output language for different contexts
4. **Smart Mode Refinement**: User leverages Gemini for context-aware sentence construction

## Success Criteria

### Technical Success
- **Performance**: Consistent sub-500ms latency in Fast Mode
- **Reliability**: 99%+ uptime for core gesture recognition (client-side)
- **Compatibility**: Works on Chrome, Safari, Firefox (mobile and desktop)
- **Privacy**: Zero video transmission in Fast Mode, minimal token transmission in Smart Mode

### User Success
- **Adoption**: Users return for multiple sessions (retention metric)
- **Satisfaction**: Positive feedback on speed, accuracy, and ease of use
- **Communication Effectiveness**: Users successfully communicate in real-world scenarios
- **Accessibility**: Users with varying technical skills can use the app effectively

### Product Success
- **Innovation**: Demonstrates novel approach to privacy-preserving real-time communication
- **Completeness**: Fully functional MVP with both Fast and Smart modes
- **Documentation**: Clear documentation and user guides
- **Code Quality**: Well-structured, maintainable codebase with appropriate testing

## Current Implementation Status

### ✅ Completed Features
- **Authentication System**: Full Clerk integration with attractive sign-in/sign-up pages
- **Landing Page**: Hero section with 3D robot animation, gradient backgrounds, and feature highlights
- **macOS-Style UI**: Glassmorphism effects on buttons (Get Started, Start Experience) with Big Sur/Monterey aesthetic
- **Protected Routes**: `/translate` route secured with Clerk middleware (proxy.ts for Next.js 16)
- **User Management**: Profile management with UserButton component and session handling
- **Sign-In Page**: Beautiful gradient design with feature showcases and responsive layout
- **Sign-Up Page**: Attractive design with benefit highlights and privacy notices
- **Navigation**: Updated landing page with "Get Started" and "Sign in" buttons
- **Responsive Design**: Mobile-first design with Tailwind CSS across all pages
- **Environment Configuration**: Complete setup for Clerk authentication and API keys
- **MediaPipe Gesture Recognition**: Real-time hand tracking with 21-point landmark visualization
- **GestureRecognizer Component**: Video/canvas overlay with 30 FPS processing
- **Premium UI Components**: Shimmer buttons with Aceternity UI style and glassmorphism effects
- **Camera Management**: Custom hooks for webcam access and MediaPipe lifecycle
- **Responsive Layout**: Viewport-based heights with mobile-first design approach

### 🚧 In Progress
- **Gesture Stabilizer**: Debouncing and consensus logic for stable gesture detection
- **Speech Synthesis**: Web Speech API implementation for audio output
- **Gesture-to-Phrase Mapping**: Common sign language phrases and vocabulary
- **Smart Mode**: Gemini API integration for text refinement

### 📋 Planned Features
- **Settings Page**: Voice selection and language preferences
- **Gesture Library**: Custom gesture mapping and training
- **Onboarding Flow**: Tutorial for first-time users
- **Analytics Dashboard**: Usage statistics and performance metrics
- **Phrase History**: Track and replay recent translations
- **Multi-language Support**: Support for different sign language systems (ASL, BSL, etc.)

## Development Workflow

### Kiro CLI Usage
This project leverages Kiro CLI extensively for development:

- **`/paste` command**: Used for sharing screenshots and visual references to implement UI features (e.g., macOS-style glassmorphism buttons, shimmer effects, responsive layouts)
- **Custom prompts**: `@prime`, `@plan-feature`, `@execute`, `@code-review` for structured development
- **Steering documents**: Maintained in `.kiro/steering/` for project context and technical decisions
- **Real-time collaboration**: Kiro CLI enables rapid iteration on UI/UX by processing visual references and implementing designs instantly
- **Code generation**: Automated component creation (GestureRecognizer, ShimmerButton, custom hooks) with best practices built-in
- **Multi-file operations**: Simultaneous updates across components, hooks, and utilities
- **Debugging assistance**: Quick fixes for React StrictMode issues, canvas alignment, and performance optimization
