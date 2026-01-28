# SignLand - Real-Time Sign Language to Speech Web App

🗣️ **Empowering non-verbal communication through AI** - A privacy-first, real-time gesture recognition app that converts sign language into spoken audio using only a webcam and speakers.

[![Demo Video](https://img.shields.io/badge/Demo-Watch%20Video-red)](https://youtube.com/your-demo-video)
[![Live Demo](https://img.shields.io/badge/Live-Try%20It-blue)](https://your-amplify-url.amplifyapp.com)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

> **📖 New to Kiro?** Check out [kiro-guide.md](kiro-guide.md) to quickly get accustomed to how Kiro works and understand its unique features for the hackathon.

## About SignLand

SignLand is a real-time sign language to speech communication tool that empowers mute and non-verbal individuals to communicate naturally using only their webcam and speakers. The app converts hand gestures and signs into spoken audio instantly, with a strong focus on privacy, low latency, and offline-first operation.

### Key Features

- **Real-time Gesture Recognition**: MediaPipe-powered hand gesture detection running locally in the browser
- **Instant Speech Output**: Browser-native text-to-speech for immediate audio feedback
- **Offline-First Fast Mode**: Complete gesture-to-speech pipeline runs locally without internet
- **Smart Interpreter Mode**: Optional online mode that refines gesture tokens into natural language using Gemini AI
- **Privacy-First Design**: No video upload - webcam stream never leaves the device in Fast Mode
- **Multilingual Support**: Choose output language and voice for speech synthesis

### Technology Stack

- **Frontend**: Next.js 14+ (App Router) with React 18+ and TypeScript
- **AI & Computer Vision**: MediaPipe Tasks Vision (WASM) for client-side gesture recognition
- **Speech**: Web Speech API (SpeechSynthesis) for browser-native text-to-speech
- **Authentication**: Clerk for user authentication and session management
- **Optional AI**: Google Gemini API for text refinement in Smart Mode
- **Deployment**: AWS Amplify with monorepo support

## Quick Start

### Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** or **pnpm** for package management
- **Git** for version control
- **Modern browser** with webcam support (Chrome, Firefox, Safari)
- **Kiro CLI** installed and authenticated

### 1. Clone and Setup

```bash
git clone https://github.com/yourusername/dynamous-kiro-hackathon
cd dynamous-kiro-hackathon
```

### 2. Install Dependencies

```bash
cd web
npm install
```

### 3. Configure Environment

```bash
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```bash
# Clerk Authentication (Required)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Gemini API (Optional - for Smart Mode)
GEMINI_API_KEY=...

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Customize 3D Model (Optional)

To replace the hero 3D model:

1. Place your `.glb` file in `web/public/` (e.g., `hero.glb`)
2. Update the path in `web/components/landing/HeroModel.tsx`:
   ```typescript
   const { scene } = useGLTF('/your-model.glb');
   ```
3. Adjust scale and position as needed

### 6. Start Using Kiro CLI

From the project root (not `/web`):

```bash
kiro-cli
```

Then use:
- **`@prime`** - Load project context
- **`@plan-feature`** - Plan new features
- **`@execute`** - Implement plans
- **`@code-review`** - Review code quality

## Development Workflow (Customize this However You Want!)

### Initial Setup (One-Time)
1. **Complete setup**: Run `@quickstart` to configure your project

### Core Development Cycle (Every Feature/Session)

### Phase 1: Setup & Planning
1. **Load context**: Use `@prime` to understand your codebase
2. **Plan features**: Use `@plan-feature` for comprehensive planning

### Phase 2: Build & Iterate
1. **Implement**: Use `@execute` to build features systematically
2. **Review**: Use `@code-review` to maintain code quality
3. **Document**: Update your DEVLOG.md as you work
4. **Optimize**: Customize your `.kiro/` configuration for your workflow

### Phase 3: Submission Preparation
1. **Final review**: Run `@code-review-hackathon` for submission evaluation
2. **Polish documentation**: Ensure README.md and DEVLOG.md are complete
3. **Verify requirements**: Check all submission criteria are met

## Submission Requirements

Your submission will be judged on these criteria (100 points total):

### Application Quality (40 points)
- **Functionality & Completeness** (15 pts): Does it work as intended?
- **Real-World Value** (15 pts): Does it solve a genuine problem?
- **Code Quality** (10 pts): Is the code well-structured and maintainable?

### Kiro CLI Usage (20 points)
- **Effective Use of Features** (10 pts): How well did you leverage Kiro CLI?
- **Custom Commands Quality** (7 pts): Quality of your custom prompts
- **Workflow Innovation** (3 pts): Creative use of Kiro CLI features

### Documentation (20 points)
- **Completeness** (9 pts): All required documentation present
- **Clarity** (7 pts): Easy to understand and follow
- **Process Transparency** (4 pts): Clear development process documentation

### Innovation (15 points)
- **Uniqueness** (8 pts): Original approach or solution
- **Creative Problem-Solving** (7 pts): Novel technical solutions

### Presentation (5 points)
- **Demo Video** (3 pts): Clear demonstration of your project
- **README** (2 pts): Professional project overview

## Required Documentation

Ensure these files are complete and high-quality:

### README.md
- Clear project description and value proposition
- Prerequisites and setup instructions
- Architecture overview and key components
- Usage examples and troubleshooting

*There's a lot of freedom for how you can structure this. Just make sure that it's easy for someone viewing this to know exactly what your project is about and how to run it themselves. This is the main criteria that explains the project clearly and how to test it in a local environment.*

### DEVLOG.md
- Development timeline with key milestones
- Technical decisions and rationale
- Challenges faced and solutions implemented
- Time tracking and Kiro CLI usage statistics

*There's a lot of freedom in how you structure this too. It's up to you how you want to document your timeline, milestones, decisions made, challenges you encounter, and all those kinds of things. Feel free to use Kiro to help you maintain your devlog as you're working on the project. Hint: create a Kiro prompt to help you update your log based on what's happening.*

### .kiro/ Directory
- **Steering documents**: Customized for your project
- **Custom prompts**: Workflow-specific commands
- **Configuration**: Optimized for your development process

*This template provides a good starting point with prompts, and the wizard helps you set up your initial steering documents. However, it's encouraged for you to continue to customize things and refine it as you're working on your project.*

## Available Prompts

This template includes 11 powerful development prompts:

### Core Development
- **`@prime`** - Load comprehensive project context
- **`@plan-feature`** - Create detailed implementation plans
- **`@execute`** - Execute plans with systematic task management
- **`@quickstart`** - Interactive project setup wizard

### Quality Assurance
- **`@code-review`** - Technical code review for quality and bugs
- **`@code-review-hackathon`** - Hackathon submission evaluation
- **`@code-review-fix`** - Fix issues found in code reviews
- **`@system-review`** - Analyze implementation vs plan

### Documentation & Planning
- **`@create-prd`** - Generate Product Requirements Documents
- **`@execution-report`** - Generate implementation reports
- **`@rca`** - Root cause analysis for issues
- **`@implement-fix`** - Implement fixes based on analysis

## Examples

Check the `examples/` folder for:
- **README.md**: Professional project documentation example
- **DEVLOG.md**: Comprehensive development log example

These examples show the level of detail and professionalism expected for hackathon submissions.

## Tips for Success

### Maximize Your Score
1. **Use Kiro CLI extensively** - It's 20% of your score
2. **Document everything** - Process documentation is 20% of your score
3. **Build something useful** - Real-world value is heavily weighted
4. **Optimize your workflow** - Custom prompts and steering documents matter

### Development Best Practices
- **Start with `@quickstart`** to set up your foundation properly
- **Use `@prime`** at the start of every new conversation to quickly catch the coding assistant up to speed on what has been built in the project already
- **Use `/paste`** to share screenshots and visual references for UI implementation
- **Update your DEVLOG.md** continuously, not just at the end
- **Customize your `.kiro/` configuration** as you learn your workflow
- **Run `@code-review-hackathon`** periodically to compare your project against the judging rubric and before submitting

## Getting Help

- **Kiro CLI Documentation**: [kiro.dev/docs/cli](https://kiro.dev/docs/cli)
- **Hackathon Community**: Join the Dynamous community for support
- **Built-in Help**: Use `/help` in Kiro CLI for command assistance

---

**Ready to build something amazing?** Run `@quickstart` and let's get started! 🚀
