import { FC, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Send, AlertCircle, MessageSquare } from "lucide-react";

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
}) => {
  const [manualAnswer, setManualAnswer] = useState("");
  const [useManualInput, setUseManualInput] = useState(false);

  const combinedTranscript = transcript + interimTranscript;
  const finalAnswer = useManualInput ? manualAnswer : transcript;
  const displayText = useManualInput ? manualAnswer : combinedTranscript;

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

      {/* Voice mode */}
      {!useManualInput && isSupported && (
        <div className="space-y-4">
          {/* Microphone button */}
          <div className="flex gap-3">
            {!isListening ? (
              <Button
                onClick={onStartListening}
                className="flex-1 gradient-primary text-base font-semibold gap-2"
              >
                <Mic className="w-5 h-5" />
                Start Speaking
              </Button>
            ) : (
              <Button
                onClick={onStopListening}
                variant="outline"
                className="flex-1 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-base font-semibold gap-2"
              >
                <MicOff className="w-5 h-5" />
                Stop Speaking
              </Button>
            )}
          </div>

          {/* Listening indicator */}
          {isListening && (
            <div className="bg-accent/10 border border-accent/20 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-100" />
                  <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200" />
                </div>
                <p className="text-sm text-accent font-medium">
                  Listening... (auto-stops after silence)
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

      {/* Submit button */}
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
            Submit Answer
          </>
        )}
      </Button>

      {/* Info text */}
      <p className="text-xs text-muted-foreground text-center">
        {useManualInput
          ? "Type your response and click submit when done."
          : "Click the microphone to start speaking. Your answer will be recorded automatically."}
      </p>
    </Card>
  );
};

export default VoiceInputController;
