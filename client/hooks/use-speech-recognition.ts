import { useEffect, useRef, useState, useCallback } from "react";

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  isFinal: boolean;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
  item: (index: number) => SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  length: number;
  [index: number]: SpeechRecognitionAlternative;
  isFinal: boolean;
  item: (index: number) => SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

declare global {
  interface Window {
    webkitSpeechRecognition?: any;
    SpeechRecognition?: any;
  }
}

export interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  silenceTimeout?: number;
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {},
) => {
  const {
    language = "en-US",
    continuous = false,
    interimResults = true,
    maxAlternatives = 1,
    silenceTimeout = 3000,
  } = options;

  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Initialize speech recognition
  useEffect(() => {
    try {
      const SpeechRecognitionAPI =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (!SpeechRecognitionAPI) {
        setIsSupported(false);
        return;
      }

      recognitionRef.current = new SpeechRecognitionAPI();
      const recognition = recognitionRef.current;

      recognition.continuous = continuous;
      recognition.interimResults = interimResults;
      recognition.maxAlternatives = maxAlternatives;
      recognition.lang = language;

      // Handle results
      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        let final = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;

          if (event.results[i].isFinal) {
            final += transcript + " ";
          } else {
            interim += transcript;
          }
        }

        if (final) {
          setTranscript((prev) => prev + final);
          setInterimTranscript("");
          // Reset silence timer when final result comes in
          resetSilenceTimer();
        } else if (interim) {
          setInterimTranscript(interim);
        }
      };

      recognition.onerror = (event: any) => {
        const errorType = event.error || "unknown";
        
        // Handle common non-critical errors silently
        if (errorType === "no-speech") {
          // User didn't speak - this is expected, just stop listening
          console.log("No speech detected - stopping recognition");
          setIsListening(false);
          return;
        }
        
        if (errorType === "aborted") {
          // Recognition was aborted programmatically - expected behavior
          console.log("Speech recognition aborted");
          return;
        }
        
        // Log actual errors
        console.error("Speech recognition error:", errorType);
        setError(errorType);
      };

      recognition.onend = () => {
        setIsListening(false);
        if (silenceTimerRef.current) {
          clearTimeout(silenceTimerRef.current);
        }
      };
    } catch (err) {
      console.error("Failed to initialize speech recognition:", err);
      setIsSupported(false);
    }
  }, [continuous, interimResults, maxAlternatives, language]);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }

    silenceTimerRef.current = setTimeout(() => {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }, silenceTimeout);
  }, [silenceTimeout, isListening]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      setError("Speech recognition is not supported");
      return;
    }

    // Already listening - don't start again
    if (isListening) {
      console.log("Speech recognition already active, skipping start");
      return;
    }

    try {
      // Stop any existing recognition first
      try {
        recognitionRef.current.abort();
      } catch (e) {
        // Ignore abort errors
      }

      setError(null);
      setTranscript("");
      setInterimTranscript("");
      setIsListening(true);
      recognitionRef.current.start();
      resetSilenceTimer();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start listening";
      
      // Check if it's the "already started" error - handle gracefully
      if (message.includes("already started")) {
        console.log("Recognition already started, continuing...");
        setIsListening(true);
        return;
      }
      
      setError(message);
      setIsListening(false);
    }
  }, [isSupported, isListening, resetSilenceTimer]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      if (isListening) {
        recognitionRef.current.stop();
      }
    } catch (err) {
      // Ignore stop errors - recognition might not be active
      console.log("Stop listening (may already be stopped)");
    }
    
    setIsListening(false);

    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    };
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
