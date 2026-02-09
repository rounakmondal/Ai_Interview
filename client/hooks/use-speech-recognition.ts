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
  options: UseSpeechRecognitionOptions = {}
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
        const errorMessage = event.error || "Speech recognition error";
        console.error("Speech recognition error:", errorMessage);
        setError(errorMessage);
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

    try {
      setError(null);
      setTranscript("");
      setInterimTranscript("");
      setIsListening(true);
      recognitionRef.current.start();
      resetSilenceTimer();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to start listening";
      setError(message);
      setIsListening(false);
    }
  }, [isSupported, resetSilenceTimer]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    try {
      recognitionRef.current.stop();
      setIsListening(false);

      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    } catch (err) {
      console.error("Failed to stop listening:", err);
    }
  }, []);

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
