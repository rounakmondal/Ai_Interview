import { useEffect, useRef, useCallback, useState } from "react";
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from "react-speech-recognition";

export interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  silenceTimeout?: number; // Time in ms after last speech to auto-stop (default: 2500)
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {},
) => {
  const {
    language = "en-US",
    continuous = true,
    silenceTimeout = 2500,
  } = options;

  // Use react-speech-recognition library (more stable)
  const {
    transcript: libTranscript,
    interimTranscript: libInterimTranscript,
    listening: isListening,
    resetTranscript: libResetTranscript,
    browserSupportsSpeechRecognition,
  } = useReactSpeechRecognition();

  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(browserSupportsSpeechRecognition);

  // Auto-stop on silence detection
  useEffect(() => {
    if (!isListening) {
      // Clear timer when not listening
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      lastTranscriptRef.current = "";
      return;
    }

    // Detect when transcript changes (user is speaking)
    const currentTranscript = libTranscript + libInterimTranscript;
    
    if (currentTranscript !== lastTranscriptRef.current) {
      lastTranscriptRef.current = currentTranscript;
      
      // Clear existing timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      // Set new timer for silence detection
      silenceTimerRef.current = setTimeout(() => {
        console.log("Silence detected after", silenceTimeout, "ms - stopping recognition");
        SpeechRecognition.stopListening();
        silenceTimerRef.current = null;
      }, silenceTimeout);
    }

    return () => {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
    };
  }, [libTranscript, libInterimTranscript, isListening, silenceTimeout]);

  // Check browser support
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Speech recognition not supported in this browser");
    }
  }, [browserSupportsSpeechRecognition]);

  const startListening = useCallback(async () => {
    if (!isSupported) {
      setError("Speech recognition not available");
      return;
    }

    try {
      // Stop first if already listening to ensure clean restart
      if (isListening) {
        SpeechRecognition.stopListening();
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      // Start with specified language
      await SpeechRecognition.startListening({ 
        language,
        continuous: true 
      });
      
      setError(null);
      console.log("Started listening with language:", language);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setError("Failed to start microphone. Please check permissions.");
    }
  }, [isSupported, language, isListening]);

  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    SpeechRecognition.stopListening();
    console.log("Stopped listening");
  }, []);

  const resetTranscript = useCallback(() => {
    libResetTranscript();
    lastTranscriptRef.current = "";
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }
    setError(null);
  }, [libResetTranscript]);

  return {
    isListening,
    transcript: libTranscript,
    interimTranscript: libInterimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
