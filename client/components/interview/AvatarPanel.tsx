import { FC, ReactNode } from "react";
import { Card } from "@/components/ui/card";

export type AvatarState = "idle" | "speaking" | "listening" | "thinking";

interface AvatarPanelProps {
  state: AvatarState;
  avatarName?: string;
  avatarTitle?: string;
  children?: ReactNode;
}

const AvatarPanel: FC<AvatarPanelProps> = ({
  state,
  avatarName = "Priya Sharma",
  avatarTitle = "Senior Interview Coach",
  children,
}) => {
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
        return "from-primary/20 to-secondary/20";
      case "listening":
        return "from-accent/20 to-primary/20";
      case "thinking":
        return "from-muted to-muted/50";
      default:
        return "from-card to-card/50";
    }
  };

  return (
    <Card
      className={`bg-gradient-to-br ${getStateColor()} border-border/40 overflow-hidden transition-all duration-300`}
    >
      {/* Avatar Container - image fills the box */}
      <div className="w-full h-56 bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
        {/* Local Gemini-generated avatar image with lip-sync overlay */}
        <div className="relative flex items-center justify-center">
          {/* Compute avatar src (local PNG) with fallback to public path; onError falls back to DiceBear */}
          <img
            src="/Gemini_Generated_Image_9cu79a9cu79a9cu7.png"
            alt={avatarName}
            className="w-full h-full object-cover shadow-lg bg-white"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).onerror = null;
              (e.currentTarget as HTMLImageElement).src = `https://api.dicebear.com/8.x/avataaars/svg?seed=${encodeURIComponent(
                avatarName,
              )}&size=512`;
            }}
          />

          {/* Lip-sync styling (only animate when speaking) */}
          <style>{`
            @keyframes lipsync {
              0% { transform: scaleY(0.6); }
              50% { transform: scaleY(1.05); }
              100% { transform: scaleY(0.7); }
            }
            .lipsync-anim { animation: lipsync 360ms infinite ease-in-out; transform-origin: center; }
          `}</style>

          {/* Mouth overlay - visible and animated only when speaking */}
          {state === "speaking" && (
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2">
              <div className="w-24 h-3 bg-red-600 rounded-full lipsync-anim" style={{ opacity: 0.95 }} />
            </div>
          )}

          {/* State indicators (compact) */}
          {state === "listening" && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-accent animate-ping" />
            </div>
          )}

          {state === "thinking" && (
            <div className="absolute bottom-4 right-4 flex gap-1">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <div className="w-2 h-2 bg-secondary rounded-full animate-pulse delay-100" />
              <div className="w-2 h-2 bg-accent rounded-full animate-pulse delay-200" />
            </div>
          )}
        </div>

        {/* Status badge */}
        <div className="absolute top-4 right-4 px-3 py-1 bg-green-500/20 border border-green-500/30 text-green-700 dark:text-green-400 text-xs font-semibold rounded-full">
          Live
        </div>
      </div>

      {/* Avatar Info */}
      <div className="p-6 space-y-3">
        <div>
          <p className="text-xs text-muted-foreground mb-1">AI Interviewer</p>
          <p className="font-bold text-lg">{avatarName}</p>
          <p className="text-sm text-muted-foreground">{avatarTitle}</p>
        </div>

        {/* Status Text */}
        <div className="pt-3 border-t border-border/40">
          <p className="text-sm text-muted-foreground">{getStateLabel()}</p>
        </div>

        {/* Optional children for additional content */}
        {children && <div className="pt-2">{children}</div>}
      </div>
    </Card>
  );
};

export default AvatarPanel;
