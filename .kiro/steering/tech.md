# Technical Architecture

## Technology Stack

### Frontend Framework
- **Next.js 14+** (App Router) with React 18+
- **TypeScript** for type safety and developer experience
- **Tailwind CSS** for styling and responsive design

### AI & Computer Vision
- **MediaPipe Tasks Vision** (WASM) - Client-side gesture recognition and hand tracking
- **Web Speech API** (SpeechSynthesis) - Browser-native text-to-speech
- **Google Gemini API** - Optional text refinement for Smart Mode

### Authentication & User Management
- **Clerk** - User authentication, session management, and protected routes

### Development Tools
- **ESLint** + **Prettier** - Code quality and formatting
- **Jest** + **React Testing Library** - Unit and component testing
- **TypeScript strict mode** - Enhanced type checking

## Architecture Overview

### Architecture Style
**Client-side inference + lightweight optional server refinement**

### Fast Mode (Default - Fully Offline)
```
Webcam Stream → MediaPipe Gesture Recognizer (frame-by-frame)
    ↓
Stabilizer + Tokenizer Logic (debounce/consensus)
    ↓
Phrase Mapping → UI Captions
    ↓
SpeechSynthesis.speak() → Audio Output
```

**Key Design**: MediaPipe outputs per-frame predictions. The stabilizer implements debounce/time-window consensus to only "commit" a gesture when stable for a short duration, preventing repeated phrases on every frame.

### Smart Mode (Optional - Online)
```
Committed Gesture Tokens (text only, NOT video)
    ↓
Next.js API Route: /api/refine
    ↓
Gemini API (text-to-text refinement)
    ↓
Natural Language Response → SpeechSynthesis
```

**Privacy Note**: Only text tokens are sent to the server, never video data.

### Component Architecture
```
/web (Next.js App)
├── app/
│   ├── sign-in/         # Clerk sign-in page
│   ├── sign-up/         # Clerk sign-up page
│   ├── translate/       # Protected: Main gesture recognition interface
│   ├── api/
│   │   └── refine/      # Gemini text refinement endpoint
│   ├── layout.tsx       # Root layout with ClerkProvider
│   └── page.tsx         # Landing page with hero
├── components/
│   ├── landing/         # Landing page components (Hero, HeroScene, etc.)
│   ├── GestureRecognizer/   # MediaPipe integration (planned)
│   ├── SpeechOutput/        # TTS management (planned)
│   ├── Stabilizer/          # Gesture stabilization logic (planned)
│   └── CaptionDisplay/      # Real-time caption UI (planned)
└── lib/
    ├── mediapipe/       # MediaPipe configuration
    ├── design/          # Design tokens and utilities
    ├── ui/              # UI utilities (motion, etc.)
    ├── speech/          # Speech synthesis utilities (planned)
    └── gemini/          # Gemini API client (planned)
```

## Development Environment

### Required Tools
- **Node.js** 18+ (LTS recommended)
- **npm** or **pnpm** (package management)
- **Git** for version control
- **Modern browser** with webcam support (Chrome, Firefox, Safari)

### Setup Instructions
```bash
# Clone repository
git clone <repo-url>
cd dynamous-kiro-hackathon/web

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add: NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, GEMINI_API_KEY

# Run development server
npm run dev
```

### Environment Variables
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Clerk public key
- `CLERK_SECRET_KEY` - Clerk secret key (server-side)
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Sign-in page URL (/sign-in)
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Sign-up page URL (/sign-up)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Redirect after sign-in (/translate)
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Redirect after sign-up (/translate)
- `GEMINI_API_KEY` - Google Gemini API key (optional, for Smart Mode)

## Code Standards

### TypeScript Conventions
- **Strict mode enabled** - No implicit any, strict null checks
- **Interface over type** for object shapes
- **Explicit return types** for functions
- **Descriptive naming** - `recognizeGesture()` not `rg()`

### React Patterns
- **Server Components by default** - Use 'use client' only when needed
- **Custom hooks** for reusable logic (useGestureRecognizer, useSpeechSynthesis)
- **Component composition** over prop drilling
- **Error boundaries** for graceful failure handling

### File Naming
- **Components**: PascalCase (GestureRecognizer.tsx)
- **Utilities**: camelCase (gestureStabilizer.ts)
- **API routes**: kebab-case (refine-text.ts)
- **Types**: PascalCase with .types.ts suffix

### Code Organization
- **Colocation** - Keep related files together
- **Single responsibility** - One component, one purpose
- **Pure functions** where possible for testability
- **Minimal dependencies** - Avoid unnecessary packages

## Testing Strategy

### Unit Tests
- **Stabilizer/Tokenizer logic** - Deterministic gesture commitment
- **Phrase mapping** - Token to text conversion
- **Speech synthesis utilities** - Voice selection and preference handling
- **Target**: 80%+ coverage for core logic

### Component Tests
- **GestureRecognizer** - MediaPipe initialization and cleanup
- **SpeechOutput** - TTS triggering and error handling
- **CaptionDisplay** - Text rendering and updates
- **Framework**: Jest + React Testing Library

### Integration Tests
- **Start camera flow** - Permission handling and stream initialization
- **Enable audio flow** - User gesture requirement for mobile
- **Commit phrase flow** - End-to-end gesture to speech

