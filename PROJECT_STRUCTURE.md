# SignLand Project Structure

## Complete Directory Layout

```
dynamous-kiro-hackathon/                    # Repository root (hackathon submission)
├── .kiro/                                  # Kiro CLI configuration
│   ├── steering/                           # Project context documents
│   │   ├── product.md                     # Product vision and requirements
│   │   ├── tech.md                        # Technical architecture
│   │   ├── structure.md                   # Project structure (this file)
│   │   └── kiro-cli-reference.md          # Kiro CLI reference guide
│   ├── prompts/                            # Custom Kiro CLI prompts
│   │   ├── prime.md                       # Load project context
│   │   ├── plan-feature.md                # Feature planning
│   │   ├── execute.md                     # Execute development plans
│   │   ├── code-review.md                 # Code quality review
│   │   ├── code-review-hackathon.md       # Hackathon submission evaluation
│   │   ├── code-review-fix.md             # Fix code review issues
│   │   ├── system-review.md               # Implementation vs plan analysis
│   │   ├── create-prd.md                  # Generate PRDs
│   │   ├── execution-report.md            # Implementation reports
│   │   ├── rca.md                         # Root cause analysis
│   │   ├── implement-fix.md               # Implement fixes
│   │   └── quickstart.md                  # Setup wizard
│   └── documentation/                      # Kiro CLI documentation
├── web/                                    # Next.js application
│   ├── app/                               # Next.js App Router
│   │   ├── (public)/                      # Public routes
│   │   │   └── page.tsx                   # Landing page
│   │   ├── (auth)/                        # Protected routes with Clerk
│   │   │   ├── sign-in/[[...sign-in]]/   # Clerk sign-in
│   │   │   ├── sign-up/[[...sign-up]]/   # Clerk sign-up
│   │   │   ├── translate/                 # Main gesture recognition interface
│   │   │   │   ├── page.tsx              # Translate page
│   │   │   │   └── components/           # Route-specific components
│   │   │   │       ├── CameraPanel.tsx   # Webcam display
│   │   │   │       ├── CaptionsPanel.tsx # Real-time captions
│   │   │   │       └── ControlsBar.tsx   # Start/Stop/Mode controls
│   │   │   └── settings/                  # User preferences
│   │   │       └── page.tsx              # Settings page
│   │   ├── api/                           # API routes
│   │   │   └── refine/                    # Gemini text refinement
│   │   │       └── route.ts              # POST /api/refine
│   │   ├── layout.tsx                     # Root layout with Clerk provider
│   │   └── globals.css                    # Global styles
│   ├── components/                        # Shared React components
│   │   ├── ui/                            # Generic UI components
│   │   │   ├── Button.tsx                # Reusable button
│   │   │   ├── Card.tsx                  # Card component
│   │   │   └── Slider.tsx                # Slider component
│   │   └── ...                            # Other shared components
│   ├── lib/                               # Utility libraries
│   │   ├── mediapipe/                     # MediaPipe integration
│   │   │   ├── gestureWorker.ts          # Web Worker for gesture processing
│   │   │   ├── createRecognizer.ts       # Initialize MediaPipe
│   │   │   └── types.ts                  # MediaPipe types
│   │   ├── speech/                        # Speech synthesis
│   │   │   ├── tts.ts                    # Text-to-speech utilities
│   │   │   └── voices.ts                 # Voice selection
│   │   ├── translate/                     # Translation logic
│   │   │   ├── stabilizer.ts             # Gesture stabilization
│   │   │   ├── mapping.ts                # Gesture to phrase mapping
│   │   │   └── tokenizer.ts              # Token generation
│   │   ├── gemini/                        # Gemini API client
│   │   │   └── client.ts                 # Gemini integration
│   │   └── utils.ts                       # General utilities
│   ├── hooks/                             # Custom React hooks
│   │   ├── useGestureRecognizer.ts       # Gesture recognition hook
│   │   ├── useSpeechSynthesis.ts         # TTS hook
│   │   └── useStabilizer.ts              # Stabilizer hook
│   ├── types/                             # TypeScript type definitions
│   │   ├── gesture.types.ts              # Gesture types
│   │   ├── speech.types.ts               # Speech types
│   │   └── api.types.ts                  # API types
│   ├── public/                            # Static assets
│   │   ├── models/                        # MediaPipe models (if bundled)
│   │   ├── images/                        # Images and icons
│   │   └── icons/                         # App icons
│   ├── __tests__/                         # Test files
│   │   ├── unit/                          # Unit tests
│   │   ├── components/                    # Component tests
│   │   └── integration/                   # Integration tests
│   ├── .env.example                       # Environment variable template
│   ├── .env.local                         # Local env vars (gitignored)
│   ├── next.config.ts                     # Next.js configuration
│   ├── tailwind.config.ts                 # Tailwind CSS configuration
│   ├── tsconfig.json                      # TypeScript configuration
│   ├── jest.config.js                     # Jest testing configuration
│   ├── package.json                       # Dependencies and scripts
│   └── README.md                          # Web app documentation
├── docs/                                   # Additional documentation
│   ├── architecture.md                    # Detailed architecture
│   ├── gesture-mapping.md                 # Gesture to phrase mappings
│   └── deployment.md                      # Deployment instructions
├── plans/                                  # Feature implementation plans
│   └── [feature-name].md                  # Generated by @plan-feature
├── execution-reports/                      # Implementation reports
│   └── [feature-name]-report.md           # Generated by @execution-report
├── examples/                               # Example documentation
│   ├── README.md                          # Example README
│   └── DEVLOG.md                          # Example DEVLOG
├── amplify.yml                             # AWS Amplify build configuration
├── .gitignore                              # Git ignore rules
├── README.md                               # Main project documentation
├── DEVLOG.md                               # Development log (hackathon requirement)
├── kiro-guide.md                           # Kiro CLI guide
└── package.json                            # Root package.json (optional)
```

## Why This Structure?

### Hackathon Compliance
- **Root-level docs**: `.kiro/`, `README.md`, `DEVLOG.md` are immediately visible to judges
- **Clean separation**: App code in `/web`, hackathon artifacts at root
- **Easy navigation**: Judges can quickly understand project structure

### AWS Amplify Deployment
- **Monorepo support**: `amplify.yml` points to `/web` as `appRoot`
- **Standard Next.js**: App follows Next.js conventions inside `/web`
- **Environment variables**: Configured in Amplify console

### Development Efficiency
- **Kiro CLI integration**: Steering documents and prompts guide development
- **Modular organization**: Clear separation of concerns (routes, components, lib)
- **Scalable structure**: Easy to add new features and components

## Key Files for Hackathon Submission

### Required Documentation
1. **README.md** (root): Project overview, setup instructions, demo video
2. **DEVLOG.md** (root): Development timeline, decisions, challenges, time tracking
3. **.kiro/steering/**: Product vision, technical architecture, project structure
4. **.kiro/prompts/**: Custom Kiro CLI commands and workflows

### Required Code
1. **web/**: Complete Next.js application
2. **amplify.yml**: Deployment configuration
3. **plans/**: Feature implementation plans (generated during development)
4. **execution-reports/**: Implementation reports (generated during development)

## Next Steps

1. **Create Next.js app**: Run `npx create-next-app@latest web` from repo root
2. **Configure Clerk**: Add authentication to protected routes
3. **Implement features**: Use `@plan-feature` → `@execute` workflow
4. **Update DEVLOG**: Document progress, decisions, and challenges
5. **Test deployment**: Verify Amplify can build from `/web` subfolder
