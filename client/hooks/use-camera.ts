import { useEffect, useRef, useState, useCallback } from "react";

export interface UseCameraOptions {
  width?: number;
  height?: number;
  facingMode?: "user" | "environment";
}

export const useCamera = (options: UseCameraOptions = {}) => {
  const { width = 1280, height = 720, facingMode = "user" } = options;
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const startCamera = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Camera is not supported in this browser");
      }

      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: width },
          height: { ideal: height },
          facingMode,
        },
        audio: false, // Audio is handled separately
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        
        // Wait for video to be ready before playing
        try {
          await videoRef.current.play();
        } catch (playErr) {
          // AbortError is expected if play is interrupted - ignore it
          if (playErr instanceof Error && playErr.name !== 'AbortError') {
            console.warn("Video play warning:", playErr);
          }
        }
      }

      setIsActive(true);
      setIsLoading(false);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to start camera";
      setError(message);
      setIsLoading(false);
      console.error("Camera error:", err);
    }
  }, [width, height, facingMode]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsActive(false);
    setError(null);
  }, []);

  const toggleCamera = useCallback(async () => {
    if (isActive) {
      stopCamera();
    } else {
      await startCamera();
    }
  }, [isActive, startCamera, stopCamera]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    videoRef,
    isActive,
    isLoading,
    error,
    startCamera,
    stopCamera,
    toggleCamera,
  };
};
