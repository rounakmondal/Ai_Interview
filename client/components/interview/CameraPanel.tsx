import { FC, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, AlertCircle } from "lucide-react";

interface CameraPanelProps {
  videoRef: React.RefObject<HTMLVideoElement>;
  isActive: boolean;
  isLoading: boolean;
  error: string | null;
  onStartCamera: () => Promise<void>;
  onStopCamera: () => void;
}

const CameraPanel: FC<CameraPanelProps> = ({
  videoRef,
  isActive,
  isLoading,
  error,
  onStartCamera,
  onStopCamera,
}) => {
  // Auto-play video when active
  useEffect(() => {
    if (videoRef.current && isActive) {
      videoRef.current.play();
    }
  }, [isActive, videoRef]);

  return (
    <Card className="bg-gradient-to-br from-card to-card/50 border-border/40 overflow-hidden space-y-4 p-4">
      {/* Camera video element */}
      <div className="relative w-full aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          muted
          playsInline
          className="w-full h-full object-cover"
        />

        {/* Camera off indicator */}
        {!isActive && (
          <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
            <div className="text-center space-y-3">
              <VideoOff className="w-12 h-12 text-muted-foreground mx-auto" />
              <p className="text-muted-foreground">Camera is off</p>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
                <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100" />
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200" />
              </div>
              <p className="text-sm text-muted-foreground">Initializing camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50 rounded-lg p-3 flex gap-3">
          <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900 dark:text-red-300">
              Camera Error
            </p>
            <p className="text-xs text-red-800 dark:text-red-400 mt-0.5">
              {error}
            </p>
          </div>
        </div>
      )}

      {/* Camera control buttons */}
      <div className="flex gap-2">
        {!isActive ? (
          <Button
            onClick={onStartCamera}
            disabled={isLoading}
            className="flex-1 gradient-primary text-base font-semibold gap-2"
          >
            <Video className="w-5 h-5" />
            Start Camera
          </Button>
        ) : (
          <Button
            onClick={onStopCamera}
            variant="outline"
            className="flex-1 border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 text-base font-semibold gap-2"
          >
            <VideoOff className="w-5 h-5" />
            Stop Camera
          </Button>
        )}
      </div>

      {/* Info text */}
      <p className="text-xs text-muted-foreground text-center">
        {isActive
          ? "Your camera is active. You are visible to the interviewer."
          : "Start your camera to begin the interview."}
      </p>
    </Card>
  );
};

export default CameraPanel;
