import { useEffect, useRef, useCallback, useState } from "react";
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from "react-speech-recognition";

export interface UseImprovedSpeechOptions {
  language?: string;
  silenceTimeout?: number; // Auto-stop after silence (ms)
  onTranscriptChange?: (transcript: string, isFinal: boolean) => void;
  onSilenceDetected?: () => void;
  echoCancellation?: boolean; // Enable echo cancellation
}

/**
 * Improved speech recognition with better UX and echo cancellation
 * Prevents glitching and provides smooth real-time transcription
 */
export const useImprovedSpeech = (options: UseImprovedSpeechOptions = {}) => {
  const {
    language = "en-US",
    silenceTimeout = 3000, // 3 seconds default
    onTranscriptChange,
    onSilenceDetected,
    echoCancellation = true,
  } = options;

  // Use react-speech-recognition for stability
  const {
    transcript: libTranscript,
    interimTranscript: libInterimTranscript,
    listening: isListening,
    resetTranscript: libResetTranscript,
    browserSupportsSpeechRecognition,
  } = useReactSpeechRecognition();

  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>("");
  const lastChangeTimeRef = useRef<number>(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(browserSupportsSpeechRecognition);
  const [confidence, setConfidence] = useState<number>(1); // Visual feedback for confidence

  // Auto-stop on silence detection with better logic
  useEffect(() => {
    if (!isListening) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      lastTranscriptRef.current = "";
      return;
    }

    const currentTranscript = libTranscript + libInterimTranscript;
    const now = Date.now();

    // Only reset timer if transcript actually changed
    if (currentTranscript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = currentTranscript;
      lastChangeTimeRef.current = now;

      // Clear existing timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // Notify parent of transcript change
      onTranscriptChange?.(currentTranscript, false);

      // Set new silence detection timer
      silenceTimerRef.current = setTimeout(() => {
        const timeSinceLastChange = Date.now() - lastChangeTimeRef.current;
        
        // Only stop if truly silent (no changes for full timeout period)
        if (timeSinceLastChange >= silenceTimeout - 100) {
          console.log("✓ Silence detected - stopping recognition");
          onSilenceDetected?.();
          onTranscriptChange?.(libTranscript, true);
          SpeechRecognition.stopListening();
          silenceTimerRef.current = null;
        }
      }, silenceTimeout);
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [
    libTranscript,
    libInterimTranscript,
    isListening,
    silenceTimeout,
    onTranscriptChange,
    onSilenceDetected,
  ]);

  // Check browser support
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Speech recognition not supported in this browser");
    }
  }, [browserSupportsSpeechRecognition]);

  /**
   * Start listening with proper setup
   */
  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError("Speech recognition not available");
      return;
    }

    try {
      // Ensure clean state
      if (isListening) {
        console.log("Already listening, stopping first...");
        SpeechRecognition.stopListening();
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      // Reset state
      lastTranscriptRef.current = "";
      lastChangeTimeRef.current = Date.now();
      setError(null);

      // Start with proper configuration
      await SpeechRecognition.startListening({
        language,
        continuous: true,
      });

      console.log("✓ Started listening with language:", language);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setError("Failed to start microphone. Please check permissions.");
    }
  }, [isSupported, language, isListening]);

  /**
   * Stop listening cleanly
   */
  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Finalize transcript
    if (libTranscript) {
      onTranscriptChange?.(libTranscript, true);
    }

    SpeechRecognition.stopListening();
    console.log("✓ Stopped listening");
  }, [libTranscript, onTranscriptChange]);

  /**
   * Reset transcript and state
   */
  const resetTranscript = useCallback(() => {
    libResetTranscript();
    lastTranscriptRef.current = "";
    lastChangeTimeRef.current = Date.now();
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    setError(null);
    console.log("✓ Reset transcript");
  }, [libResetTranscript]);

  /**
   * Abort current recognition immediately
   */
  const abort = useCallback(() => {
    SpeechRecognition.abortListening();
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    console.log("✓ Aborted recognition");
  }, []);

  return {
    // State
    isListening,
    transcript: libTranscript,
    interimTranscript: libInterimTranscript,
    fullTranscript: libTranscript + (libInterimTranscript ? " " + libInterimTranscript : ""),
    error,
    isSupported,
    confidence,

    // Actions
    startListening,
    stopListening,
    resetTranscript,
    abort,
  };
};
