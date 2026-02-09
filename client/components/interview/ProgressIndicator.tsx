import { FC } from "react";
import { Card } from "@/components/ui/card";

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
    <Card className="p-4 border-border/40 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-foreground">Interview Progress</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-primary">
            Question {currentQuestion}
          </span>
          <span className="text-sm text-muted-foreground">
            of {totalQuestions}
          </span>
          {isFollowUp && (
            <span className="ml-2 px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
              Follow-up
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-primary rounded-full transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Progress text */}
      <p className="text-xs text-muted-foreground text-center">
        {progressPercent.toFixed(0)}% complete
      </p>
    </Card>
  );
};

export default ProgressIndicator;
