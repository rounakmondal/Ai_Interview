import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Volume2 } from "lucide-react";

interface QuestionDisplayProps {
  questionText: string;
  isFollowUp?: boolean;
  questionNumber?: number;
  totalQuestions?: number;
  subtitleText?: string;
  isPlaying?: boolean;
}

const QuestionDisplay: FC<QuestionDisplayProps> = ({
  questionText,
  isFollowUp = false,
  questionNumber,
  totalQuestions,
  subtitleText,
  isPlaying = false,
}) => {
  return (
    <div className="space-y-4">
      {/* Question Card */}
      <Card className="p-6 border-border/40 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="text-sm text-muted-foreground">
                {isFollowUp ? "Follow-up Question" : "Question"}
              </h3>
              {isFollowUp && (
                <span className="px-2 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-semibold">
                  Follow-up
                </span>
              )}
            </div>
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <p className="text-lg font-semibold text-foreground leading-relaxed">
                {questionText}
              </p>
            </div>
          </div>

          {/* Playing indicator */}
          {isPlaying && (
            <div className="flex-shrink-0 p-3 bg-primary/10 rounded-lg">
              <div className="flex gap-1">
                <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
                <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse delay-100" />
                <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse delay-200" />
              </div>
            </div>
          )}
        </div>

        {/* Question metadata */}
        {(questionNumber || totalQuestions) && (
          <div className="flex items-center justify-between pt-2 border-t border-border/40">
            <p className="text-xs text-muted-foreground">
              {questionNumber && totalQuestions && (
                <>
                  Question {questionNumber} of {totalQuestions}
                </>
              )}
            </p>
            <div className="w-32 h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-primary rounded-full transition-all duration-300"
                style={{
                  width: `${questionNumber && totalQuestions ? (questionNumber / totalQuestions) * 100 : 0}%`,
                }}
              />
            </div>
          </div>
        )}
      </Card>

      {/* Subtitles */}
      {subtitleText && (
        <Card className="p-4 border-border/40 bg-muted/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground font-medium">
                Subtitles
              </p>
            </div>
            <p className="text-sm text-foreground leading-relaxed">
              {subtitleText}
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default QuestionDisplay;
