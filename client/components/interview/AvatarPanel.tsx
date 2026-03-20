import { FC, ReactNode, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Mic, Volume2, Brain } from "lucide-react";

export type AvatarState = "idle" | "speaking" | "listening" | "thinking";

interface AvatarPanelProps {
  state: AvatarState;
  avatarName?: string;
  avatarTitle?: string;
  isSpeaking?: boolean; // Controls video playback - true when TTS is active
  videoSrc?: string; // Video URL (defaults to /avatar.mp4)
  children?: ReactNode;
}

const AvatarPanel: FC<AvatarPanelProps> = ({
  state,
  avatarName = "Priya Sharma",
  avatarTitle = "Senior Interview Coach",
  isSpeaking = false,
  videoSrc = "/HR_Video_Generation_Request.mp4",
  children,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Control video playback based on isSpeaking prop
  useEffect(() => {
    if (!videoRef.current) return;

    if (isSpeaking) {
      // Play video when interviewer is speaking
      videoRef.current.play().catch(err => {
        console.warn("Video autoplay failed:", err);
      });
    } else {
      // Pause video when not speaking
      videoRef.current.pause();
    }
  }, [isSpeaking]);

  const getStateLabel = (): string => {
    switch (state) {
      case "speaking":
        return "Speaking...";
      case "listening":
        return "Listening to your response...";
      case "thinking":
        return "Processing your answer...";
      default:
        return "Ready";
    }
  };

  const getStateColor = (): string => {
    switch (state) {
      case "speaking":
        return "from-primary/25 to-secondary/25";
      case "listening":
        return "from-accent/20 to-primary/20";
      case "thinking":
        return "from-muted/40 to-muted/60";
      default:
        return "from-card to-card/50";
    }
  };

  const getStateIcon = (): ReactNode => {
    switch (state) {
      case "speaking":
        return <Volume2 className="w-5 h-5 text-primary" />;
      case "listening":
        return <Mic className="w-5 h-5 text-accent" />;
      case "thinking":
        return <Brain className="w-5 h-5 text-primary/60" />;
      default:
        return null;
    }
  };

  return (
    <Card
      className={`bg-gradient-to-br ${getStateColor()} border-border/40 overflow-hidden transition-all duration-400 shadow-lg ${
        state !== "idle" ? "shadow-primary/20" : "shadow-sm"
      }`}
    >
      {/* Avatar Container - video fills the box */}
      <div className="w-full h-56 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
        {/* Video element - always visible, plays when speaking, paused otherwise */}
        <video
          ref={videoRef}
          src={videoSrc}
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
        />

        {/* State indicators with animations */}
        {state === "listening" && (
          <div className="absolute bottom-4 right-4 flex gap-2 z-10 animate-listening-pulse">
            <div className="w-3 h-3 rounded-full bg-accent border-2 border-accent/50" />
          </div>
        )}

        {state === "thinking" && (
          <div className="absolute bottom-4 right-4 flex gap-1 z-10">
            <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
            <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100" />
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200" />
          </div>
        )}

        {/* Status badge */}
        <div className={`absolute top-4 right-4 px-3 py-1.5 border rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
          state === "idle"
            ? "bg-green-500/20 border-green-500/30 text-green-700 dark:text-green-400"
            : state === "speaking"
              ? "bg-primary/20 border-primary/40 text-primary"
              : state === "listening"
                ? "bg-accent/20 border-accent/40 text-accent"
                : "bg-muted/40 border-muted/60 text-muted-foreground"
        }`}>
          {getStateIcon()}
          <span>{state === "idle" ? "Ready" : getStateLabel()}</span>
        </div>
      </div>

      {/* Avatar Info Section */}
      <div className="p-4 bg-gradient-to-r from-background/80 to-background/60 backdrop-blur-sm border-t border-border/40 space-y-2">
        <div>
          <h3 className="font-semibold text-foreground text-sm">{avatarName}</h3>
          <p className="text-xs text-muted-foreground">{avatarTitle}</p>
        </div>
        
        {/* Status message */}
        <div className={`text-xs font-medium transition-colors duration-300 ${
          state === "speaking"
            ? "text-primary"
            : state === "listening"
              ? "text-accent"
              : state === "thinking"
                ? "text-muted-foreground"
                : "text-green-600 dark:text-green-400"
        }`}>
          {getStateLabel()}
        </div>
      </div>

      {children}
    </Card>
  );
};

export default AvatarPanel;
