import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Phone, AlertCircle, CheckCircle2, Mic, Brain, Sparkles, Video, Shield } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { apiClient } from "@/lib/api-client";
import AvatarPanel, { AvatarState } from "@/components/interview/AvatarPanel";
import CameraPanel from "@/components/interview/CameraPanel";
import VoiceInputController from "@/components/interview/VoiceInputController";
import QuestionDisplay from "@/components/interview/QuestionDisplay";
import type {
  NextQuestionResponse,
  Language,
} from "@shared/api";

interface LocationState {
  interviewType: string; // Free text interview type
  language: Language;
  cvText?: string;
  jobDescription?: string; // Optional job description
  timerDuration?: number; // in minutes
}

type InterviewPhase = "setup" | "active" | "complete";

export default function InterviewRoom() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | undefined;

  // Interview state
  const [phase, setPhase] = useState<InterviewPhase>("setup");
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(1);
  const [totalQuestions, setTotalQuestions] = useState(8);
  const [isFollowUp, setIsFollowUp] = useState(false);
  const [avatarState, setAvatarState] = useState<AvatarState>("idle");
  const [isSubmittingAnswer, setIsSubmittingAnswer] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<number>(0); // in seconds
  const [showEndDialog, setShowEndDialog] = useState(false);
  const [autoMode, setAutoMode] = useState(true); // Auto-listen and auto-submit

  // Media hooks
  const camera = useCamera();
  const speech = useSpeechRecognition({
    language:
      state?.language === "hindi"
        ? "hi-IN"
        : state?.language === "bengali"
          ? "bn-IN"
          : "en-US",
    silenceTimeout: 2000, // 2 seconds of silence before auto-stopping
  });
  const audio = useAudioPlayback({ volume: 1.0 });

  // Validate setup
  useEffect(() => {
    if (!state) {
      navigate("/setup", { replace: true });
    }
  }, [state, navigate]);

  // Timer countdown effect
  useEffect(() => {
    if (phase !== "active" || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [phase]);

  // Auto-finish when timer expires
  useEffect(() => {
    if (timeRemaining === 0 && phase === "active" && sessionId) {
      // Automatically finish interview without confirmation
      audio.stopPlayback();
      speech.stopListening();
      finishInterview();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRemaining, phase, sessionId]);

  // Start interview session
  const initializeInterview = useCallback(async () => {
    if (!state) return;

    try {
      setError(null);
      setAvatarState("thinking");

      console.log("Starting interview with CV text:", state.cvText ? `${state.cvText.length} chars` : "No CV");
      console.log("Job description:", state.jobDescription ? `${state.jobDescription.length} chars` : "No JD");
      
      const response = await apiClient.startInterview({
        interviewType: state.interviewType,
        language: state.language,
        cvText: state.cvText,
        jobDescription: state.jobDescription,
      });

      console.log("API Start Interview Response:", response);
      console.log("Setting question to:", response.message);
      
      setSessionId(response.sessionId);
      setCurrentQuestion(response.message || "No question received");
      setQuestionNumber(1);
      setPhase("active");
      setAvatarState("idle");
      
      // Set timer if provided (convert minutes to seconds)
      if (state.timerDuration) {
        setTimeRemaining(state.timerDuration * 60);
      }

      // Stop any current listening/speaking before playing first question
      speech.stopListening();
      audio.stopPlayback();

      // Delay to ensure browser is ready after canceling previous speech
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Play first question using text-to-speech
      console.log("Playing first question:", response.message);
      if (response.message && response.message.trim()) {
        audio.playTextToSpeech(response.message, getLanguageCode());
      } else {
        console.error("No message received from API");
      }
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start interview";
      setError(message);
      setAvatarState("idle");
    }
  }, [state, audio, speech]);

  // Get next question after answer submission
  const handleAnswerSubmit = useCallback(
    async (transcript: string) => {
      if (!sessionId || !transcript.trim()) return;

      try {
        setError(null);
        setIsSubmittingAnswer(true);
        setAvatarState("thinking");

        // Stop listening and any playback
        speech.stopListening();
        audio.stopPlayback();

        const response: NextQuestionResponse = await apiClient.getNextQuestion({
          sessionId,
          userAnswer: transcript,
        });

        // Check if interview is complete
        if (
          response.questionNumber &&
          response.totalQuestions &&
          response.questionNumber > response.totalQuestions
        ) {
          // Interview complete
          await finishInterview();
          return;
        }

        // Update state
        setCurrentQuestion(response.message);
        setIsFollowUp(response.isFollowUp || false);
        if (response.questionNumber) setQuestionNumber(response.questionNumber);
        if (response.totalQuestions) setTotalQuestions(response.totalQuestions);

        // Reset voice input
        speech.resetTranscript();
        speech.stopListening();
        audio.stopPlayback();

        // Delay to ensure browser is ready
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // Play next question
        console.log("Playing next question:", response.message);
        if (response.message && response.message.trim()) {
          audio.playTextToSpeech(response.message, getLanguageCode());
        }

        setIsSubmittingAnswer(false);
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Failed to get next question";
        setError(message);
        setAvatarState("idle");
        setIsSubmittingAnswer(false);
      }
    },
    [sessionId, speech, audio],
  );

  // Finish interview
  const finishInterview = useCallback(async () => {
    try {
      setAvatarState("thinking");
      
      let evaluation;
      if (sessionId) {
        evaluation = await apiClient.finishInterview({ sessionId });
      } else {
        // No sessionId - provide default evaluation
        console.warn("No sessionId, using default evaluation");
        evaluation = {
          overallScore: 7.0,
          communicationScore: 7.0,
          technicalScore: 7.0,
          confidenceScore: 7.0,
          weakAreas: [{ area: "Session", issue: "Session was not properly initialized", howToImprove: "Try starting a new interview session" }],
          strengths: ["Completed interview attempt"],
        };
      }

      // Navigate to evaluation page with results
      navigate("/evaluation", {
        state: {
          sessionId: sessionId || "no-session",
          evaluation,
          completedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      console.error("Failed to finish interview:", err);
      // Navigate with default evaluation even on error
      navigate("/evaluation", {
        state: {
          sessionId: sessionId || "error-session",
          evaluation: {
            overallScore: 6.0,
            communicationScore: 6.0,
            technicalScore: 6.0,
            confidenceScore: 6.0,
            weakAreas: [{ area: "Error", issue: "Interview ended with an error", howToImprove: "Try starting a new interview" }],
            strengths: ["Completed interview attempt"],
          },
          completedAt: new Date().toISOString(),
        },
      });
    }
  }, [sessionId, navigate]);

  // Request permissions and start interview
  const handleStartInterview = useCallback(async () => {
    try {
      setError(null);

      // Warm up TTS immediately on user interaction (unlocks audio)
      audio.warmUp();

      // Request camera
      await camera.startCamera();

      // Check speech recognition support
      if (!speech.isSupported) {
        setError(
          "Voice input not supported. Please use text input or update your browser.",
        );
      }

      setPermissionsGranted(true);
      await initializeInterview();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start interview";
      setError(message);
    }
  }, [camera, speech.isSupported, initializeInterview, audio]);

  // Handle end interview
  const handleEndInterview = () => {
    setShowEndDialog(true);
  };

  const confirmEndInterview = async () => {
    setShowEndDialog(false);
    audio.stopPlayback();
    speech.stopListening();
    await finishInterview();
  };

  // Update avatar state based on what's happening
  useEffect(() => {
    if (speech.isListening) {
      setAvatarState("listening");
    } else if (audio.isPlaying) {
      setAvatarState("speaking");
    } else if (isSubmittingAnswer) {
      setAvatarState("thinking");
    } else {
      setAvatarState("idle");
    }
  }, [speech.isListening, audio.isPlaying, isSubmittingAnswer]);

  const getLanguageCode = (): string => {
    switch (state?.language) {
      case "hindi":
        return "hi-IN";
      case "bengali":
        return "bn-IN";
      default:
        return "en-US";
    }
  };

  const formatTime = (seconds: number): string => {
    if (seconds <= 0) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      camera.stopCamera();
      speech.stopListening();
      audio.stopPlayback();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on unmount

  if (!state) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="p-8 text-center max-w-md space-y-4">
          <h1 className="text-2xl font-bold">Interview Setup Required</h1>
          <p className="text-muted-foreground">
            Please start from the setup page to begin an interview.
          </p>
          <Link to="/setup">
            <Button className="w-full gradient-primary">Go to Setup</Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Setup phase - request permissions
  if (phase === "setup" && !permissionsGranted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold">
                AI
              </div>
              <span className="font-bold text-lg text-foreground hidden sm:inline">
                InterviewAI
              </span>
            </div>
            <Link to="/setup">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
          </div>
        </header>

        <main className="container px-4 sm:px-6 py-8 sm:py-12">
          <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-bold">Prepare for Interview</h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                We need access to your camera and microphone for the interview.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              {/* Camera setup */}
              <Card className="p-6 border-border/40 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M23 7l-7 5 7 5V7z" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Camera</h3>
                <p className="text-sm text-muted-foreground">
                  We'll access your camera so the interviewer can see you.
                </p>
              </Card>

              {/* Microphone setup */}
              <Card className="p-6 border-border/40 space-y-4">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                  >
                    <path d="M12 1a3 3 0 0 0-3 3v12a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
                    <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
                    <line x1="12" y1="19" x2="12" y2="23" />
                    <line x1="8" y1="23" x2="16" y2="23" />
                  </svg>
                </div>
                <h3 className="font-bold text-lg">Microphone</h3>
                <p className="text-sm text-muted-foreground">
                  We'll record your voice for the interview.
                </p>
              </Card>
            </div>

            {/* Error display */}
            {error && (
              <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-red-900 dark:text-red-300">
                    Setup Error
                  </p>
                  <p className="text-xs text-red-800 dark:text-red-400 mt-1">
                    {error}
                  </p>
                </div>
              </div>
            )}

            {/* Start button */}
            <Button
              onClick={handleStartInterview}
              disabled={camera.isLoading}
              className="w-full gradient-primary text-base font-semibold py-6"
            >
              {camera.isLoading ? "Initializing..." : "Continue to Interview"}
            </Button>

            {/* Info */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4">
              <p className="text-xs text-blue-900 dark:text-blue-300">
                💡 Make sure you're in a quiet, well-lit room for the best
                interview experience.
              </p>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Active interview phase
  if (phase === "active" && sessionId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-background/50">
        {/* End Interview Confirmation Dialog */}
        <AlertDialog open={showEndDialog} onOpenChange={setShowEndDialog}>
          <AlertDialogContent className="sm:max-w-md">
            <AlertDialogHeader>
              <AlertDialogTitle>End Interview?</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to end this interview? Your progress will be saved and you'll receive your evaluation.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Continue Interview</AlertDialogCancel>
              <AlertDialogAction
                onClick={confirmEndInterview}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                End Interview
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        {/* Hidden audio element for speaker output */}
        <audio ref={audio.audioRef} crossOrigin="anonymous" />
        <header className="border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm sm:text-base">
                AI
              </div>
              <span className="font-bold text-base sm:text-lg text-foreground hidden sm:inline">
                InterviewAI
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              {timeRemaining > 0 && (
                <div className={`text-lg sm:text-2xl font-bold ${timeRemaining < 60 ? 'text-red-600' : 'text-primary'}`}>
                  {formatTime(timeRemaining)}
                </div>
              )}
              <Button
                onClick={handleEndInterview}
                variant="outline"
                size="sm"
                className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 gap-1 sm:gap-2 px-2 sm:px-4"
              >
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">End Interview</span>
              </Button>
            </div>
          </div>
        </header>

        <main className="container relative px-4 sm:px-6">
          {/* Mobile Layout: Stack vertically */}
          <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 py-4 lg:py-8">
            {/* Avatar - Full width on mobile, fixed width on desktop */}
            <div className="w-full lg:w-72 xl:w-80 flex-shrink-0 order-2 lg:order-1">
              <div className="lg:sticky lg:top-8 w-full">
                <AvatarPanel 
                  state={avatarState} 
                  isSpeaking={audio.isPlaying}
                />
              </div>
            </div>

            {/* Center: main interview area */}
            <div className="flex-1 flex flex-col items-center order-1 lg:order-2">
              <div className="w-full max-w-2xl space-y-4 lg:space-y-6">
                <div className="bg-transparent">
                  {currentQuestion ? (
                    <QuestionDisplay
                      questionText={currentQuestion}
                      isFollowUp={isFollowUp}
                      questionNumber={questionNumber}
                      totalQuestions={totalQuestions}
                      subtitleText={currentQuestion}
                      isPlaying={audio.isPlaying}
                    />
                  ) : (
                    <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-4 lg:p-6 text-center">
                      <p className="text-muted-foreground">Loading question...</p>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 lg:p-4 flex gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-red-900 dark:text-red-300">Interview Error</p>
                      <p className="text-xs text-red-800 dark:text-red-400 mt-1">{error}</p>
                    </div>
                  </div>
                )}

                <div>
                  <VoiceInputController
                    isListening={speech.isListening}
                    transcript={speech.transcript}
                    interimTranscript={speech.interimTranscript}
                    error={speech.error}
                    isSupported={speech.isSupported}
                    onStartListening={speech.startListening}
                    onStopListening={speech.stopListening}
                    onResetTranscript={speech.resetTranscript}
                    onSubmit={handleAnswerSubmit}
                    isSubmitting={isSubmittingAnswer}
                    isSpeaking={audio.isPlaying}
                    autoMode={autoMode}
                    onAutoModeChange={setAutoMode}
                    onStopSpeaking={audio.stopPlayback}
                  />
                </div>
              </div>
            </div>

            {/* Right: Camera - Hidden on mobile, small on tablet, normal on desktop */}
            <div className="hidden md:block w-32 lg:w-44 flex-shrink-0 order-3">
              <div className="lg:sticky lg:top-8 shadow-lg rounded-lg overflow-hidden w-full">
                <CameraPanel
                  videoRef={camera.videoRef}
                  isActive={camera.isActive}
                  isLoading={camera.isLoading}
                  error={camera.error}
                  onStartCamera={camera.startCamera}
                  onStopCamera={camera.stopCamera}
                />
              </div>
            </div>
          </div>

          {/* Mobile Camera - Fixed bottom on mobile only */}
          <div className="fixed bottom-4 right-4 w-24 h-32 md:hidden z-50 shadow-xl rounded-lg overflow-hidden border-2 border-background">
            <CameraPanel
              videoRef={camera.videoRef}
              isActive={camera.isActive}
              isLoading={camera.isLoading}
              error={camera.error}
              onStartCamera={camera.startCamera}
              onStopCamera={camera.stopCamera}
            />
          </div>
        </main>
      </div>
    );
  }

  // Fallback — stylish loading screen
  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center">
      {/* Animated gradient background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-30"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.15) 0%, transparent 70%)",
            animation: "loaderPulseRing 4s ease-in-out infinite",
          }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full opacity-20"
          style={{
            background: "radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, transparent 70%)",
            animation: "loaderPulseRing 4s ease-in-out infinite 1s",
          }}
        />
      </div>

      {/* Floating particles */}
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary/30"
          style={{
            top: `${20 + Math.random() * 60}%`,
            left: `${15 + Math.random() * 70}%`,
            animation: `loaderFloat ${3 + i * 0.5}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}

      <div className="relative z-10 flex flex-col items-center gap-10 px-6 max-w-sm w-full">
        {/* Central animated icon */}
        <div className="relative w-32 h-32">
          {/* Outer spinning ring */}
          <svg
            className="absolute inset-0 w-full h-full"
            viewBox="0 0 128 128"
            style={{ animation: "loaderSpin 6s linear infinite" }}
          >
            <defs>
              <linearGradient id="loaderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
              </linearGradient>
            </defs>
            <circle cx="64" cy="64" r="60" fill="none" stroke="hsl(var(--primary) / 0.08)" strokeWidth="2" />
            <circle
              cx="64" cy="64" r="60" fill="none"
              stroke="url(#loaderGrad)" strokeWidth="2.5"
              strokeDasharray="90 290" strokeLinecap="round"
            />
          </svg>

          {/* Inner spinning ring (reverse) */}
          <svg
            className="absolute inset-3 w-[calc(100%-1.5rem)] h-[calc(100%-1.5rem)]"
            viewBox="0 0 104 104"
            style={{ animation: "loaderSpinReverse 4s linear infinite" }}
          >
            <circle
              cx="52" cy="52" r="50" fill="none"
              stroke="hsl(var(--primary) / 0.15)" strokeWidth="1.5"
              strokeDasharray="40 280" strokeLinecap="round"
            />
          </svg>

          {/* Center icon */}
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ animation: "loaderBreath 3s ease-in-out infinite" }}
          >
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-xl shadow-primary/25">
              <Brain className="w-8 h-8 text-primary-foreground" />
            </div>
          </div>

          {/* Orbiting dots */}
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="absolute inset-0"
              style={{
                animation: "loaderSpin 3s linear infinite",
                animationDelay: `${i * 1}s`,
              }}
            >
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-primary shadow-lg shadow-primary/40"
                style={{ opacity: 1 - i * 0.25 }}
              />
            </div>
          ))}
        </div>

        {/* Text */}
        <div className="text-center space-y-3">
          <h2
            className="text-xl font-semibold tracking-tight"
            style={{ animation: "loaderFadeSlideUp 0.6s ease-out both" }}
          >
            Preparing your interview
          </h2>
          <p
            className="text-sm text-muted-foreground leading-relaxed"
            style={{ animation: "loaderFadeSlideUp 0.6s ease-out 0.15s both" }}
          >
            Setting up AI, camera & microphone
          </p>
        </div>

        {/* Animated feature pills */}
        <div
          className="flex flex-wrap justify-center gap-2"
          style={{ animation: "loaderFadeSlideUp 0.6s ease-out 0.3s both" }}
        >
          {[
            { icon: Mic, label: "Voice" },
            { icon: Video, label: "Camera" },
            { icon: Brain, label: "AI Engine" },
            { icon: Shield, label: "Secure" },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.label}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-xs font-medium text-muted-foreground"
                style={{
                  animation: "loaderPillPop 0.4s ease-out both",
                  animationDelay: `${0.5 + i * 0.12}s`,
                }}
              >
                <Icon className="w-3 h-3 text-primary" />
                {item.label}
              </div>
            );
          })}
        </div>

        {/* Animated progress bar */}
        <div className="w-full max-w-xs space-y-2">
          <div className="h-1 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary via-primary/80 to-primary"
              style={{
                animation: "loaderProgress 2.5s ease-in-out infinite",
              }}
            />
          </div>
        </div>
      </div>

      {/* Inline keyframes */}
      <style>{`
        @keyframes loaderSpin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes loaderSpinReverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes loaderPulseRing {
          0%, 100% { transform: translate(-50%, -50%) scale(1); opacity: 0.2; }
          50% { transform: translate(-50%, -50%) scale(1.15); opacity: 0.35; }
        }
        @keyframes loaderBreath {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.08); }
        }
        @keyframes loaderFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.3; }
          50% { transform: translateY(-18px) scale(1.3); opacity: 0.6; }
        }
        @keyframes loaderFadeSlideUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes loaderPillPop {
          from { opacity: 0; transform: scale(0.8); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes loaderProgress {
          0% { width: 0%; }
          50% { width: 80%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}
