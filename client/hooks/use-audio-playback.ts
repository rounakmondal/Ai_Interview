import { useEffect, useRef, useState, useCallback } from "react";

export interface UseAudioPlaybackOptions {
  autoplay?: boolean;
  volume?: number;
}

export const useAudioPlayback = (
  options: UseAudioPlaybackOptions = {}
) => {
  const { autoplay = false, volume = 1 } = options;
  const audioRef = useRef<HTMLAudioElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
    } else {
      setIsSupported(false);
    }
  }, []);

  const playAudio = useCallback((url: string) => {
    try {
      setError(null);
      setIsLoading(true);

      if (!audioRef.current) {
        setIsLoading(false);
        return;
      }

      audioRef.current.src = url;
      audioRef.current.volume = volume;

      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsPlaying(true);
            setIsLoading(false);
          })
          .catch((err) => {
            console.error("Playback failed:", err);
            setError("Failed to play audio");
            setIsLoading(false);
          });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Playback error";
      setError(message);
      setIsLoading(false);
    }
  }, [volume]);

  const playTextToSpeech = useCallback(
    (text: string, language: string = "en-US") => {
      if (!synthRef.current || !isSupported) {
        setError("Text-to-speech not supported");
        return;
      }

      try {
        setError(null);
        
        // Cancel any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 1;
        utterance.pitch = 1;
        utterance.volume = volume;

        utterance.onstart = () => {
          setIsPlaying(true);
        };

        utterance.onend = () => {
          setIsPlaying(false);
        };

        utterance.onerror = (event) => {
          console.error("Speech synthesis error:", event.error);
          setError(`Speech error: ${event.error}`);
          setIsPlaying(false);
        };

        window.speechSynthesis.speak(utterance);
        setIsLoading(false);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Speech synthesis error";
        setError(message);
        setIsLoading(false);
      }
    },
    [isSupported, volume]
  );

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (synthRef.current) {
      window.speechSynthesis.cancel();
    }

    setIsPlaying(false);
  }, []);

  return {
    audioRef,
    isPlaying,
    isLoading,
    error,
    isSupported,
    playAudio,
    playTextToSpeech,
    stopPlayback,
  };
};
