import { FC } from "react";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

interface ProgressIndicatorProps {
  currentQuestion: number;
  totalQuestions: number;
  isFollowUp?: boolean;
}

const ProgressIndicator: FC<ProgressIndicatorProps> = ({
  currentQuestion,
  totalQuestions,
  isFollowUp = false,
}) => {
  const progressPercent = (currentQuestion / totalQuestions) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-card to-card/50 border-border/40 space-y-4 animate-fade-in">
      {/* Title with question count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/20">
            <CheckCircle2 className="w-4 h-4 text-primary" />
          </div>
          <h3 className="font-bold text-foreground text-sm">Progress</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-primary bg-primary/10 px-2.5 py-1 rounded-full">
            {currentQuestion}/{totalQuestions}
          </span>
          {isFollowUp && (
            <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold animate-bounce-subtle">
              Follow-up
            </span>
          )}
        </div>
      </div>

      {/* Enhanced progress bar with glow */}
      <div className="space-y-2.5">
        <div className="h-3 bg-muted rounded-full overflow-hidden shadow-inner relative">
          <div
            className="h-full bg-gradient-to-r from-primary via-secondary to-primary rounded-full transition-all duration-700 ease-out shadow-lg shadow-primary/30"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        {/* Progress text with percentage */}
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-medium">Questions Answered</span>
          <span className="text-primary font-bold text-sm">{progressPercent.toFixed(0)}%</span>
        </div>
      </div>

      {/* Question milestone indicator */}
      <div className="flex gap-1.5">
        {[...Array(totalQuestions)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
              i < currentQuestion - 1
                ? 'bg-gradient-to-r from-primary to-secondary shadow-sm shadow-primary/50'
                : i === currentQuestion - 1
                  ? 'bg-primary/40 animate-pulse'
                  : 'bg-muted/60'
            }`}
          />
        ))}
      </div>
    </Card>
  );
};

export default ProgressIndicator;
