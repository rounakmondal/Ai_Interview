import { useEffect, useRef, useCallback, useState } from "react";
import SpeechRecognition, { useSpeechRecognition as useReactSpeechRecognition } from "react-speech-recognition";

export interface UseImprovedSpeechOptions {
  language?: string;
  silenceTimeout?: number; // Auto-stop after silence (ms)
  onTranscriptChange?: (transcript: string, isFinal: boolean) => void;
  onSilenceDetected?: () => void;
  echoCancellation?: boolean; // Enable echo cancellation
  minSpeechLength?: number; // Minimum characters before submitting
  noiseThreshold?: number; // Audio level threshold for noise
}

/**
 * Substantially improved speech recognition with ultra-smooth UX
 * Features: better interim updates, adaptive silence detection, confidence tracking, audio level monitoring
 */
export const useImprovedSpeech = (options: UseImprovedSpeechOptions = {}) => {
  const {
    language = "en-US",
    silenceTimeout = 2500, // Reduced from 3s for faster recognition
    onTranscriptChange,
    onSilenceDetected,
    echoCancellation = true,
    minSpeechLength = 3, // At least 3 characters before recognizing as speech
    noiseThreshold = 0.1,
  } = options;

  // Use react-speech-recognition for stability
  const {
    transcript: libTranscript,
    interimTranscript: libInterimTranscript,
    listening: isListening,
    resetTranscript: libResetTranscript,
    browserSupportsSpeechRecognition,
  } = useReactSpeechRecognition();

  // Advanced state management for smooth audio
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastTranscriptRef = useRef<string>("");
  const lastChangeTimeRef = useRef<number>(Date.now());
  const consecutiveSilenceCountRef = useRef<number>(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  
  const [error, setError] = useState<string | null>(null);
  const [isSupported] = useState(browserSupportsSpeechRecognition);
  const [confidence, setConfidence] = useState<number>(1);
  const [audioLevel, setAudioLevel] = useState<number>(0); // Real-time audio level 0-1
  const [isSpeechDetected, setIsSpeechDetected] = useState<boolean>(false);

  // Smooth interim transcript updates with debouncing
  const interimUpdateTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [smoothInterimTranscript, setSmoothInterimTranscript] = useState<string>("");

  // Debounced interim transcript updates for smoother visual feedback
  useEffect(() => {
    if (interimUpdateTimeoutRef.current) {
      clearTimeout(interimUpdateTimeoutRef.current);
    }

    if (libInterimTranscript) {
      setSmoothInterimTranscript(libInterimTranscript);
    } else {
      interimUpdateTimeoutRef.current = setTimeout(() => {
        setSmoothInterimTranscript("");
      }, 200); // 200ms delay to avoid flickering
    }

    return () => {
      if (interimUpdateTimeoutRef.current) {
        clearTimeout(interimUpdateTimeoutRef.current);
      }
    };
  }, [libInterimTranscript]);

  // Monitor audio levels in real-time for visual feedback
  const monitorAudioLevel = useCallback(() => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const average = sum / dataArray.length;
    const normalizedLevel = Math.min(average / 255, 1);

    setAudioLevel(normalizedLevel);

    // Detect if there's actual speech (above noise threshold)
    if (normalizedLevel > noiseThreshold) {
      setIsSpeechDetected(true);
      consecutiveSilenceCountRef.current = 0;
    } else {
      consecutiveSilenceCountRef.current++;
    }

    animationFrameRef.current = requestAnimationFrame(monitorAudioLevel);
  }, [noiseThreshold]);

  // Setup audio level monitoring
  useEffect(() => {
    if (!isListening) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      return;
    }

    // Try to get microphone stream for audio level monitoring
    const setupAudioMonitoring = async () => {
      try {
        if (!micStreamRef.current) {
          const stream = await navigator.mediaDevices.getUserMedia({
            audio: {
              echoCancellation: echoCancellation,
              noiseSuppression: true,
              autoGainControl: false, // Disable to get accurate levels
            },
          });
          micStreamRef.current = stream;
        }

        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext();
        }

        const audioContext = audioContextRef.current;
        const source = audioContext.createMediaStreamSource(micStreamRef.current);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        source.connect(analyser);
        analyserRef.current = analyser;

        monitorAudioLevel();
      } catch (err) {
        console.warn("Could not setup audio monitoring:", err);
      }
    };

    setupAudioMonitoring();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    };
  }, [isListening, monitorAudioLevel, echoCancellation]);

  // Cleanup audio resources
  useEffect(() => {
    return () => {
      if (micStreamRef.current) {
        micStreamRef.current.getTracks().forEach(track => track.stop());
      }
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close();
      }
    };
  }, []);

  // Adaptive silence detection with improved algorithm
  useEffect(() => {
    if (!isListening) {
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
        silenceTimerRef.current = null;
      }
      lastTranscriptRef.current = "";
      consecutiveSilenceCountRef.current = 0;
      setIsSpeechDetected(false);
      return;
    }

    const currentTranscript = libTranscript + smoothInterimTranscript;
    const now = Date.now();
    const hasMinimumSpeech = currentTranscript.trim().length >= minSpeechLength;

    // Check if transcript changed
    if (currentTranscript !== lastTranscriptRef.current && hasMinimumSpeech) {
      lastTranscriptRef.current = currentTranscript;
      lastChangeTimeRef.current = now;
      consecutiveSilenceCountRef.current = 0;

      // Update confidence based on transcript length (longer = more confident)
      const confidenceBoost = Math.min(currentTranscript.trim().length / 50, 1);
      setConfidence(0.7 + confidenceBoost * 0.3);

      // Notify parent of transcript change
      onTranscriptChange?.(currentTranscript, false);

      // Clear existing silence timer
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }

      // Set new adaptive silence timer
      // Shorter timeout = faster submission (better UX)
      const adaptiveTimeout = Math.max(1500, silenceTimeout - 1000); // Min 1.5s
      silenceTimerRef.current = setTimeout(() => {
        const timeSinceLastChange = Date.now() - lastChangeTimeRef.current;

        // Only stop if truly silent for adaptive duration
        if (timeSinceLastChange >= adaptiveTimeout - 100 && isSpeechDetected) {
          console.log("✓ Silence detected after", timeSinceLastChange, "ms");
          consecutiveSilenceCountRef.current = 0;
          setIsSpeechDetected(false);
          onSilenceDetected?.();
          onTranscriptChange?.(libTranscript, true);
          SpeechRecognition.stopListening();
          silenceTimerRef.current = null;
        }
      }, adaptiveTimeout);
    }

    return () => {
      // Cleanup is handled in the outer effect
    };
  }, [
    libTranscript,
    smoothInterimTranscript,
    isListening,
    silenceTimeout,
    onTranscriptChange,
    onSilenceDetected,
    minSpeechLength,
    isSpeechDetected,
  ]);

  // Check browser support
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setError("Speech recognition not supported in this browser");
    }
  }, [browserSupportsSpeechRecognition]);

  /**
   * Start listening with optimized setup for smoothness
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
        await new Promise(resolve => setTimeout(resolve, 100)); // Reduced delay
      }

      // Reset state
      lastTranscriptRef.current = "";
      lastChangeTimeRef.current = Date.now();
      consecutiveSilenceCountRef.current = 0;
      setError(null);
      setConfidence(1);
      setAudioLevel(0);
      setSmoothInterimTranscript("");
      setIsSpeechDetected(false);

      // Start with optimized configuration
      await SpeechRecognition.startListening({
        language,
        continuous: true,
        interimResults: true, // Enable interim results for real-time feedback
      });

      console.log("✓ Started listening with language:", language);
    } catch (err) {
      console.error("Failed to start speech recognition:", err);
      setError("Failed to start microphone. Check permissions.");
    }
  }, [isSupported, language, isListening]);

  /**
   * Stop listening cleanly with smooth finalization
   */
  const stopListening = useCallback(() => {
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    // Finalize transcript smoothly
    if (libTranscript) {
      onTranscriptChange?.(libTranscript, true);
    }

    SpeechRecognition.stopListening();
    setIsSpeechDetected(false);
    console.log("✓ Stopped listening");
  }, [libTranscript, onTranscriptChange]);

  /**
   * Reset transcript and state cleanly
   */
  const resetTranscript = useCallback(() => {
    libResetTranscript();
    lastTranscriptRef.current = "";
    lastChangeTimeRef.current = Date.now();
    consecutiveSilenceCountRef.current = 0;
    setSmoothInterimTranscript("");
    setIsSpeechDetected(false);
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
      silenceTimerRef.current = null;
    }

    if (interimUpdateTimeoutRef.current) {
      clearTimeout(interimUpdateTimeoutRef.current);
      interimUpdateTimeoutRef.current = null;
    }

    setError(null);
    setConfidence(1);
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
    setIsSpeechDetected(false);
    console.log("✓ Aborted recognition");
  }, []);

  return {
    // State
    isListening,
    transcript: libTranscript,
    interimTranscript: smoothInterimTranscript, // Smoothed interim transcript
    fullTranscript: libTranscript + (smoothInterimTranscript ? " " + smoothInterimTranscript : ""),
    error,
    isSupported,
    confidence, // 0-1 confidence score
    audioLevel, // 0-1 real-time audio level
    isSpeechDetected, // True if speech is being detected

    // Actions
    startListening,
    stopListening,
    resetTranscript,
    abort,
  };
};
