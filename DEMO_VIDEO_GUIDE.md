# Demo Video Quick Reference

## 🎬 Recording Setup

### Tools Needed
- **Screen Recorder**: OBS Studio, Loom, or QuickTime (Mac)
- **Microphone**: Built-in or external (test audio first)
- **Browser**: Chrome (recommended for best compatibility)
- **Lighting**: Good lighting for webcam demo

### Before Recording
1. Close unnecessary browser tabs
2. Clear browser history/cache
3. Test camera and microphone
4. Prepare ASL hand shapes (practice A-Z)
5. Have script ready
6. Set browser to full screen (F11)

## 📝 Script & Timing (4 minutes 30 seconds)

### 1. Introduction (0:00 - 0:30)
**What to say**:
> "Hi, I'm presenting SignLand - a real-time sign language to speech application that empowers non-verbal individuals to communicate using only a webcam and speakers. Built with Next.js 16, MediaPipe for hand tracking, and Google Gemini AI for natural language enhancement. Let's see it in action."

**What to show**:
- GitHub repository page
- README.md with badges and features

### 2. Landing Page (0:30 - 0:45)
**What to say**:
> "The landing page features a 3D animated robot and highlights our key features: 26 ASL letters, 7 gesture phrases, 10 languages, and AI-powered Smart Mode - all with complete privacy."

**What to show**:
- Landing page with 3D robot
- Scroll through features
- Click "Get Started"

### 3. Authentication (0:45 - 1:00)
**What to say**:
> "We use Clerk for secure authentication. Notice the beautiful, accessible design with community-focused imagery."

**What to show**:
- Sign-in page with background image
- Quick sign-in (or sign-up if needed)
- Redirect to /translate page

### 4. ASL Alphabet Mode (1:00 - 2:00)
**What to say**:
> "Let's start with ASL Alphabet Mode. I'll click 'Enable Audio' to unlock speech synthesis, then 'Start Camera'. Now I can sign letters and hear them spoken immediately. Watch as I spell 'HELLO' - each letter is detected in real-time with sub-500ms latency. After 3 seconds of inactivity, the word auto-completes."

**What to show**:
- Click "ASL Alphabet" button
- Click "Enable Audio"
- Click "Start Camera"
- Sign letters: H-E-L-L-O
- Show letter detection and speech
- Show word auto-completion
- Sign another word: H-I

**Tips**:
- Hold each letter steady for 1-2 seconds
- Ensure good lighting
- Keep hand in frame

### 5. Gesture Mode (2:00 - 2:30)
**What to say**:
> "Now let's switch to Gesture Mode for quick phrases. I can make simple gestures like thumbs up for 'Yes', peace sign for 'Peace', or stop hand for 'Stop' - and hear them spoken instantly."

**What to show**:
- Click "Gesture Mode" button
- Make thumbs up gesture → hear "Yes"
- Make peace sign → hear "Peace"
- Make stop hand → hear "Stop"

### 6. Smart Mode (2:30 - 3:15)
**What to say**:
> "Here's where it gets interesting. Smart Mode uses Google Gemini AI to refine rough letter sequences into natural, conversational speech. Watch as I toggle it ON and spell 'HOW ARE YOU'. The AI transforms this into a polished sentence: 'Hello! How are you doing today?' Notice we only send text to the API - never video - maintaining complete privacy."

**What to show**:
- Toggle "Smart Mode" ON
- Sign letters: H-O-W A-R-E Y-O-U
- Show AI refinement in progress
- Display before/after comparison
- Hear natural speech output

### 7. Language Switching (3:15 - 3:30)
**What to say**:
> "SignLand supports 10 languages. Let me switch to Spanish and sign 'HOLA'. You'll hear it spoken in Spanish with the appropriate accent."

**What to show**:
- Open language selector dropdown
- Select "Spanish"
- Sign: H-O-L-A
- Hear Spanish speech output

### 8. Privacy Features (3:30 - 4:00)
**What to say**:
> "Privacy is our top priority. Let me open the browser's Network tab to show you - there's no video upload. All gesture recognition happens locally using MediaPipe WASM. Only in Smart Mode do we send text tokens - never video - to Gemini for refinement. This means you can use Fast Mode completely offline."

