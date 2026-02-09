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
      {/* Avatar Container */}
      <div className="aspect-square bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center relative overflow-hidden">
        {/* Animated avatar placeholder - can be replaced with real avatar/video */}
        <div className="relative">
          {/* Avatar circle */}
          <div className="w-40 h-40 rounded-full bg-gradient-primary animate-pulse-subtle flex items-center justify-center text-white text-center shadow-lg">
            <svg
              className="w-24 h-24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
            >
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>

          {/* State indicator - Speaking animation */}
          {state === "speaking" && (
            <div className="absolute bottom-4 right-4 flex gap-1">
              <div className="w-2 h-6 bg-primary/80 rounded-full animate-pulse" />
              <div className="w-2 h-6 bg-secondary/80 rounded-full animate-pulse delay-100" />
              <div className="w-2 h-6 bg-accent/80 rounded-full animate-pulse delay-200" />
            </div>
          )}

          {/* State indicator - Listening animation */}
          {state === "listening" && (
            <div className="absolute bottom-4 right-4 flex gap-2">
              <div className="w-3 h-3 rounded-full border-2 border-accent animate-ping" />
            </div>
          )}

          {/* State indicator - Thinking animation */}
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
