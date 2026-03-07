import { useState, useEffect, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
  CheckCircle2,
  Circle,
  AlertTriangle,
} from "lucide-react";
import { GovtQuestion, TestConfig, TestAnswer } from "@/lib/govt-practice-data";

interface LocationState {
  config: TestConfig;
  questions: GovtQuestion[];
  language: "english" | "bengali";
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function GovtTest() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<TestAnswer[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [flagged, setFlagged] = useState<Set<number>>(new Set());

  // Redirect if no state
  useEffect(() => {
    if (!state?.questions?.length) {
      navigate("/govt-practice", { replace: true });
    } else {
      setAnswers(state.questions.map((q) => ({ questionId: q.id, selectedIndex: null })));
    }
  }, [state, navigate]);

  // Timer
  useEffect(() => {
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const questions = state?.questions ?? [];
  const totalTime = (state?.config.count ?? 25) * 72; // ~72s per question
  const timeLeft = Math.max(0, totalTime - elapsed);
  const isTimeWarning = timeLeft < 120;

  // Auto submit when time runs out
  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0) {
      handleSubmit();
    }
  }, [timeLeft]);

  const handleSelect = (optionIndex: number) => {
    setAnswers((prev) =>
      prev.map((a, i) =>
        i === current ? { ...a, selectedIndex: optionIndex } : a
      )
    );
  };

  const toggleFlag = () => {
    setFlagged((prev) => {
      const next = new Set(prev);
      if (next.has(current)) next.delete(current);
      else next.add(current);
      return next;
    });
  };

  const handleSubmit = useCallback(() => {
    if (!state) return;
    navigate("/govt-result", {
      state: {
        config: state.config,
        questions,
        answers,
        timeTakenSeconds: elapsed,
        completedAt: new Date().toISOString(),
        language: state.language,
      },
    });
  }, [state, questions, answers, elapsed, navigate]);

  if (!state || questions.length === 0) return null;

  const q = questions[current];
  const currentAnswer = answers[current];
  const answered = answers.filter((a) => a.selectedIndex !== null).length;
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top bar */}
      <header className="border-b border-border/40 bg-background/95 backdrop-blur sticky top-0 z-50">
        <div className="container px-4 h-14 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">{state.config.exam}</Badge>
            <Badge variant="outline" className="text-xs">{state.config.subject}</Badge>
            <Badge variant="outline" className="text-xs">{state.config.difficulty}</Badge>
          </div>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-xs text-muted-foreground hidden sm:inline">
              {answered}/{questions.length} answered
            </span>
            <div className={`flex items-center gap-1.5 font-mono text-sm font-bold px-3 py-1 rounded-lg ${isTimeWarning ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 animate-pulse" : "bg-muted text-foreground"}`}>
              <Clock className="w-3.5 h-3.5" />
              {formatTime(timeLeft)}
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => setShowSubmitDialog(true)}
            >
              Submit Test
            </Button>
          </div>
        </div>
      </header>

      {/* Progress bar */}
      <div className="h-1.5 bg-muted">
        <div
          className="h-full bg-primary transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      <main className="flex-1 container px-4 py-8 max-w-5xl mx-auto">
        <div className="grid lg:grid-cols-[1fr_240px] gap-6">
          {/* Question Card */}
          <div className="space-y-5">
            {/* Question header */}
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground font-medium">
                  Question {current + 1} of {questions.length}
                </p>
                {q.year && (
                  <Badge variant="secondary" className="text-xs">Year: {q.year}</Badge>
                )}
              </div>
              <button
                onClick={toggleFlag}
                className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg border transition-colors ${
                  flagged.has(current)
                    ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-700 dark:text-amber-400"
                    : "border-border/60 text-muted-foreground hover:border-amber-300"
                }`}
              >
                <Flag className="w-3 h-3" />
                {flagged.has(current) ? "Flagged" : "Flag"}
              </button>
            </div>

            {/* Question text */}
            <Card className="p-6 border-border/40">
              <p className="text-base sm:text-lg font-medium leading-relaxed text-foreground">
                {q.question}
              </p>
            </Card>

            {/* Options */}
            <div className="space-y-3">
              {q.options.map((option, idx) => {
                const selected = currentAnswer?.selectedIndex === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelect(idx)}
                    className={`w-full text-left px-5 py-4 rounded-xl border text-sm font-medium transition-all flex items-center gap-3 ${
                      selected
                        ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20"
                        : "border-border/60 bg-muted/30 text-foreground hover:border-primary/50 hover:bg-primary/5"
                    }`}
                  >
                    <span className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold border ${
                      selected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "border-border/60 text-muted-foreground"
                    }`}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span>{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between pt-2">
              <Button
                variant="outline"
                onClick={() => setCurrent((c) => Math.max(0, c - 1))}
                disabled={current === 0}
                className="gap-1.5"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                {current + 1} / {questions.length}
              </span>
              {current < questions.length - 1 ? (
                <Button
                  onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
                  className="gap-1.5"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={() => setShowSubmitDialog(true)}
                  className="gradient-primary gap-1.5"
                >
                  Submit
                  <CheckCircle2 className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Question Navigator Panel */}
          <div className="hidden lg:block space-y-4">
            <Card className="p-4 border-border/40 sticky top-20">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-3">
                Question Navigator
              </p>
              <div className="grid grid-cols-5 gap-1.5">
                {questions.map((_, i) => {
                  const ans = answers[i];
                  const isAnswered = ans?.selectedIndex !== null;
                  const isFlagged = flagged.has(i);
                  const isCurrent = i === current;
                  return (
                    <button
                      key={i}
                      onClick={() => setCurrent(i)}
                      className={`w-9 h-9 rounded-lg text-xs font-bold transition-all border ${
                        isCurrent
                          ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/30"
                          : isFlagged
                          ? "bg-amber-100 border-amber-300 text-amber-700 dark:bg-amber-900/30 dark:border-amber-600"
                          : isAnswered
                          ? "bg-green-100 border-green-300 text-green-700 dark:bg-green-900/30 dark:border-green-600"
                          : "bg-muted/50 border-border/60 text-muted-foreground hover:border-primary/50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 space-y-2 text-xs">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-100 border border-green-300 dark:bg-green-900/30" />
                  <span className="text-muted-foreground">Answered ({answered})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-amber-100 border border-amber-300 dark:bg-amber-900/30" />
                  <span className="text-muted-foreground">Flagged ({flagged.size})</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted/50 border border-border/60" />
                  <span className="text-muted-foreground">Not visited ({questions.length - answered})</span>
                </div>
              </div>

              <Button
                variant="destructive"
                size="sm"
                className="w-full mt-4"
                onClick={() => setShowSubmitDialog(true)}
              >
                Submit Test
              </Button>
            </Card>
          </div>
        </div>
      </main>

      {/* Submit Confirmation Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              Submit Test?
            </AlertDialogTitle>
            <AlertDialogDescription asChild>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>You have answered <strong className="text-foreground">{answered}</strong> of <strong className="text-foreground">{questions.length}</strong> questions.</p>
                {answered < questions.length && (
                  <p className="text-amber-600 dark:text-amber-400">
                    {questions.length - answered} question(s) unanswered.
                  </p>
                )}
                <p>Time elapsed: {formatTime(elapsed)}</p>
              </div>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Test</AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit} className="bg-primary">
              Submit & View Results
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