**What to show**:
- Open DevTools (F12)
- Go to Network tab
- Show no video uploads
- Highlight local processing
- Show only text API calls in Smart Mode

### 9. Additional Features (4:00 - 4:15)
**What to say**:
> "We also have dark mode for comfortable viewing, mobile-responsive design, and the entire app works on phones, tablets, and desktops."

**What to show**:
- Toggle dark/light theme
- Show responsive design (resize browser)
- Mention mobile compatibility

### 10. Conclusion (4:15 - 4:30)
**What to say**:
> "SignLand was built in 80 hours using Kiro CLI for AI-assisted development, which reduced development time by 33%. The app features comprehensive documentation, custom Kiro prompts, and a complete development log. All code is open source on GitHub. Thank you for watching, and I hope SignLand demonstrates the potential of privacy-first, real-time sign language communication."

**What to show**:
- Show GitHub repository
- Scroll through README.md
- Show .kiro/ directory structure
- Show DEVLOG.md
- End on landing page

## 🎯 Key Points to Emphasize

### Technical Excellence
- ✅ Real-time performance (< 500ms latency)
- ✅ 30 FPS hand tracking
- ✅ 85%+ accuracy
- ✅ Works offline

### Innovation
- ✅ Hybrid privacy model (local + optional cloud)
- ✅ Browser-native technologies
- ✅ No specialized hardware
- ✅ Multilingual support

### Kiro CLI Usage
- ✅ 33% faster development
- ✅ Custom prompts created
- ✅ Comprehensive documentation
- ✅ Context-aware development

### Real-World Value
- ✅ Empowers non-verbal individuals
- ✅ Privacy-first approach
- ✅ Accessible on common devices
- ✅ Free and open source

## 📹 Recording Tips

### Video Quality
- **Resolution**: 1080p minimum
- **Frame Rate**: 30 FPS minimum
- **Audio**: Clear narration, no background noise
- **Length**: 2-5 minutes (aim for 4-4.5 minutes)

### Presentation Tips
- Speak clearly and at moderate pace
- Show enthusiasm and confidence
- Avoid "um" and "uh" (edit if needed)
- Smile when appropriate
- Keep energy level consistent

### Technical Tips
- Close notification popups
- Hide bookmarks bar
- Use full screen mode
- Test recording first (30 seconds)
- Have backup recording ready

### Editing (if needed)
- Cut out mistakes or pauses
- Add text overlays for key points
- Include background music (optional, low volume)
- Add intro/outro slides (optional)
- Export in high quality (1080p, H.264)

## 🚀 Upload & Share

### Platform Options
1. **YouTube** (recommended)
   - Create unlisted video
   - Add title: "SignLand - Real-Time Sign Language to Speech"
   - Add description with GitHub link
   - Add tags: sign language, accessibility, AI, Next.js

2. **Loom**
   - Quick and easy
   - Good for short demos
   - Shareable link

3. **Wistia**
   - Professional hosting
   - Analytics available
   - Customizable player

### After Upload
1. Get shareable link
2. Test link in incognito mode
3. Add link to README.md
4. Add link to SUBMISSION_CHECKLIST.md
5. Verify video plays correctly

## ✅ Pre-Recording Checklist

- [ ] Application running at localhost:3000
- [ ] Camera and microphone tested
- [ ] Good lighting for webcam
- [ ] Browser in full screen
- [ ] Notifications disabled
- [ ] Script reviewed
- [ ] ASL hand shapes practiced
- [ ] Screen recorder ready
- [ ] Backup plan ready

## 🎬 Post-Recording Checklist

- [ ] Video quality good (1080p, clear audio)
- [ ] All features demonstrated
- [ ] Length within 2-5 minutes
- [ ] No sensitive information shown
- [ ] Edited if needed
- [ ] Uploaded to platform
- [ ] Link tested
- [ ] Added to README.md
- [ ] Added to submission

---

**You've got this!** 🎉

Remember: The demo video is worth 3 points. Make it count by showing the app's capabilities clearly and professionally.

**Estimated Time to Record**: 30-60 minutes (including practice and retakes)

**Good luck!** 🗣️
