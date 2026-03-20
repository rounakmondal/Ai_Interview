import { FC, useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, AlertCircle, MessageSquare, Zap } from "lucide-react";
import VoiceActivityIndicator from "./VoiceActivityIndicator";

interface VoiceInputControllerProps {
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  isSupported: boolean;
  onStartListening: () => void;
  onStopListening: () => void;
  onResetTranscript: () => void;
  onSubmit: (text: string) => Promise<void>;
  isSubmitting?: boolean;
  allowManualInput?: boolean;
  isSpeaking?: boolean; // TTS is playing
  autoMode?: boolean; // Auto-listen after TTS, auto-submit after silence
  onAutoModeChange?: (enabled: boolean) => void;
  onStopSpeaking?: () => void; // Stop TTS before listening
  answerTimeLimit?: number; // Max seconds student can speak per answer (default: 120)
  audioLevel?: number; // 0-1 real-time audio level for visual feedback
  isSpeechDetected?: boolean; // True if speech is being detected
  confidence?: number; // 0-1 confidence score
}

const VoiceInputController: FC<VoiceInputControllerProps> = ({
  isListening,
  transcript,
  interimTranscript,
  error,
  isSupported,
  onStartListening,
  onStopListening,
  onResetTranscript,
  onSubmit,
  isSubmitting = false,
  allowManualInput = true,
  isSpeaking = false,
  autoMode = true,
  onAutoModeChange,
  onStopSpeaking,
  answerTimeLimit = 120,
  audioLevel = 0,
  isSpeechDetected = false,
  confidence = 1,
}) => {
  const [manualAnswer, setManualAnswer] = useState("");
  const [useManualInput, setUseManualInput] = useState(false);
  const [localAutoMode, setLocalAutoMode] = useState(autoMode);
  const [answerTimeLeft, setAnswerTimeLeft] = useState<number | null>(null);
  const [pendingAutoSubmit, setPendingAutoSubmit] = useState(false);
  const wasListeningRef = useRef(false);
  const wasSpeakingRef = useRef(false);
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const autoListenTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const answerTimerRef = useRef<NodeJS.Timeout | null>(null);
  const onStopListeningRef = useRef(onStopListening);
  useEffect(() => { onStopListeningRef.current = onStopListening; }, [onStopListening]);

  // Keep localAutoMode in sync with prop
  useEffect(() => {
    setLocalAutoMode(autoMode);
  }, [autoMode]);

  const combinedTranscript = transcript + interimTranscript;
  const finalAnswer = useManualInput ? manualAnswer : transcript;
  const displayText = useManualInput ? manualAnswer : combinedTranscript;

  // Keep refs updated for timeout closure access
  const isListeningRef = useRef(isListening);
  const isSubmittingRef = useRef(isSubmitting);
  const onStartListeningRef = useRef(onStartListening);
  useEffect(() => { isListeningRef.current = isListening; }, [isListening]);
  useEffect(() => { isSubmittingRef.current = isSubmitting; }, [isSubmitting]);
  useEffect(() => { onStartListeningRef.current = onStartListening; }, [onStartListening]);

  // Answer time limit countdown - starts when student starts speaking
  useEffect(() => {
    if (isListening && !useManualInput && answerTimeLimit > 0) {
      setAnswerTimeLeft(answerTimeLimit);
      answerTimerRef.current = setInterval(() => {
        setAnswerTimeLeft(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(answerTimerRef.current!);
            answerTimerRef.current = null;
            console.log("Answer time limit reached - stopping listening");
            onStopListeningRef.current();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (answerTimerRef.current) {
        clearInterval(answerTimerRef.current);
        answerTimerRef.current = null;
      }
      setAnswerTimeLeft(null);
    }

    return () => {
      if (answerTimerRef.current) {
        clearInterval(answerTimerRef.current);
        answerTimerRef.current = null;
      }
    };
  }, [isListening, useManualInput, answerTimeLimit]);

  // Auto-start listening when TTS finishes speaking
  useEffect(() => {
    // Clear any existing auto-listen timeout first
    if (autoListenTimeoutRef.current) {
      clearTimeout(autoListenTimeoutRef.current);
      autoListenTimeoutRef.current = null;
    }

    if (localAutoMode && !useManualInput && isSupported) {
      // TTS just finished speaking
      if (wasSpeakingRef.current && !isSpeaking) {
        console.log("Auto-mode: TTS finished, starting to listen after 300ms...");
        autoListenTimeoutRef.current = setTimeout(() => {
          autoListenTimeoutRef.current = null;
          // Double-check conditions still valid before starting (using refs for current values)
          if (!isListeningRef.current && !isSubmittingRef.current) {
            console.log("Auto-mode: Now starting listening...");
            onStartListeningRef.current();
          } else {
            console.log("Auto-mode: Skipped auto-listen - already listening or submitting");
          }
        }, 300); // Reduced from 500ms to 300ms for smoother transition
      }
    }
    wasSpeakingRef.current = isSpeaking;

    return () => {
      if (autoListenTimeoutRef.current) {
        clearTimeout(autoListenTimeoutRef.current);
        autoListenTimeoutRef.current = null;
      }
    };
  }, [isSpeaking, localAutoMode, useManualInput, isSupported]);

  // Auto-submit when listening stops and there's a transcript
  useEffect(() => {
    if (localAutoMode && !useManualInput) {
      // Just stopped listening and have transcript
      if (wasListeningRef.current && !isListening && transcript.trim() && !isSubmitting) {
        setPendingAutoSubmit(true);
        autoSubmitTimeoutRef.current = setTimeout(() => {
          setPendingAutoSubmit(false);
          if (transcript.trim()) {
            onSubmit(transcript);
          }
        }, 200); // Reduced from 400ms to 200ms for faster submission
      } else if (isListening) {
        // User is speaking again — cancel any pending auto-submit
        if (autoSubmitTimeoutRef.current) {
          clearTimeout(autoSubmitTimeoutRef.current);
          autoSubmitTimeoutRef.current = null;
        }
        setPendingAutoSubmit(false);
      }
    }
    wasListeningRef.current = isListening;

    return () => {
      if (autoSubmitTimeoutRef.current) {
        clearTimeout(autoSubmitTimeoutRef.current);
      }
    };
  }, [isListening, localAutoMode, useManualInput, transcript, isSubmitting, onSubmit]);

  const toggleAutoMode = () => {
    const newValue = !localAutoMode;
    setLocalAutoMode(newValue);
    onAutoModeChange?.(newValue);
  };

  // Start listening - stop TTS first if playing
  const handleStartListening = () => {
    if (isSpeaking && onStopSpeaking) {
      console.log("Stopping TTS before starting to listen...");
      onStopSpeaking();
      // Wait a bit for TTS to actually stop (reduced from 200ms)
      setTimeout(() => {
        onStartListening();
      }, 100);
    } else {
      onStartListening();
    }
  };

  const handleSubmit = async () => {
    if (!finalAnswer.trim()) return;
    await onSubmit(finalAnswer);
    setManualAnswer("");
  };

  const handleToggleInputMode = () => {
    if (isListening) {
      onStopListening();
    }
    setUseManualInput(!useManualInput);
  };

  return (
    <Card className="border-border/40 space-y-3 sm:space-y-4 p-4 sm:p-6">
      {/* Input mode indicator */}
      <div className="flex items-center justify-between gap-2">
        <h3 className="font-semibold text-sm sm:text-base text-foreground">
          {useManualInput ? "Type your answer" : "Speak your answer"}
        </h3>
        <div className="flex items-center gap-2">
          {/* Auto mode toggle */}
          {!useManualInput && isSupported && (
            <Button
              variant={localAutoMode ? "default" : "ghost"}
              size="sm"
              onClick={toggleAutoMode}
              className={`text-xs px-2 sm:px-3 gap-1 ${localAutoMode ? "bg-green-600 hover:bg-green-700 text-white" : "text-muted-foreground hover:text-foreground"}`}
            >
              <Zap className="w-3 h-3" />
              {localAutoMode ? "Auto" : "Manual"}
            </Button>
          )}
          {allowManualInput && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToggleInputMode}
              className="text-xs text-muted-foreground hover:text-foreground px-2 sm:px-3"
            >
              {useManualInput ? "Voice" : "Text"}
            </Button>
          )}
        </div>
      </div>
      
      {/* Auto mode info */}
      {localAutoMode && !useManualInput && isSupported && (
        <div className="bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-900/50 rounded-lg p-2 text-xs text-green-700 dark:text-green-400 flex items-center gap-2">
          <Zap className="w-4 h-4" />
          <span>Auto mode: Will listen automatically after question and submit after you stop speaking</span>
        </div>
      )}

      {/* Voice mode */}
      {!useManualInput && isSupported && (
        <div className="space-y-4">
          {/* Voice Activity Visualization */}
          <div className="flex justify-center py-4">
            <VoiceActivityIndicator
              isListening={isListening && !isSpeaking}
              isSpeaking={isSpeaking}
              hasTranscript={!!transcript.trim()}
            />
          </div>

          {/* Real-time audio level meter */}
          {isListening && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-foreground">Microphone Level</span>
                <span className="text-muted-foreground">{Math.round(audioLevel * 100)}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden shadow-inner">
                <div
                  className={`h-full transition-all duration-100 ease-out rounded-full ${
                    audioLevel > 0.7
                      ? 'bg-red-500'
                      : audioLevel > 0.4
                      ? 'bg-yellow-500'
                      : 'bg-primary'
                  }`}
                  style={{ width: `${audioLevel * 100}%` }}
                />
              </div>
              {isSpeechDetected && (
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="text-green-600 dark:text-green-400 font-medium">Speech detected</span>
                </div>
              )}
            </div>
          )}

          {/* TTS playing indicator */}
          {isSpeaking && (
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/50 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200" />
                </div>
                <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {localAutoMode 
                    ? "Interviewer is speaking... Listening will start automatically." 
                    : "Interviewer is speaking... Wait for the question to finish."}
                </p>
              </div>
            </div>
          )}
          
          {/* Microphone button - single toggle */}
          <div className="flex gap-3">
            <Button
              onClick={() => {
                if (isListening) {
                  console.log("Stop Speaking clicked");
                  onStopListening();
                } else {
                  console.log("Start Speaking clicked");
                  handleStartListening();
                }
              }}
              disabled={isSubmitting}
              className={`flex-1 text-base font-semibold gap-2 ${
                isListening 
                  ? "bg-red-600 hover:bg-red-700 text-white" 
                  : isSpeaking 
                    ? "bg-orange-500 hover:bg-orange-600 text-white"
                    : "gradient-primary"
              }`}
            >
              {isListening ? (
                <>
                  <MicOff className="w-5 h-5" />
                  Stop & Submit
                </>
              ) : isSpeaking ? (
                <>
                  <Mic className="w-5 h-5" />
                  Skip Question (Start Speaking)
                </>
              ) : (
                <>
                  <Mic className="w-5 h-5" />
                  {localAutoMode ? "Start Speaking" : "Start Speaking"}
                </>
              )}
            </Button>
          </div>

          {/* Listening indicator */}
          {isListening && (
            <div className={`border rounded-lg p-4 ${
              answerTimeLeft !== null && answerTimeLeft <= answerTimeLimit * 0.25
                ? "bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800"
                : answerTimeLeft !== null && answerTimeLeft <= answerTimeLimit * 0.5
                ? "bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800"
                : "bg-accent/10 border-accent/20"
            }`}>
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="flex gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-100" />
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-200" />
                  </div>
                  <p className={`text-sm font-medium ${
                    answerTimeLeft !== null && answerTimeLeft <= answerTimeLimit * 0.25
                      ? "text-red-600 dark:text-red-400"
                      : answerTimeLeft !== null && answerTimeLeft <= answerTimeLimit * 0.5
                      ? "text-amber-600 dark:text-amber-400"
                      : "text-accent"
                  }`}>
                    {localAutoMode
                      ? "🎤 Recording — auto-submits after 3s silence"
                      : "Listening... (auto-stops after silence)"}
                  </p>
                </div>
                {answerTimeLeft !== null && (
                  <div className={`flex items-center gap-1.5 text-sm font-mono font-bold px-2.5 py-1 rounded-md ${
                    answerTimeLeft <= answerTimeLimit * 0.25
                      ? "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300"
                      : answerTimeLeft <= answerTimeLimit * 0.5
                      ? "bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300"
                      : "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300"
                  }`}>
                    <span>⏱</span>
                    <span>{Math.floor(answerTimeLeft / 60).toString().padStart(2, "0")}:{(answerTimeLeft % 60).toString().padStart(2, "0")}</span>
                  </div>
                )}
              </div>
            </div>
          )}
          {/* Confidence indicator and live transcript */}
          {isListening && (transcript.trim() || interimTranscript.trim()) && (
            <div className="space-y-2 p-4 bg-gradient-to-r from-primary/8 to-secondary/8 border border-primary/20 rounded-lg">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-foreground">Recognition Confidence</span>
                <span className="text-xs font-bold text-primary">{Math.round(confidence * 100)}%</span>
              </div>
              <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary transition-all duration-200 ease-out"
                  style={{ width: `${confidence * 100}%` }}
                />
              </div>
              <div className="text-xs text-muted-foreground mt-2 leading-relaxed">
                <span className="font-medium text-foreground">{transcript}</span>
                {interimTranscript && <span className="italic opacity-60">{interimTranscript}</span>}
              </div>
            </div>
          )}
          {/* Pending auto-submit indicator — shown briefly when answer is captured */}
          {pendingAutoSubmit && (
            <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <MicOff className="w-5 h-5 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Answer captured</p>
                <p className="text-xs text-muted-foreground">Submitting your response...</p>
              </div>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          )}

          {/* Error display */}
          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-300">
                  Microphone Error
                </p>
                <p className="text-xs text-red-800 dark:text-red-400 mt-0.5">
                  {error}
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Manual input mode */}
      {useManualInput && (
        <textarea
          value={manualAnswer}
          onChange={(e) => setManualAnswer(e.target.value)}
          placeholder="Type your answer here..."
          className="w-full p-4 rounded-lg border border-border/40 bg-muted/50 text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary resize-none"
          rows={4}
        />
      )}

      {/* Not supported message */}
      {!isSupported && (
        <div className="bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-900/50 rounded-lg p-3 flex gap-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-yellow-900 dark:text-yellow-300">
              Voice input not supported
            </p>
            <p className="text-xs text-yellow-800 dark:text-yellow-400 mt-0.5">
              Please use text input or update your browser.
            </p>
          </div>
        </div>
      )}

      {/* Submit button — in auto+voice mode only shown when transcript ready for early manual submit */}
      {(!localAutoMode || useManualInput || (transcript.trim() && !pendingAutoSubmit)) && (
        <Button
          onClick={handleSubmit}
          disabled={!finalAnswer.trim() || isSubmitting}
          className="w-full gradient-primary text-lg py-3 font-semibold gap-2"
        >
          {isSubmitting ? (
            <>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-white rounded-full animate-pulse delay-100" />
              </div>
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-5 h-5" />
              {localAutoMode && !useManualInput ? "Submit Now" : "Submit Answer"}
            </>
          )}
        </Button>
      )}

      {/* Info text */}
      <p className="text-xs text-muted-foreground text-center">
        {useManualInput
          ? "Type your response and click submit when done."
          : localAutoMode
            ? "Listening starts automatically. Stop talking — answer submits after 3 seconds of silence."
            : "Click the microphone to start speaking. Your answer submits when you stop."}
      </p>
    </Card>
  );
};

export default VoiceInputController;
