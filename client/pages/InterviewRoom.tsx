import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Phone, AlertCircle, CheckCircle2 } from "lucide-react";
import { useCamera } from "@/hooks/use-camera";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";
import { useAudioPlayback } from "@/hooks/use-audio-playback";
import { apiClient } from "@/lib/api-client";
import AvatarPanel, { AvatarState } from "@/components/interview/AvatarPanel";
import CameraPanel from "@/components/interview/CameraPanel";
import VoiceInputController from "@/components/interview/VoiceInputController";
import QuestionDisplay from "@/components/interview/QuestionDisplay";
import ProgressIndicator from "@/components/interview/ProgressIndicator";
import type {
  NextQuestionResponse,
  InterviewType,
  Language,
} from "@shared/api";

interface LocationState {
  interviewType: InterviewType;
  language: Language;
  cvText?: string;
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

  // Media hooks
  const camera = useCamera();
  const speech = useSpeechRecognition({
    language:
      state?.language === "hindi"
        ? "hi-IN"
        : state?.language === "bengali"
          ? "bn-IN"
          : "en-US",
    silenceTimeout: 5000,
  });
  const audio = useAudioPlayback({ volume: 0.8 });

  // Validate setup
  useEffect(() => {
    if (!state) {
      navigate("/setup", { replace: true });
    }
  }, [state, navigate]);

  // Start interview session
  const initializeInterview = useCallback(async () => {
    if (!state) return;

    try {
      setError(null);
      setAvatarState("thinking");

      const response = await apiClient.startInterview({
        interviewType: state.interviewType,
        language: state.language,
        cvText: state.cvText,
      });

      setSessionId(response.sessionId);
      setCurrentQuestion(response.firstQuestion);
      setQuestionNumber(1);
      setPhase("active");
      setAvatarState("idle");

      // Stop any current listening/speaking before playing first question
      speech.stopListening();
      audio.stopPlayback();

      // Play first question using text-to-speech
      setTimeout(() => {
        try {
          audio.playTextToSpeech(response.firstQuestion, getLanguageCode());
          setAvatarState("speaking");
        } catch (err) {
          console.error("Failed to play first question:", err);
          setError("Failed to play question audio");
        }
      }, 300);
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
        setCurrentQuestion(response.questionText);
        setIsFollowUp(response.isFollowUp || false);
        if (response.questionNumber) setQuestionNumber(response.questionNumber);
        if (response.totalQuestions) setTotalQuestions(response.totalQuestions);

        // Reset voice input
        speech.resetTranscript();

        // Play next question with proper error handling
        setAvatarState("idle");
        setTimeout(() => {
          try {
            audio.playTextToSpeech(response.questionText, getLanguageCode());
            setAvatarState("speaking");
          } catch (err) {
            console.error("Failed to play next question:", err);
            setError("Failed to play question audio");
            setAvatarState("idle");
          }
        }, 300);

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
    if (!sessionId) return;

    try {
      setAvatarState("thinking");
      const evaluation = await apiClient.finishInterview({ sessionId });

      // Navigate to evaluation page with results
      navigate("/evaluation", {
        state: {
          sessionId,
          evaluation,
          completedAt: new Date().toISOString(),
        },
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to finish interview";
      setError(message);
      setAvatarState("idle");
    }
  }, [sessionId, navigate]);

  // Request permissions and start interview
  const handleStartInterview = useCallback(async () => {
    try {
      setError(null);

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
  }, [camera, speech.isSupported, initializeInterview]);

  // Handle end interview
  const handleEndInterview = async () => {
    if (
      window.confirm(
        "Are you sure you want to end this interview? Your progress will be saved.",
      )
    ) {
      audio.stopPlayback();
      speech.stopListening();
      await finishInterview();
    }
  };

  // Update avatar state based on what's happening
  useEffect(() => {
    if (speech.isListening) {
      setAvatarState("listening");
    } else if (audio.isPlaying) {
      setAvatarState("speaking");
    } else if (isSubmittingAnswer) {
      setAvatarState("thinking");
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      camera.stopCamera();
      speech.stopListening();
      audio.stopPlayback();
    };
  }, [camera, speech, audio]);

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
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                AI
              </div>
              <h1 className="font-bold text-foreground hidden sm:block">
                Interview Setup
              </h1>
            </div>
            <Link to="/setup">
              <Button variant="outline" size="sm">
                Cancel
              </Button>
            </Link>
          </div>
        </header>

        <main className="container py-12">
          <div className="max-w-2xl mx-auto space-y-8">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold">Prepare for Interview</h2>
              <p className="text-muted-foreground">
                We need access to your camera and microphone for the interview.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
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
        <header className="border-b border-border/40 bg-background/95 backdrop-blur">
          <div className="container h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                AI
              </div>
              <div className="hidden sm:block">
                <h1 className="font-bold text-foreground">Interview Room</h1>
                <p className="text-xs text-muted-foreground">
                  {state.interviewType.charAt(0).toUpperCase() +
                    state.interviewType.slice(1)}{" "}
                  • {state.language}
                </p>
              </div>
            </div>
            <Button
              onClick={handleEndInterview}
              variant="outline"
              className="border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 gap-2"
            >
              <Phone className="w-5 h-5" />
              <span className="hidden sm:inline">End Interview</span>
            </Button>
          </div>
        </header>

        <main className="container py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Left: Avatar and Camera */}
            <div className="lg:col-span-1 order-2 lg:order-1 space-y-6">
              {/* Avatar Panel */}
              <AvatarPanel state={avatarState} />

              {/* Camera Panel */}
              <CameraPanel
                videoRef={camera.videoRef}
                isActive={camera.isActive}
                isLoading={camera.isLoading}
                error={camera.error}
                onStartCamera={camera.startCamera}
                onStopCamera={camera.stopCamera}
              />
            </div>

            {/* Right: Question and Input */}
            <div className="lg:col-span-2 order-1 lg:order-2 space-y-6">
              {/* Progress */}
              <ProgressIndicator
                currentQuestion={questionNumber}
                totalQuestions={totalQuestions}
                isFollowUp={isFollowUp}
              />

              {/* Question Display */}
              <QuestionDisplay
                questionText={currentQuestion}
                isFollowUp={isFollowUp}
                questionNumber={questionNumber}
                totalQuestions={totalQuestions}
                subtitleText={currentQuestion}
                isPlaying={audio.isPlaying}
              />

              {/* Error display */}
              {error && (
                <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900 dark:text-red-300">
                      Interview Error
                    </p>
                    <p className="text-xs text-red-800 dark:text-red-400 mt-1">
                      {error}
                    </p>
                  </div>
                </div>
              )}

              {/* Voice Input Controller */}
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
              />
            </div>
          </div>
        </main>
      </div>
    );
  }

  // Fallback
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="flex justify-center gap-1">
          <div className="w-3 h-3 bg-primary rounded-full animate-pulse" />
          <div className="w-3 h-3 bg-secondary rounded-full animate-pulse delay-100" />
          <div className="w-3 h-3 bg-accent rounded-full animate-pulse delay-200" />
        </div>
        <p className="text-muted-foreground">Loading interview...</p>
      </div>
    </div>
  );
}
