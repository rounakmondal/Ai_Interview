import { useState, useEffect, useCallback } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageSEO } from "@/lib/page-seo";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ChevronRight,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowLeft,
  Trophy,
  Zap,
} from "lucide-react";
import {
  ExamType,
  Subject,
  GovtQuestion,
  EXAM_LABELS,
  SUBJECT_LABELS,
  fetchQuestions,
} from "@/lib/govt-practice-data";
import { completeTask } from "@/lib/daily-tasks";

interface LocationState {
  exam: ExamType;
  subject: Subject;
  taskId: string;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

export default function DailyQuiz() {
  usePageSEO("/daily-quiz");
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState | null;

  const [questions, setQuestions] = useState<GovtQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<(number | null)[]>([]);
  const [elapsed, setElapsed] = useState(0);
  const [loading, setLoading] = useState(true);
  const [finished, setFinished] = useState(false);

  const TIMER_SECONDS = 5 * 60; // 5 minutes

  useEffect(() => {
    if (!state?.exam || !state?.subject) {
      navigate("/daily-tasks", { replace: true });
      return;
    }
    fetchQuestions({
      exam: state.exam,
      subject: state.subject,
      difficulty: "Medium",
      count: 10,
    }).then((qs) => {
      setQuestions(qs);
      setSelected(new Array(qs.length).fill(null));
      setLoading(false);
    });
  }, [state, navigate]);

  // Timer
  useEffect(() => {
    if (loading || finished) return;
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(interval);
  }, [loading, finished]);

  const timeLeft = Math.max(0, TIMER_SECONDS - elapsed);

  // Auto-submit when time expires
  useEffect(() => {
    if (timeLeft === 0 && questions.length > 0 && !finished) {
      handleFinish();
    }
  }, [timeLeft, questions.length, finished]);

  const handleSelect = (optionIdx: number) => {
    if (finished) return;
    setSelected((prev) => prev.map((v, i) => (i === current ? optionIdx : v)));
  };

  const handleFinish = useCallback(() => {
    if (finished) return;
    setFinished(true);

    // Calculate score
    const correct = questions.reduce(
      (acc, q, i) => acc + (selected[i] === q.correctIndex ? 1 : 0),
      0
    );
    const score = Math.round((correct / questions.length) * 100);

    // Mark task done
    if (state?.taskId) {
      completeTask(state.taskId, score);
    }
  }, [finished, questions, selected, state]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto" />
          <p className="text-sm text-muted-foreground">Loading quiz…</p>
        </div>
      </div>
    );
  }

  if (!state || questions.length === 0) return null;

  const correct = questions.reduce(
    (acc, q, i) => acc + (selected[i] === q.correctIndex ? 1 : 0),
    0
  );
  const scorePct = Math.round((correct / questions.length) * 100);
  const answered = selected.filter((s) => s !== null).length;
  const q = questions[current];

  // ── Finished state ──────────────────────────────────────────
  if (finished) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
          <div className="container px-4 h-14 flex items-center gap-3">
            <Link to="/daily-tasks" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Daily Tasks
            </Link>
          </div>
        </header>

        <main className="container px-4 py-12 max-w-lg mx-auto text-center space-y-6">
          <div className={`w-20 h-20 mx-auto rounded-2xl flex items-center justify-center ${
            scorePct >= 60 ? "bg-green-100 dark:bg-green-900/30" : "bg-amber-100 dark:bg-amber-900/30"
          }`}>
            <Trophy className={`w-10 h-10 ${scorePct >= 60 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`} />
          </div>

          <div>
            <h1 className="text-3xl font-bold">{scorePct}%</h1>
            <p className="text-muted-foreground mt-1">
              {correct}/{questions.length} correct in {SUBJECT_LABELS[state.subject] || state.subject}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Card className="p-3 border-border/40 text-center">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">{correct}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </Card>
            <Card className="p-3 border-border/40 text-center">
              <p className="text-lg font-bold text-red-600 dark:text-red-400">{questions.length - correct}</p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </Card>
            <Card className="p-3 border-border/40 text-center">
              <p className="text-lg font-bold text-primary">{formatTime(elapsed)}</p>
              <p className="text-xs text-muted-foreground">Time</p>
            </Card>
          </div>

          <div className="flex items-center justify-center gap-2 text-sm text-primary font-medium">
            <Zap className="w-4 h-4" />
            +10 XP earned!
          </div>

          {/* Quick review */}
          <div className="text-left space-y-3 pt-4">
            <h3 className="font-semibold text-sm">Quick Review</h3>
            {questions.map((question, idx) => {
              const userAns = selected[idx];
              const isCorrect = userAns === question.correctIndex;
              return (
                <Card key={question.id} className={`p-4 border-l-4 ${isCorrect ? "border-l-green-500" : "border-l-red-500"} border-border/40`}>
                  <p className="text-sm font-medium mb-2">
                    <span className="text-muted-foreground mr-1">Q{idx + 1}.</span>
                    {question.question}
                  </p>
                  <div className="flex items-center gap-2 text-xs">
                    {isCorrect ? (
                      <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Correct
                      </span>
                    ) : (
                      <>
                        <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
                          <XCircle className="w-3 h-3" />
                          {userAns !== null ? question.options[userAns] : "Unanswered"}
                        </span>
                        <span className="text-muted-foreground">→</span>
                        <span className="text-green-600 dark:text-green-400">
                          {question.options[question.correctIndex]}
                        </span>
                      </>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex gap-3 pt-4">
            <Button variant="outline" className="flex-1" onClick={() => navigate("/daily-tasks")}>
              Back to Tasks
            </Button>
            <Button className="flex-1 gap-1.5" onClick={() => navigate("/daily-tasks")}>
              <Zap className="w-4 h-4" />
              Continue
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // ── Quiz in progress ────────────────────────────────────────
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">{state.subject}</Badge>
            <Badge variant="outline" className="text-xs">{answered}/{questions.length} answered</Badge>
          </div>
          <div className={`flex items-center gap-1.5 text-sm font-mono font-bold ${timeLeft < 60 ? "text-red-500" : "text-foreground"}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>
      </header>

      <main className="container px-6 sm:px-10 py-6 max-w-2xl mx-auto space-y-6">
        {/* Progress */}
        <Progress value={((current + 1) / questions.length) * 100} className="h-1.5" />

        {/* Question */}
        <Card className="p-6 border-border/40">
          <p className="text-xs text-muted-foreground mb-2">
            Question {current + 1} of {questions.length}
          </p>
          <h2 className="text-lg font-semibold leading-relaxed mb-6">{q.question}</h2>

          <div className="space-y-3">
            {q.options.map((opt, idx) => {
              const isSelected = selected[current] === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleSelect(idx)}
                  className={`w-full text-left p-4 rounded-xl border-2 transition-all text-sm ${
                    isSelected
                      ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                      : "border-border/40 hover:border-primary/30 hover:bg-muted/50"
                  }`}
                >
                  <span className={`inline-flex items-center justify-center w-7 h-7 rounded-lg mr-3 text-xs font-bold ${
                    isSelected
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  {opt}
                </button>
              );
            })}
          </div>
        </Card>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            disabled={current === 0}
            onClick={() => setCurrent((c) => c - 1)}
          >
            Previous
          </Button>

          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent((c) => c + 1)} className="gap-1">
              Next <ChevronRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleFinish} className="gap-1 bg-green-600 hover:bg-green-700">
              Submit Quiz <CheckCircle2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
