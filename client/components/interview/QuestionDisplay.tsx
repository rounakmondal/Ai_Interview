import { FC } from "react";
import { Card } from "@/components/ui/card";
import { Volume2, MessageSquare } from "lucide-react";

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
    <div className="space-y-4 animate-fade-in-up">
      {/* Question Card */}
      <Card className={`p-6 bg-gradient-to-br from-card to-card/50 border-border/40 space-y-4 transition-all duration-500 ${
        isPlaying ? 'shadow-lg shadow-primary/20 border-primary/30' : 'shadow-sm'
      }`}>
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3 flex-1">
            {/* Header with question type */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                {isFollowUp ? (
                  <MessageSquare className="w-5 h-5 text-secondary" />
                ) : (
                  <Volume2 className="w-5 h-5 text-primary" />
                )}
              </div>
              <div>
                <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  {isFollowUp ? "Follow-up Question" : "Question"}
                </h3>
                {questionNumber && totalQuestions && (
                  <p className="text-xs text-muted-foreground/70 mt-0.5">
                    {questionNumber} of {totalQuestions}
                  </p>
                )}
              </div>
              {isFollowUp && (
                <span className="ml-auto px-3 py-1 rounded-full bg-gradient-to-r from-secondary/20 to-secondary/10 text-secondary text-xs font-semibold border border-secondary/30 animate-bounce-subtle">
                  Follow-up
                </span>
              )}
            </div>

            {/* Question text with enhanced styling */}
            <div className={`relative p-5 rounded-xl border transition-all duration-300 ${
              isPlaying
                ? 'bg-gradient-to-r from-primary/15 to-secondary/15 border-primary/40'
                : 'bg-primary/8 border-primary/20'
            }`}>
              <p className="text-lg font-semibold text-foreground leading-relaxed">
                {questionText}
              </p>
              {/* Subtle left accent bar */}
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-primary to-secondary rounded-l-xl" />
            </div>
          </div>

          {/* Playing indicator with animation */}
          {isPlaying && (
            <div className="flex-shrink-0 p-4 bg-primary/15 rounded-xl border border-primary/30 animate-scale-in">
              <div className="flex gap-1.5">
                <div className="w-2 h-4 bg-primary rounded-full animate-pulse" />
                <div className="w-2 h-4 bg-primary rounded-full animate-pulse delay-100" />
                <div className="w-2 h-4 bg-primary rounded-full animate-pulse delay-200" />
              </div>
              <p className="text-xs text-primary font-medium mt-2 whitespace-nowrap">Playing...</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default QuestionDisplay;
