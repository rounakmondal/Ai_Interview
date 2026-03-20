# InterviewAI - Production-Ready AI Mock Interview Platform

A full-featured, production-grade React application for conducting realistic AI-powered mock interviews with voice support, camera integration, and real-time feedback.

## Features

✨ **Core Features:**

- Real-time interview simulation with AI interviewer
- Camera and microphone integration
- Speech-to-text and text-to-speech support
- Live subtitles during interview
- Dynamic question generation with follow-ups
- Comprehensive evaluation and scoring
- Dark/Light theme support
- Fully responsive design

🎯 **Interview Capabilities:**

- Multiple interview types (Government, Private, IT, Non-IT)
- Multi-language support (English, Hindi, Bengali)
- Optional CV upload for personalized questions
- Real-time progress tracking
- Professional avatar-based interviewer
- Automatic silence detection for voice input

📊 **Evaluation Features:**

- Overall performance score (0-10)
- Communication score
- Technical/Subject knowledge score
- Confidence assessment
- Strength identification
- Areas for improvement
- Personalized suggestions

## Tech Stack

- **Frontend**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS 3
- **API Communication**: Fetch API with proper error handling
- **Voice Features**:
  - Web Speech API (Speech Recognition)
  - Web Audio API (Speech Synthesis)
  - WebRTC (Camera/Microphone access)
- **State Management**: React hooks + Context (ready for Redux if needed)
- **Testing**: Vitest (ready for implementation)

## Project Structure

```
client/
├── components/
│   ├── interview/
│   │   ├── AvatarPanel.tsx          # AI interviewer avatar component
│   │   ├── CameraPanel.tsx          # Camera video feed component
│   │   ├── VoiceInputController.tsx # Voice input management
│   │   ├── QuestionDisplay.tsx      # Question display with subtitles
│   │   └── ProgressIndicator.tsx    # Interview progress bar
│   ├── ui/                          # Pre-built shadcn UI components
│   ├── ErrorBoundary.tsx            # Global error handling
│   └── ...
├── hooks/
│   ├── use-camera.ts                # Camera management hook
│   ├── use-speech-recognition.ts    # Speech-to-text hook
│   ├── use-audio-playback.ts        # Audio playback hook
│   ├── use-interview-session.ts     # Interview state management
│   └── use-mobile.tsx               # Mobile detection
├── lib/
│   ├── api-client.ts                # API client for backend
│   └── utils.ts                     # Utility functions
├── pages/
│   ├── Landing.tsx                  # Landing page
│   ├── InterviewSetup.tsx           # Setup/onboarding page
│   ├── InterviewRoom.tsx            # Main interview page
│   ├── Evaluation.tsx               # Results page
│   └── NotFound.tsx                 # 404 page
├── App.tsx                          # App routing and setup
├── main.tsx                         # Entry point
├── global.css                       # Global styles and theme
└── vite-env.d.ts                   # Vite environment types

shared/
└── api.ts                           # Shared API types and interfaces

server/
├── routes/
│   └── demo.ts                      # Example backend route
├── index.ts                         # Express server setup
└── node-build.ts                    # Build utilities
```

**Last Updated:** 2024  
**Status:** Production Ready
