import { useEffect, useRef, useState, useCallback } from "react";
import {
  generateElevenLabsSpeech,
  blobToAudioUrl,
  revokeAudioUrl,
  isElevenLabsAvailable,
} from "@/lib/elevenlabs-tts";

export interface UseEnhancedAudioOptions {
  volume?: number;
  onStartPlaying?: () => void;
  onStopPlaying?: () => void;
  useElevenLabs?: boolean; // Toggle between ElevenLabs and browser TTS
}

/**
 * Enhanced audio hook with both ElevenLabs and browser TTS support
 * Provides natural, realistic voices for better interview experience
 */
export const useEnhancedAudio = (options: UseEnhancedAudioOptions = {}) => {
  const {
    volume = 0.8, // Default 80% to prevent echo
    onStartPlaying,
    onStopPlaying,
    useElevenLabs = false, // Default to browser TTS (free, fast, offline-friendly)
  } = options;

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const currentUrlRef = useRef<string | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [elevenLabsEnabled, setElevenLabsEnabled] = useState(false);

  // Initialize audio element and context
  useEffect(() => {
    // Create audio element
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    // Create audio context for echo cancellation
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      audioContextRef.current = new AudioContextClass();
    } catch (err) {
      console.warn("AudioContext not available:", err);
    }

    // Check ElevenLabs availability
    setElevenLabsEnabled(isElevenLabsAvailable());

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = "";
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
      if (currentUrlRef.current) {
        revokeAudioUrl(currentUrlRef.current);
      }
    };
  }, [volume]);

  /**
   * Play text-to-speech with natural voice
   */
  const speak = useCallback(
    async (text: string, language: string = "en-US") => {
      if (!text || text.trim().length === 0) {
        console.warn("No text provided for TTS");
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        // Stop any current playback
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }

        // Clean up previous URL
        if (currentUrlRef.current) {
          revokeAudioUrl(currentUrlRef.current);
          currentUrlRef.current = null;
        }

        let audioUrl: string;

        // Try ElevenLabs first if enabled and available
        if (useElevenLabs && elevenLabsEnabled) {
          try {
            console.log("Using ElevenLabs TTS for natural voice...");
            const audioBlob = await generateElevenLabsSpeech({
              text,
              language,
            });
            audioUrl = blobToAudioUrl(audioBlob);
            currentUrlRef.current = audioUrl;
          } catch (err) {
            console.warn("ElevenLabs failed, falling back to browser TTS:", err);
            // Fall back to browser TTS
            await playBrowserTTS(text, language);
            return;
          }
        } else {
          // Use browser TTS
          await playBrowserTTS(text, language);
          return;
        }

        // Play the audio
        if (audioRef.current && audioUrl) {
          audioRef.current.src = audioUrl;

          audioRef.current.onplay = () => {
            setIsPlaying(true);
            setIsLoading(false);
            onStartPlaying?.();
            console.log("Audio started playing");
          };

          audioRef.current.onended = () => {
            setIsPlaying(false);
            onStopPlaying?.();
            console.log("Audio finished playing");
            
            // Cleanup URL
            if (currentUrlRef.current) {
              revokeAudioUrl(currentUrlRef.current);
              currentUrlRef.current = null;
            }
          };

          audioRef.current.onerror = (e) => {
            console.error("Audio playback error:", e);
            setError("Failed to play audio");
            setIsPlaying(false);
            setIsLoading(false);
            onStopPlaying?.();
          };

          await audioRef.current.play();
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Speech generation failed";
        console.error("TTS error:", err);
        setError(message);
        setIsLoading(false);
        setIsPlaying(false);
      }
    },
    [useElevenLabs, elevenLabsEnabled, onStartPlaying, onStopPlaying]
  );

  /**
   * Fallback to browser TTS
   */
  const playBrowserTTS = useCallback(
    (text: string, language: string) => {
      return new Promise<void>((resolve, reject) => {
        try {
          // Cancel any ongoing speech
          window.speechSynthesis.cancel();

          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language;
          utterance.rate = 0.95;
          utterance.pitch = 1;
          utterance.volume = volume;

          // Try to find a good voice
          const voices = window.speechSynthesis.getVoices();
          const voice = voices.find((v) =>
            v.lang.startsWith(language.split("-")[0])
          ) || voices[0];

          if (voice) utterance.voice = voice;

          utterance.onstart = () => {
            setIsPlaying(true);
            setIsLoading(false);
            onStartPlaying?.();
          };

          utterance.onend = () => {
            setIsPlaying(false);
            onStopPlaying?.();
            resolve();
          };

          utterance.onerror = (e) => {
            setError("Speech synthesis error");
            setIsPlaying(false);
            setIsLoading(false);
            reject(e);
          };

          window.speechSynthesis.speak(utterance);
        } catch (err) {
          reject(err);
        }
      });
    },
    [volume, onStartPlaying, onStopPlaying]
  );

  /**
   * Stop current playback immediately
   */
  const stop = useCallback(() => {
    // Stop audio element
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    // Stop browser TTS
    window.speechSynthesis.cancel();

    // Update state
    setIsPlaying(false);
    setIsLoading(false);

    // Cleanup URL
    if (currentUrlRef.current) {
      revokeAudioUrl(currentUrlRef.current);
      currentUrlRef.current = null;
    }

    onStopPlaying?.();
    console.log("Audio stopped");
  }, [onStopPlaying]);

  /**
   * Pause playback (can be resumed)
   */
  const pause = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    window.speechSynthesis.pause();
    setIsPlaying(false);
  }, []);

  /**
   * Resume paused playback
   */
  const resume = useCallback(() => {
    if (audioRef.current && !audioRef.current.ended) {
      audioRef.current.play();
      setIsPlaying(true);
    }
    window.speechSynthesis.resume();
  }, []);

  return {
    speak,
    stop,
    pause,
    resume,
    isPlaying,
    isLoading,
    error,
    elevenLabsEnabled,
  };
};