### Manual QA Checklist
- Camera permissions on different browsers
- TTS availability and voice selection
- Mobile browser restrictions (audio unlock)
- Fast Mode vs Smart Mode switching
- Multilingual voice support

## Deployment Process

### Build Pipeline
```bash
# Production build
npm run build

# Run production server locally
npm start
```

### AWS Amplify Deployment
1. **Connect repository** to AWS Amplify
2. **Configure build settings**:
   - Build command: `npm run build`
   - Output directory: `.next`
3. **Set environment variables** in Amplify console
4. **Enable automatic deployments** on main branch push

### Environment Configuration
- **Development**: Local .env.local with test keys
- **Staging**: Amplify environment with staging Clerk app
- **Production**: Amplify environment with production keys and Gemini API

### Deployment Checklist
- [ ] Environment variables configured
- [ ] Clerk production instance set up
- [ ] Gemini API key added (if using Smart Mode)
- [ ] Build succeeds without errors
- [ ] Camera permissions work on deployed URL
- [ ] TTS functions on mobile browsers

## Performance Requirements

### Latency Targets
- **Fast Mode**: < 500ms from stable gesture to speech output
- **Smart Mode**: < 2s from token submission to refined speech
- **Frame processing**: 30 FPS minimum for smooth gesture detection
- **UI responsiveness**: < 100ms for user interactions

### Resource Constraints
- **Client-side processing**: Must run on mid-range mobile devices
- **Memory usage**: < 200MB for MediaPipe + app overhead
- **Network**: Fast Mode must work offline; Smart Mode requires minimal bandwidth (text only)
- **Battery**: Optimize camera/processing to avoid excessive drain

### Optimization Strategies
- **Prefer local TTS voices** (localService: true) to avoid network latency
- **Debounce gesture commits** to reduce unnecessary processing
- **Lazy load MediaPipe** models only when needed
- **Minimize re-renders** with React.memo and useMemo

## Security Considerations

### Privacy-First Design
- **No video upload**: Webcam stream never leaves the device in Fast Mode
- **Token-only transmission**: Smart Mode sends only text tokens, not video
- **Local processing**: All gesture recognition happens client-side
- **User control**: Explicit permissions for camera and audio

### Authentication & Authorization
- **Clerk integration** for secure user authentication
- **Protected routes** for translate and settings pages
- **Session management** with secure cookies
- **API route protection** with Clerk middleware

### Data Protection
- **No persistent video storage** - Streams are ephemeral
- **User preferences encrypted** in Clerk user metadata
- **API keys secured** in environment variables (never client-side)
- **HTTPS only** in production

### Input Validation
- **Sanitize gesture tokens** before sending to Gemini
- **Rate limiting** on /api/refine to prevent abuse
- **Error handling** to prevent information leakage
- **Content Security Policy** headers configured

### Browser Security
- **Camera permissions** requested explicitly with user consent
- **Microphone permissions** for audio output (mobile requirement)
- **CORS configuration** for API routes
- **XSS prevention** through React's built-in escaping

## Kiro CLI Development Workflow

### How Kiro CLI Accelerates Development

This project demonstrates extensive use of Kiro CLI for rapid, high-quality development:

#### 1. **Visual Design Implementation**
- **`/paste` command**: Share screenshots of desired UI elements
- **Instant implementation**: Kiro analyzes visual references and generates matching code
- **Example**: Glass morphism buttons with iridescent effects implemented from reference images
- **Benefit**: No need to manually translate design specs to CSS

#### 2. **Component Generation**
- **Automated creation**: Interactive components (GlassButton) with best practices
- **Framework integration**: Proper TypeScript types, Framer Motion animations, accessibility
- **Consistent patterns**: All components follow project conventions automatically

#### 3. **System-Wide Updates**
- **Font system changes**: San Francisco font applied across entire codebase in minutes
- **Global styling**: CSS variables and theme updates propagated consistently
- **Refactoring**: Large-scale changes executed safely with context awareness

#### 4. **Context-Aware Development**
- **Steering documents**: Project context loaded via `@prime` prompt
- **Consistent decisions**: Technical choices aligned with architecture docs
- **No context loss**: Every session starts with full project understanding

#### 5. **Dependency Management**
- **Smart installations**: Kiro installs required packages (Aceternity UI, clsx, tailwind-merge)
- **Configuration**: Automatic setup of utilities and helper functions
- **Integration**: Seamless connection of new libraries with existing code

#### 6. **Documentation Maintenance**
- **Real-time updates**: Steering documents updated as features are built
- **Git workflow**: Proper commit messages generated with context
- **Process tracking**: Development decisions documented automatically

### Kiro CLI Commands Used

- **`@prime`**: Load project context at session start
- **`/paste`**: Share visual references for UI implementation
- **File operations**: Read, write, and update multiple files simultaneously
- **Package management**: Install dependencies and configure tools
- **Git operations**: Status checks and commit preparation

### Development Speed Impact

**Traditional approach**: Hours to implement glass morphism buttons with interactive effects
**With Kiro CLI**: Minutes from visual reference to working, animated components

**Traditional approach**: Manual font updates across dozens of files, risk of inconsistency
**With Kiro CLI**: System-wide font change in seconds, guaranteed consistency

This workflow demonstrates how Kiro CLI transforms development from manual coding to collaborative design implementation.
