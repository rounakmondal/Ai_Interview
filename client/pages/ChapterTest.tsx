import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  Trophy,
  BookOpen,
  RotateCcw,
  Home,
  AlertCircle,
} from "lucide-react";
import { getChapterQuestions, saveChapterProgress } from "@/lib/exam-syllabus-data";
import type { ChapterQuestion } from "@shared/study-types";

const PASS_THRESHOLD = 60;
const DEFAULT_TIME_SECONDS = 10 * 60; // 10 minutes

export default function ChapterTest() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();

  const [questions, setQuestions] = useState<ChapterQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load questions
  useEffect(() => {
    if (!chapterId) { navigate("/syllabus", { replace: true }); return; }

    // Try API first, fall back to local
    (async () => {
      try {
        const res = await fetch(`/api/test/${encodeURIComponent(chapterId)}/questions`);
        if (res.ok) {
          const data: ChapterQuestion[] = await res.json();
          setQuestions(data);
          setLoading(false);
          return;
        }
      } catch { /* fallback */ }
      // Local fallback
      const local = getChapterQuestions(chapterId);
      setQuestions(local);
      setLoading(false);
    })();
  }, [chapterId, navigate]);

  // Timer
  useEffect(() => {
    if (submitted || loading) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [submitted, loading, timeLeft]);

  const selectAnswer = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);

    // Calculate results
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const accuracy = Math.round((correct / questions.length) * 100);
    const passed = accuracy >= PASS_THRESHOLD;

    // Save progress
    if (chapterId) {
      saveChapterProgress(chapterId, {
        status: passed ? "done" : "in_progress",
        progress: accuracy,
        lastScore: accuracy,
      });
    }
  }, [submitted, questions, answers, chapterId]);

  // Results
  const getResults = () => {
    let correct = 0, wrong = 0, unanswered = 0;
    for (const q of questions) {
      if (answers[q.id] === undefined) unanswered++;
      else if (answers[q.id] === q.correctIndex) correct++;
      else wrong++;
    }
    const accuracy = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    return { correct, wrong, unanswered, accuracy, passed: accuracy >= PASS_THRESHOLD };
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-sm">
          <AlertCircle className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
          <p className="font-semibold mb-2">No Questions Available</p>
          <p className="text-sm text-muted-foreground mb-4">Questions for this chapter haven't been added yet.</p>
          <Link to="/syllabus">
            <Button variant="outline" className="gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Back to Syllabus
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // ─── RESULT SCREEN ─────────────────────────────────────────────────
  if (submitted) {
    const results = getResults();
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
          <div className="container px-4 h-14 flex items-center gap-3">
            <Link to="/syllabus" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Syllabus
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Test Result</span>
          </div>
        </header>

        <main className="container px-4 py-8 max-w-3xl mx-auto space-y-6">
          {/* Hero result */}
          <Card className={`p-8 text-center border-border/40 ${results.passed ? "bg-green-500/5" : "bg-red-500/5"}`}>
            <div className={`w-16 h-16 mx-auto rounded-2xl flex items-center justify-center mb-4 ${
              results.passed ? "bg-green-500/10" : "bg-red-500/10"
            }`}>
              {results.passed ? (
                <Trophy className="w-8 h-8 text-green-500" />
              ) : (
                <XCircle className="w-8 h-8 text-red-500" />
              )}
            </div>
            <p className={`text-4xl font-bold mb-2 ${results.passed ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
              {results.accuracy}%
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              {results.passed ? "Congratulations! Chapter marked as done." : `Need ${PASS_THRESHOLD}% to pass. Try again!`}
            </p>
            <Badge variant={results.passed ? "default" : "destructive"} className="text-sm">
              {results.passed ? "PASSED" : "NOT PASSED"}
            </Badge>
          </Card>

          {/* Score grid */}
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 text-center border-border/40">
              <p className="text-2xl font-bold text-green-600">{results.correct}</p>
              <p className="text-xs text-muted-foreground">Correct</p>
            </Card>
            <Card className="p-4 text-center border-border/40">
              <p className="text-2xl font-bold text-red-600">{results.wrong}</p>
              <p className="text-xs text-muted-foreground">Wrong</p>
            </Card>
            <Card className="p-4 text-center border-border/40">
              <p className="text-2xl font-bold text-muted-foreground">{results.unanswered}</p>
              <p className="text-xs text-muted-foreground">Unanswered</p>
            </Card>
          </div>

          {/* Question Review */}
          <div className="space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Question Review
            </h2>
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctIndex;
              return (
                <Card key={q.id} className="p-4 border-border/40 space-y-3">
                  <div className="flex items-start gap-2">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                      userAnswer === undefined ? "bg-muted text-muted-foreground" : isCorrect ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                    }`}>
                      Q{idx + 1}
                    </span>
                    <p className="text-sm font-medium flex-1">{q.question}</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => {
                      const isCorrectOpt = oi === q.correctIndex;
                      const isUserPick = oi === userAnswer;
                      return (
                        <div
                          key={oi}
                          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm border ${
                            isCorrectOpt
                              ? "border-green-500/50 bg-green-500/5"
                              : isUserPick
                              ? "border-red-500/50 bg-red-500/5"
                              : "border-border/40"
                          }`}
                        >
                          {isCorrectOpt && <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />}
                          {isUserPick && !isCorrectOpt && <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />}
                          <span className={`${isCorrectOpt ? "font-medium" : ""}`}>
                            {String.fromCharCode(65 + oi)}. {opt}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  <div className="bg-muted/30 rounded-lg p-3 text-xs text-muted-foreground">
                    💡 {q.explanation}
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to={`/chapter-test/${chapterId}`} onClick={() => window.location.reload()}>
              <Button variant="outline" className="gap-1.5">
                <RotateCcw className="w-4 h-4" />
                Retry Test
              </Button>
            </Link>
            <Link to="/syllabus">
              <Button className="gap-1.5">
                <Home className="w-4 h-4" />
                Back to Syllabus
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ─── TEST TAKING SCREEN ────────────────────────────────────────────
  const q = questions[current];
  const answeredCount = Object.keys(answers).length;
  const progressPct = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link to="/syllabus" className="text-sm text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <Badge variant="secondary" className="text-xs">
              {answeredCount}/{questions.length} answered
            </Badge>
          </div>
          <div className={`flex items-center gap-1.5 font-bold text-lg ${timeLeft < 120 ? "text-red-500" : "text-foreground"}`}>
            <Clock className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
          <Button size="sm" onClick={handleSubmit} disabled={answeredCount === 0} className="gap-1.5">
            Submit
          </Button>
        </div>
      </header>

      {/* Progress */}
      <Progress value={progressPct} className="h-1 rounded-none" />

      <main className="container px-4 py-6 max-w-2xl mx-auto space-y-6">
        {/* Question */}
        <Card className="p-5 sm:p-6 border-border/40">
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="outline" className="text-xs">
              Question {current + 1} of {questions.length}
            </Badge>
          </div>
          <p className="text-base sm:text-lg font-medium leading-relaxed">{q.question}</p>
        </Card>

        {/* Options */}
        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            const isSelected = answers[q.id] === idx;
            return (
              <button
                key={idx}
                onClick={() => selectAnswer(q.id, idx)}
                className={`w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all ${
                  isSelected
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                    : "border-border/40 hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <span className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm font-medium">{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            Previous
          </Button>

          {/* Question nav dots */}
          <div className="hidden sm:flex gap-1">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-6 h-6 rounded text-xs font-medium transition-all ${
                  i === current
                    ? "bg-primary text-primary-foreground"
                    : answers[questions[i].id] !== undefined
                    ? "bg-green-500/20 text-green-600"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent(current + 1)} className="gap-1.5">
              Next
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={answeredCount === 0} className="gap-1.5 bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4" />
              Submit
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
