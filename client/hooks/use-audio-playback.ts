import { useEffect, useRef, useState, useCallback } from "react";

export interface UseAudioPlaybackOptions {
  autoplay?: boolean;
  volume?: number;
}

export const useAudioPlayback = (options: UseAudioPlaybackOptions = {}) => {
  const { autoplay = false, volume = 1 } = options;
  const audioRef = useRef<HTMLAudioElement>(null);
  const synthRef = useRef<SpeechSynthesis | null>(null);
  const keepAliveRef = useRef<NodeJS.Timeout | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(true);
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  useEffect(() => {
    if ("speechSynthesis" in window) {
      synthRef.current = window.speechSynthesis;
      
      // Load voices - they may not be available immediately
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
        }
      };
      
      loadVoices();
      
      // Chrome requires this event listener for voices
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
    } else {
      setIsSupported(false);
    }
    
    // Cleanup keep-alive interval on unmount
    return () => {
      if (keepAliveRef.current) {
        clearInterval(keepAliveRef.current);
        keepAliveRef.current = null;
      }
    };
  }, []);

  // Warm up TTS - call this from user interaction context to unlock audio
  const warmUp = useCallback(() => {
    if (!synthRef.current || !isSupported) {
      console.log("TTS warmUp: not supported or synth not ready");
      return;
    }
    
    try {
      // Cancel any pending speech
      window.speechSynthesis.cancel();
      
      // Load voices first
      const voices = window.speechSynthesis.getVoices();
      console.log("TTS warmUp: found", voices.length, "voices");
      
      // Speak a brief silent utterance to unlock TTS on first user interaction
      const utterance = new SpeechSynthesisUtterance(".");
      utterance.volume = 0.01; // Almost silent but present
      utterance.rate = 2; // Fast to complete quickly
      window.speechSynthesis.speak(utterance);
      
      console.log("TTS warmed up (audio unlocked)");
    } catch (err) {
      console.warn("Failed to warm up TTS:", err);
    }
  }, [isSupported]);

  const playAudio = useCallback(
    (url: string) => {
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
    },
    [volume],
  );

  const playTextToSpeech = useCallback(
    (text: string, language: string = "en-US") => {
      console.log("playTextToSpeech called with:", text?.substring(0, 50), "language:", language);
      
      if (!synthRef.current || !isSupported) {
        console.error("TTS not supported - synthRef:", !!synthRef.current, "isSupported:", isSupported);
        setError("Text-to-speech not supported");
        return;
      }

      if (!text || text.trim().length === 0) {
        console.warn("No text provided for TTS");
        return;
      }

      try {
        setError(null);
        setIsLoading(true);

        // Cancel any ongoing speech first
        window.speechSynthesis.cancel();
        console.log("Cancelled previous speech, pending:", window.speechSynthesis.pending, "speaking:", window.speechSynthesis.speaking);

        const speak = () => {
          // Create utterance
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = language;
          utterance.rate = 0.95; // Slightly slower for clarity
          utterance.pitch = 1;
          utterance.volume = 1; // Max volume
          
          // Try to find a voice for the language
          const voices = window.speechSynthesis.getVoices();
          console.log("Available voices:", voices.length);
          
          // Prefer natural/enhanced voices
          let voice = voices.find(v => 
            v.lang.startsWith(language.split('-')[0]) && 
            (v.name.includes('Natural') || v.name.includes('Enhanced') || v.name.includes('Google'))
          );
          
          // Fallback to any voice matching the language
          if (!voice) {
            voice = voices.find(v => v.lang.startsWith(language.split('-')[0]));
          }
          
          // Final fallback to first available voice
          if (!voice && voices.length > 0) {
            voice = voices[0];
          }
          
          if (voice) {
            utterance.voice = voice;
            console.log("Using voice:", voice.name, voice.lang);
          } else {
            console.warn("No voice found, using default");
          }

          utterance.onstart = () => {
            console.log("TTS started speaking:", text.substring(0, 50) + "...");
            setIsPlaying(true);
            setIsLoading(false);
            
            // Chrome bug workaround: Keep-alive to prevent pausing after ~15 seconds
            if (keepAliveRef.current) {
              clearInterval(keepAliveRef.current);
            }
            keepAliveRef.current = setInterval(() => {
              if (window.speechSynthesis.speaking && window.speechSynthesis.paused) {
                console.log("Resuming paused speech (Chrome workaround)");
                window.speechSynthesis.resume();
              }
            }, 5000);
          };

          utterance.onend = () => {
            console.log("TTS finished speaking");
            setIsPlaying(false);
            setIsLoading(false);
            
            // Clear keep-alive interval
            if (keepAliveRef.current) {
              clearInterval(keepAliveRef.current);
              keepAliveRef.current = null;
            }
          };

          utterance.onpause = () => {
            setIsPlaying(false);
          };

          utterance.onresume = () => {
            setIsPlaying(true);
          };

          utterance.onerror = (event) => {
            // "interrupted" and "canceled" errors are expected when we cancel speech
            if (event.error !== "interrupted" && event.error !== "canceled") {
              console.error("Speech synthesis error:", event.error);
              setError(`Speech error: ${event.error}`);
            } else {
              console.log("Speech synthesis was interrupted/canceled (expected)");
            }
            setIsPlaying(false);
            setIsLoading(false);
            
            // Clear keep-alive interval on error
            if (keepAliveRef.current) {
              clearInterval(keepAliveRef.current);
              keepAliveRef.current = null;
            }
          };

          // Small delay to ensure browser is ready, then speak
          setTimeout(() => {
            console.log("Calling speechSynthesis.speak() - pending:", window.speechSynthesis.pending, "speaking:", window.speechSynthesis.speaking);
            window.speechSynthesis.speak(utterance);
            console.log("speak() called - pending:", window.speechSynthesis.pending, "speaking:", window.speechSynthesis.speaking);
            
            // Chrome bug workaround: resume if paused
            if (window.speechSynthesis.paused) {
              console.log("Speech was paused, resuming...");
              window.speechSynthesis.resume();
            }
          }, 100);
        };

        // Force load voices if not loaded yet
        const voices = window.speechSynthesis.getVoices();
        console.log("Initial voice check, count:", voices.length);
        
        if (voices.length > 0) {
          speak();
        } else {
          console.log("Waiting for voices to load...");
          // Wait for voices to load, then speak
          let attempts = 0;
          const maxAttempts = 30; // 3 seconds max
          
          const checkVoices = setInterval(() => {
            attempts++;
            const loadedVoices = window.speechSynthesis.getVoices();
            
            if (loadedVoices.length > 0) {
              console.log("Voices loaded after", attempts * 100, "ms");
              clearInterval(checkVoices);
              speak();
            } else if (attempts >= maxAttempts) {
              console.warn("Voice loading timeout - attempting to speak anyway");
              clearInterval(checkVoices);
              speak();
            }
          }, 100);
        }
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Speech synthesis error";
        console.error("Failed to play text-to-speech:", err);
        setError(message);
        setIsLoading(false);
      }
    },
    [isSupported, volume],
  );

  const stopPlayback = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }

    if (synthRef.current) {
      window.speechSynthesis.cancel();
    }
    
    // Clear keep-alive interval
    if (keepAliveRef.current) {
      clearInterval(keepAliveRef.current);
      keepAliveRef.current = null;
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
    warmUp,
  };
};
