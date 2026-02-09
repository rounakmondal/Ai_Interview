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

## API Integration

### Backend API Endpoints

The frontend integrates with these API endpoints:

#### 1. Start Interview

```http
POST /api/interview/start
Content-Type: application/json

{
  "interviewType": "it" | "government" | "private" | "non-it",
  "language": "english" | "hindi" | "bengali",
  "cvText": "string (optional)"
}

Response:
{
  "sessionId": "string",
  "firstQuestion": "string"
}
```

#### 2. Get Next Question

```http
POST /api/interview/next-question
Content-Type: application/json

{
  "sessionId": "string",
  "userAnswer": "string"
}

Response:
{
  "questionText": "string",
  "isFollowUp": boolean,
  "questionNumber": number,
  "totalQuestions": number
}
```

#### 3. Finish Interview

```http
POST /api/interview/finish
Content-Type: application/json

{
  "sessionId": "string"
}

Response:
{
  "overallScore": number,
  "communicationScore": number,
  "technicalScore": number,
  "confidenceScore": number,
  "weakAreas": string[],
  "improvementSuggestions": string[],
  "strengths": string[]
}
```

### API Client Usage

The API client is automatically configured in `client/lib/api-client.ts`:

```typescript
import { apiClient } from "@/lib/api-client";

// Start interview
const response = await apiClient.startInterview({
  interviewType: "it",
  language: "english",
  cvText: cvContent,
});

// Get next question
const nextQuestion = await apiClient.getNextQuestion({
  sessionId: response.sessionId,
  userAnswer: userTranscript,
});

// Finish interview
const evaluation = await apiClient.finishInterview({
  sessionId: sessionId,
});
```

## Hook Usage Guide

### useCamera

Manages camera access and video streaming:

```typescript
const {
  videoRef,
  isActive,
  isLoading,
  error,
  startCamera,
  stopCamera,
  toggleCamera,
} = useCamera({
  width: 1280,
  height: 720,
  facingMode: "user",
});
```

### useSpeechRecognition

Handles voice input and transcription:

```typescript
const {
  isListening,
  transcript,
  interimTranscript,
  error,
  isSupported,
  startListening,
  stopListening,
  resetTranscript,
} = useSpeechRecognition({
  language: "en-US",
  continuous: false,
  interimResults: true,
  silenceTimeout: 5000,
});
```

### useAudioPlayback

Manages audio playback and text-to-speech:

```typescript
const {
  audioRef,
  isPlaying,
  isLoading,
  error,
  isSupported,
  playAudio, // Play audio from URL
  playTextToSpeech, // Convert text to speech
  stopPlayback,
} = useAudioPlayback({ volume: 0.8 });
```

### useInterviewSession

High-level interview state management:

```typescript
const {
  state,
  startInterview,
  submitAnswer,
  finishInterview,
  resetError,
  reset,
} = useInterviewSession();
```

## Setup Instructions

### Prerequisites

- Node.js 16+ and npm/pnpm
- Modern browser with WebRTC support (Chrome, Firefox, Safari 14.1+, Edge)

### Installation

1. **Install dependencies:**

```bash
pnpm install
```

2. **Set API URL (if needed):**

```bash
export REACT_APP_API_URL=http://your-api-server:3000
```

Or add to `.env`:

```env
REACT_APP_API_URL=http://localhost:3000
```

3. **Start development server:**

```bash
pnpm dev
```

The app will be available at `http://localhost:5173`

### Production Build

```bash
pnpm build
pnpm start
```

## Browser Support

| Browser | Minimum Version | Features     |
| ------- | --------------- | ------------ |
| Chrome  | 25+             | Full support |
| Firefox | 25+             | Full support |
| Safari  | 14.1+           | Full support |
| Edge    | 79+             | Full support |
| Opera   | 15+             | Full support |

**Note:** Web Speech API and getUserMedia require HTTPS in production (except localhost).

## Feature Details

### Camera Integration

- Uses WebRTC getUserMedia API
- Requests permission before access
- Clean resource management on exit
- Error handling for blocked/unavailable camera
- Mobile-friendly video feed

### Voice Features

- **Speech-to-Text**: Uses Web Speech API
  - Automatic silence detection (3-5 seconds)
  - Real-time interim results display
  - Transcript preview before submission
  - Fallback text input mode

- **Text-to-Speech**: Uses Web Speech Synthesis API
  - Multiple voice options
  - Language-specific support
  - Playback control (pause/stop)
  - Volume control

### Avatar System

The avatar component supports multiple states:

- **Idle**: Awaiting questions
- **Speaking**: Questions being played
- **Listening**: User is answering
- **Thinking**: Processing user response

### Error Handling

Comprehensive error handling for:

- Network/API errors with user-friendly messages
- Camera/microphone permission denials
- Browser compatibility issues
- Session timeouts
- Invalid inputs
- Audio/speech synthesis failures

### Security Considerations

- ✅ No API keys embedded in frontend code
- ✅ HTTPS enforced in production
- ✅ CORS properly configured
- ✅ Input validation on all forms
- ✅ Secure session management
- ✅ Media stream cleanup on exit

## Performance Optimizations

- Lazy loading of components
- Optimized re-renders with React.memo
- Efficient state management
- Media stream resource cleanup
- Debounced API calls
- Optimized CSS with Tailwind
- Production build with tree-shaking

## Development Workflow

### Running Tests

```bash
pnpm test
```

### Type Checking

```bash
pnpm typecheck
```

### Linting (when configured)

```bash
pnpm lint
```

### Building

```bash
pnpm build
```

## Troubleshooting

### Camera/Microphone Not Working

1. Check browser permissions settings
2. Ensure using HTTPS in production
3. Try a different browser
4. Check `console` for specific error messages

### Voice Input Not Recognized

1. Check microphone levels
2. Try English language first
3. Speak clearly and at normal volume
4. Check browser compatibility (Chrome recommended)

### Audio Playback Issues

1. Check system volume
2. Verify browser audio permissions
3. Clear browser cache
4. Try different browser

### API Connection Errors

1. Check API server is running
2. Verify `REACT_APP_API_URL` environment variable
3. Check CORS configuration on backend
4. Look at browser Network tab for detailed errors

## Future Enhancements

- 🚀 Real AI avatar with video integration
- 🎙️ Advanced voice analytics
- 📱 Native mobile app (React Native)
- 🔐 User authentication and profiles
- 💾 Interview history and analytics
- 🌍 Additional language support
- 🎯 Interview preparation modules
- 📈 Performance analytics dashboard
- 🤖 Custom AI model integration
- 🎬 Video recording and playback

## Contributing

This is a production-grade template. For modifications:

1. Maintain TypeScript strict mode
2. Follow component patterns established
3. Keep error handling comprehensive
4. Test with real API endpoints
5. Ensure accessibility standards

## License

[Your License Here]

## Support

For issues, questions, or feature requests, please contact your development team or check the internal documentation.

---

**Version:** 1.0.0  
**Last Updated:** 2024  
**Status:** Production Ready
