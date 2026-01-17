# Development Log - SignLand

**Project**: SignLand - Real-Time Sign Language to Speech Web App  
**Duration**: January 17-23, 2026  
**Total Time**: ~0 hours (just started!)  

## Overview
Building a privacy-first, real-time sign language to speech communication tool using MediaPipe for gesture recognition and Web Speech API for text-to-speech. The app runs entirely in the browser (Fast Mode) with an optional Smart Mode that uses Gemini AI to refine gesture tokens into natural language.

---

## Week 1: Foundation & Planning (Jan 17-23)

### Day 1 (Jan 17) - Project Setup [3h]
- **18:00-18:30**: Completed Kiro CLI quickstart wizard and filled steering documents
- **18:30-19:00**: Structured project repository for hackathon submission
- **19:00-21:00**: Next.js app scaffolding and initial architecture planning
- **Decision**: Monorepo structure with `/web` for Next.js app, root for hackathon docs
- **Kiro Usage**: Used `@quickstart` to set up steering documents, `@prime` to load context

**Technical Decisions**:
- **Architecture**: Client-side inference (MediaPipe WASM) + optional server refinement (Gemini)
- **Fast Mode**: Fully offline - webcam → MediaPipe → stabilizer → TTS
- **Smart Mode**: Text-only tokens sent to Gemini for natural language refinement
- **Privacy**: Zero video upload in Fast Mode, only text tokens in Smart Mode

**Next Steps**:
- [ ] Set up Next.js app in `/web` folder
- [ ] Configure Clerk authentication
- [ ] Implement MediaPipe gesture recognition
- [ ] Build gesture stabilizer logic
- [ ] Create TTS integration

---

## Time Breakdown by Category

| Category | Hours | Percentage |
|----------|-------|------------|
| Planning & Setup | 3h | 100% |
| Backend Development | 0h | 0% |
| Frontend Development | 0h | 0% |
| AI Integration | 0h | 0% |
| Testing & Debugging | 0h | 0% |
| Documentation | 0h | 0% |
| **Total** | **3h** | **100%** |

---

## Kiro CLI Usage Statistics

- **Total Prompts Used**: 2
- **Most Used**: `@quickstart` (1 time), `@prime` (1 time)
- **Custom Prompts Created**: 0 (using template prompts)
- **Steering Document Updates**: 3 (product.md, tech.md, structure.md)
- **Estimated Time Saved**: ~2 hours through Kiro automation

---

## Technical Decisions & Rationale

### Architecture Choices
- **Next.js 14+ (App Router)**: Modern React framework with SSR support for API routes
- **MediaPipe WASM**: Client-side gesture recognition for privacy and low latency
- **Web Speech API**: Browser-native TTS for instant audio output
- **Clerk**: Secure authentication with minimal setup
- **Gemini API**: Optional text refinement for natural language output

### Privacy-First Design
- **No video upload**: All gesture recognition happens client-side in Fast Mode
- **Token-only transmission**: Smart Mode sends only text tokens, never video
- **Local processing**: MediaPipe runs entirely in the browser
- **User control**: Explicit permissions for camera and audio

### Performance Requirements
- **Fast Mode**: < 500ms from stable gesture to speech output
- **Smart Mode**: < 2s from token submission to refined speech
- **Frame processing**: 30 FPS minimum for smooth gesture detection
- **Mobile support**: Works on mid-range mobile devices

---

## Challenges & Solutions

### Challenge 1: Project Structure for Hackathon
- **Problem**: Need clean separation between hackathon docs and Next.js app
- **Solution**: Monorepo structure with `/web` for app, root for `.kiro/`, `DEVLOG.md`, `README.md`
- **Rationale**: Judges can easily find documentation, Amplify can deploy from subfolder

### Challenge 2: AWS Amplify Deployment from Monorepo
- **Problem**: Next.js app in subfolder requires special Amplify configuration
- **Solution**: Created `amplify.yml` with `appRoot: web` to point to Next.js app
- **Rationale**: AWS documents monorepo support, this is the standard approach

---

## Kiro CLI Integration Highlights

### Steering Documents
- **product.md**: Comprehensive product vision, target users, success criteria
- **tech.md**: Technical architecture, stack decisions, security considerations
- **structure.md**: Project organization, naming conventions, deployment process

### Custom Prompts (Template)
- **@prime**: Load project context and understand codebase
- **@plan-feature**: Create comprehensive implementation plans
- **@execute**: Execute development plans systematically
- **@code-review**: Perform technical code reviews
- **@code-review-hackathon**: Evaluate against hackathon judging criteria

### Workflow Automation
- **Planning**: Use `@plan-feature` for each major component (MediaPipe, stabilizer, TTS, Smart Mode)
- **Implementation**: Use `@execute` to systematically build features
- **Quality**: Use `@code-review` to maintain code quality
- **Submission**: Use `@code-review-hackathon` before final submission

---

## Final Reflections

### What Went Well
- Kiro CLI quickstart wizard made initial setup incredibly fast
- Steering documents provide clear direction for development
- Monorepo structure keeps hackathon docs and app code cleanly separated

### What Could Be Improved
- Need to start actual implementation (currently just planning/setup)
- Should create custom Kiro prompts specific to MediaPipe and gesture recognition

### Key Learnings
- Proper project structure upfront saves time later
- Steering documents are invaluable for maintaining focus and consistency
- Kiro CLI automation significantly accelerates setup and planning

### Innovation Highlights
- **Privacy-first design**: No video upload, all processing client-side
- **Offline-first approach**: Fast Mode works without internet
- **Dual-mode architecture**: Fast Mode for speed, Smart Mode for natural language
- **Gesture stabilization**: Debounce/consensus algorithm to prevent false positives

---

## Next Session Plan

1. **Set up Next.js app** in `/web` folder with proper structure
2. **Configure Clerk** for authentication
3. **Implement MediaPipe** gesture recognition
4. **Build stabilizer** logic for gesture commitment
5. **Create TTS integration** with Web Speech API
6. **Test Fast Mode** end-to-end flow
7. **Update DEVLOG** with progress and decisions
