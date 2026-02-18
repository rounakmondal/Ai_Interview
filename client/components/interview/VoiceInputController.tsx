import { FC, useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, AlertCircle, MessageSquare, Zap } from "lucide-react";

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
}) => {
  const [manualAnswer, setManualAnswer] = useState("");
  const [useManualInput, setUseManualInput] = useState(false);
  const [localAutoMode, setLocalAutoMode] = useState(autoMode);
  const wasListeningRef = useRef(false);
  const wasSpeakingRef = useRef(false);
  const autoSubmitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const combinedTranscript = transcript + interimTranscript;
  const finalAnswer = useManualInput ? manualAnswer : transcript;
  const displayText = useManualInput ? manualAnswer : combinedTranscript;

  // Auto-start listening when TTS finishes speaking
  useEffect(() => {
    if (localAutoMode && !useManualInput && isSupported) {
      // TTS just finished speaking
      if (wasSpeakingRef.current && !isSpeaking && !isListening && !isSubmitting) {
        console.log("Auto-mode: TTS finished, starting to listen after 500ms...");
        setTimeout(() => {
          onStartListening();
        }, 500); // Delay after TTS ends to avoid picking up echo
      }
    }
    wasSpeakingRef.current = isSpeaking;
  }, [isSpeaking, localAutoMode, useManualInput, isSupported, isListening, isSubmitting, onStartListening]);

  // Auto-submit when listening stops and there's a transcript
  useEffect(() => {
    if (localAutoMode && !useManualInput) {
      // Just stopped listening and have transcript
      if (wasListeningRef.current && !isListening && transcript.trim() && !isSubmitting) {
        console.log("Auto-mode: Stopped listening, auto-submitting transcript in 500ms...");
        // Small delay to ensure transcript is complete
        autoSubmitTimeoutRef.current = setTimeout(() => {
          if (transcript.trim()) {
            onSubmit(transcript);
          }
        }, 500);
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
      // Wait a bit for TTS to actually stop
      setTimeout(() => {
        onStartListening();
      }, 200);
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
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-100" />
                  <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse delay-200" />
                </div>
                <p className="text-sm text-accent font-medium">
                  {localAutoMode 
                    ? "🎤 Recording... (stops 2s after you finish speaking)" 
                    : "Listening... (auto-stops after silence)"}
                </p>
              </div>
            </div>
          )}

          {/* Transcript display */}
          {(transcript || interimTranscript) && (
            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-xs text-muted-foreground">Your transcript:</p>
              <p className="text-base text-foreground">
                {transcript}
                {interimTranscript && (
                  <span className="text-muted-foreground italic">
                    {interimTranscript}
                  </span>
                )}
              </p>
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

          {/* Clear transcript button */}
          {transcript && (
            <Button
              onClick={onResetTranscript}
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Clear Transcript
            </Button>
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

      {/* Submit button - always visible, but in auto mode it's optional */}
      {(!localAutoMode || useManualInput || transcript.trim()) && (
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
              {localAutoMode && !useManualInput ? "Submit Now (or wait for auto)" : "Submit Answer"}
            </>
          )}
        </Button>
      )}

      {/* Info text */}
      <p className="text-xs text-muted-foreground text-center">
        {useManualInput
          ? "Type your response and click submit when done."
          : localAutoMode
            ? "Auto mode: Listening starts after question, submits automatically when you stop speaking."
            : "Click the microphone to start speaking. Your answer will be recorded automatically."}
      </p>
    </Card>
  );
};

export default VoiceInputController;
