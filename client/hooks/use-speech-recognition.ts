import { useEffect, useRef, useCallback, useState, useMemo } from "react";

export interface UseSpeechRecognitionOptions {
  language?: string;
  continuous?: boolean;
  silenceTimeout?: number; // Time in ms after last speech to auto-stop (default: 2000)
}

// Speech Recognition types
interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface ISpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onstart: ((event: Event) => void) | null;
  onend: ((event: Event) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  start: () => void;
  stop: () => void;
  abort: () => void;
}

// Extend Window for SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: new () => ISpeechRecognition;
    webkitSpeechRecognition: new () => ISpeechRecognition;
  }
}

export const useSpeechRecognition = (
  options: UseSpeechRecognitionOptions = {},
) => {
  const {
    language = "en-US",
    continuous = true,
    silenceTimeout = 2000,
  } = options;

  const recognitionRef = useRef<ISpeechRecognition | null>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const accumulatedTranscriptRef = useRef<string>(""); // Accumulated across recognition sessions
  const currentSessionFinalRef = useRef<string>(""); // Final transcript from current session only
  const interimTranscriptRef = useRef<string>("");
  const shouldBeListeningRef = useRef<boolean>(false);
  const rafRef = useRef<number | null>(null);
  const lastUpdateRef = useRef<number>(0);
  
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  // Throttled state update - only update UI every 50ms max for smooth performance
  const scheduleUpdate = useCallback(() => {
    if (rafRef.current) return;
    
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      // Combine accumulated + current session final
      const fullFinal = accumulatedTranscriptRef.current + 
        (accumulatedTranscriptRef.current && currentSessionFinalRef.current ? " " : "") + 
        currentSessionFinalRef.current;
      setTranscript(fullFinal.trim());
      setInterimTranscript(interimTranscriptRef.current);
      lastUpdateRef.current = Date.now();
    });
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognitionAPI =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionAPI) {
      setIsSupported(false);
      setError("Speech recognition not supported in this browser");
      return;
    }

    const recognition = new SpeechRecognitionAPI();
    recognition.continuous = continuous;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1; // Only need best result for performance
    recognition.lang = language;

    recognition.onresult = (event) => {
      let finalFromEvent = "";
      let interim = "";

      // Process results efficiently
      for (let i = 0; i < event.results.length; i++) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalFromEvent += text + " ";
        } else {
          interim += text;
        }
      }

      // Update refs immediately (no re-render)
      currentSessionFinalRef.current = finalFromEvent.trim();
      interimTranscriptRef.current = interim;
      
      // Schedule throttled UI update
      scheduleUpdate();

      // Reset silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      
      if (interim || finalFromEvent) {
        silenceTimerRef.current = setTimeout(() => {
          console.log("Silence detected, stopping...");
          shouldBeListeningRef.current = false;
          recognition.stop();
        }, silenceTimeout);
      }
    };

    recognition.onstart = () => {
      console.log("Speech recognition started");
      setIsListening(true);
      setError(null);
    };

    recognition.onend = () => {
      console.log("Speech recognition ended");
      setIsListening(false);
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // Accumulate current session's final transcript before restarting
      if (currentSessionFinalRef.current) {
        const separator = accumulatedTranscriptRef.current ? " " : "";
        accumulatedTranscriptRef.current += separator + currentSessionFinalRef.current;
        currentSessionFinalRef.current = "";
        // Immediately update state with accumulated transcript
        scheduleUpdate();
      }

      // Auto-restart if we should still be listening (handles browser auto-stops)
      if (shouldBeListeningRef.current) {
        console.log("Auto-restarting speech recognition...");
        setTimeout(() => {
          try {
            recognition.start();
          } catch (err) {
            console.error("Failed to auto-restart:", err);
            shouldBeListeningRef.current = false;
          }
        }, 100);
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      
      // Don't treat these as fatal errors
      if (event.error === "aborted" || event.error === "no-speech") {
        return;
      }
      
      // Handle network errors gracefully - try to restart
      if (event.error === "network") {
        console.log("Network error, will try to restart...");
        return;
      }
      
      setError(`Speech error: ${event.error}`);
      shouldBeListeningRef.current = false;
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      shouldBeListeningRef.current = false;
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      recognition.abort();
    };
  }, [language, continuous, silenceTimeout, scheduleUpdate]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current || !isSupported) {
      console.error("Speech recognition not available");
      return;
    }

    if (isListening) {
      console.log("Already listening");
      return;
    }

    try {
      // Reset transcript for new session
      accumulatedTranscriptRef.current = "";
      currentSessionFinalRef.current = "";
      interimTranscriptRef.current = "";
      setTranscript("");
      setInterimTranscript("");
      setError(null);
      shouldBeListeningRef.current = true;
      
      console.log("Starting speech recognition...");
      recognitionRef.current.start();
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setError("Failed to start speech recognition");
      shouldBeListeningRef.current = false;
    }
  }, [isSupported, isListening]);

  const stopListening = useCallback(() => {
    if (!recognitionRef.current) return;

    console.log("Stopping speech recognition...");
    shouldBeListeningRef.current = false; // Prevent auto-restart
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    
    // Flush final state immediately - combine accumulated and current session
    const fullFinal = accumulatedTranscriptRef.current + 
      (accumulatedTranscriptRef.current && currentSessionFinalRef.current ? " " : "") + 
      currentSessionFinalRef.current;
    setTranscript(fullFinal.trim());
    setInterimTranscript(interimTranscriptRef.current);

    try {
      recognitionRef.current.stop();
    } catch (err) {
      console.error("Error stopping recognition:", err);
    }
  }, []);

  const resetTranscript = useCallback(() => {
    accumulatedTranscriptRef.current = "";
    currentSessionFinalRef.current = "";
    interimTranscriptRef.current = "";
    setTranscript("");
    setInterimTranscript("");
  }, []);

  // Combined transcript for display (final + interim)
  const fullTranscript = useMemo(() => {
    const final = transcript.trim();
    const interim = interimTranscript.trim();
    if (final && interim) return `${final} ${interim}`;
    return final || interim;
  }, [transcript, interimTranscript]);

  return {
    isListening,
    transcript,
    interimTranscript,
    fullTranscript,
    error,
    isSupported,
    startListening,
    stopListening,
    resetTranscript,
  };
};
