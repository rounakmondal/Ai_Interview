import { useState, useEffect, useCallback } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProfileButton from "@/components/ProfileButton";
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
  GanttChart,
  BookMarked,
  BarChart3,
  Play,
  Shield,
  Brain,
  Star,
  Users,
  Flame,
  Target,
  TrendingUp,
  Award,
  Lightbulb,
  Zap,
} from "lucide-react";
import { getChapterQuestions, saveChapterProgress, getStudyExamPreference } from "@/lib/exam-syllabus-data";
import { STUDY_EXAM_LABELS } from "@shared/study-types";
import type { ChapterQuestion } from "@shared/study-types";

function formatChapterName(id: string): string {
  return (id ?? "")
    .replace(/-/g, " ")
    .replace(/_/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function getGrade(score: number): { letter: string; label: string; color: string; bg: string } {
  if (score >= 90) return { letter: "S", label: "Outstanding", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" };
  if (score >= 75) return { letter: "A", label: "Excellent", color: "text-green-600 dark:text-green-400", bg: "bg-green-500/10" };
  if (score >= 60) return { letter: "B", label: "Good Pass", color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" };
  if (score >= 40) return { letter: "C", label: "Below Pass", color: "text-orange-600 dark:text-orange-400", bg: "bg-orange-500/10" };
  return { letter: "F", label: "Failed", color: "text-red-600 dark:text-red-400", bg: "bg-red-500/10" };
}

const PASS_THRESHOLD = 60;
const DEFAULT_TIME_SECONDS = 10 * 60;

export default function ChapterTest() {
  const { chapterId } = useParams<{ chapterId: string }>();
  const navigate = useNavigate();
  const studyExam = getStudyExamPreference();

  const [questions, setQuestions] = useState<ChapterQuestion[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeLeft, setTimeLeft] = useState(DEFAULT_TIME_SECONDS);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [started, setStarted] = useState(false);

  // Load questions
  useEffect(() => {
    if (!chapterId) { navigate("/syllabus", { replace: true }); return; }
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
      const local = getChapterQuestions(chapterId);
      setQuestions(local);
      setLoading(false);
    })();
  }, [chapterId, navigate]);

  // Timer — only runs after user presses Start
  useEffect(() => {
    if (!started || submitted || loading) return;
    if (timeLeft <= 0) { handleSubmit(); return; }
    const t = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(t);
  }, [started, submitted, loading, timeLeft]);

  const selectAnswer = (qId: number, optionIdx: number) => {
    if (submitted) return;
    setAnswers((prev) => ({ ...prev, [qId]: optionIdx }));
  };

  const handleSubmit = useCallback(() => {
    if (submitted) return;
    setSubmitted(true);
    let correct = 0;
    for (const q of questions) {
      if (answers[q.id] === q.correctIndex) correct++;
    }
    const accuracy = Math.round((correct / questions.length) * 100);
    const passed = accuracy >= PASS_THRESHOLD;
    if (chapterId) {
      saveChapterProgress(chapterId, {
        status: passed ? "done" : "in_progress",
        progress: accuracy,
        lastScore: accuracy,
      });
    }
  }, [submitted, questions, answers, chapterId]);

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

  const chapterName = formatChapterName(chapterId ?? "");
  const examLabel = studyExam ? STUDY_EXAM_LABELS[studyExam] : "Exam Prep";

  // ─── SHARED NAVBAR ──────────────────────────────────────────────────
  const Navbar = ({ title, showTimer = false }: { title?: string; showTimer?: boolean }) => (
    <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container px-4 h-14 flex items-center gap-3">
        <Link to="/" className="flex items-center gap-2 mr-1">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, #1e1b4b, #3730a3)" }}>
            <svg viewBox="0 0 36 36" width="17" height="17" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 28 L4 8 L18 20 L32 8 L32 28 L28 28 L28 12 L18 22 L8 12 L8 28 Z" fill="white"/>
              <circle cx="18" cy="6" r="3.5" fill="#fb923c"/>
            </svg>
          </div>
          <span className="font-bold text-sm hidden sm:block">MedhaHub</span>
        </Link>
        <span className="text-border/60 hidden sm:block">|</span>
        <nav className="hidden md:flex items-center gap-1 text-sm">
          <Link to="/dashboard" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5">
            <Home className="w-3.5 h-3.5" />Dashboard
          </Link>
          <Link to="/study-plan" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5">
            <GanttChart className="w-3.5 h-3.5" />Study Plan
          </Link>
          <Link to="/syllabus" className="px-3 py-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors flex items-center gap-1.5">
            <BookMarked className="w-3.5 h-3.5" />Syllabus
          </Link>
          <span className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary font-medium flex items-center gap-1.5 cursor-default">
            <BarChart3 className="w-3.5 h-3.5" />Chapter Test
          </span>
        </nav>
        {title && (
          <Badge variant="secondary" className="text-xs font-medium hidden sm:flex max-w-[160px] truncate">
            {title}
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-2">
          {showTimer && (
            <div className={`flex items-center gap-1.5 font-bold text-sm px-3 py-1.5 rounded-full ${
              timeLeft < 120 ? "bg-red-500/10 text-red-500" : "bg-muted text-foreground"
            }`}>
              <Clock className="w-3.5 h-3.5" />{formatTime(timeLeft)}
            </div>
          )}
          <ProfileButton />
        </div>
      </div>
    </header>
  );

  // ─── LOADING ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar title={chapterName} />
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-center space-y-3">
            <div className="w-10 h-10 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto" />
            <p className="text-sm text-muted-foreground">Loading questions…</p>
          </div>
        </div>
      </div>
    );
  }

  // ─── NO QUESTIONS ─────────────────────────────────────────────────────
  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar title={chapterName} />
        <div className="flex items-center justify-center min-h-[80vh] p-4">
          <Card className="p-8 text-center max-w-sm border-border/40">
            <div className="w-14 h-14 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-muted-foreground" />
            </div>
            <p className="font-bold text-lg mb-2">No Questions Yet</p>
            <p className="text-sm text-muted-foreground mb-6">
              Questions for <span className="font-medium text-foreground">"{chapterName}"</span> haven't been added yet. Check back soon!
            </p>
            <Link to="/syllabus">
              <Button className="gap-1.5">
                <BookMarked className="w-4 h-4" />Back to Syllabus
              </Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  // ─── PRE-TEST INTRO ───────────────────────────────────────────────────
  if (!started) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar title={chapterName} />

        {/* Trust strip */}
        <div className="border-b border-border/40 bg-green-500/5">
          <div className="container px-4 py-2.5 flex items-center justify-center gap-6 flex-wrap">
            {[
              { icon: <Shield className="w-3.5 h-3.5" />, label: "Exam-Pattern Questions" },
              { icon: <Brain className="w-3.5 h-3.5" />, label: "AI-Explained Answers" },
              { icon: <Star className="w-3.5 h-3.5" />, label: "4.9★ Rated" },
              { icon: <Users className="w-3.5 h-3.5" />, label: "1L+ Students" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 text-xs font-medium text-green-700 dark:text-green-400">
                {item.icon}{item.label}
              </div>
            ))}
          </div>
        </div>

        <main className="container px-4 py-8 max-w-2xl mx-auto space-y-6">
          {/* Hero */}
          <div className="text-center space-y-2 py-4">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-xs mb-2">
              <BarChart3 className="w-3 h-3 mr-1" />Chapter Test
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold">{chapterName}</h1>
            <p className="text-muted-foreground text-sm">{examLabel}</p>
          </div>

          {/* Test info card */}
          <Card className="overflow-hidden border-border/40">
            <div className="bg-gradient-to-r from-primary/8 to-red-500/5 px-6 py-5 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold">Test Overview</p>
                  <p className="text-sm text-muted-foreground">Review the rules before you begin</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {[
                  { icon: <BookOpen className="w-5 h-5 text-blue-500" />, label: "Questions", value: `${questions.length}` },
                  { icon: <Clock className="w-5 h-5 text-orange-500" />, label: "Time Limit", value: "10 min" },
                  { icon: <Flame className="w-5 h-5 text-red-500" />, label: "Pass Score", value: `${PASS_THRESHOLD}%` },
                  { icon: <Trophy className="w-5 h-5 text-yellow-500" />, label: "Chapter", value: "Mark Done" },
                ].map((item, i) => (
                  <div key={i} className="text-center p-3 rounded-xl bg-muted/30 border border-border/30">
                    <div className="flex justify-center mb-2">{item.icon}</div>
                    <p className="text-lg font-bold">{item.value}</p>
                    <p className="text-xs text-muted-foreground">{item.label}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-2 mb-6 p-4 rounded-xl bg-amber-500/5 border border-amber-200/50 dark:border-amber-700/30">
                <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                  <Lightbulb className="w-3.5 h-3.5" />Instructions
                </p>
                {[
                  "Each question has one correct answer.",
                  "Timer starts as soon as you press Start.",
                  "You can navigate between questions freely.",
                  `Score ${PASS_THRESHOLD}%+ to mark this chapter as done.`,
                  "Detailed explanations shown after submission.",
                ].map((rule, i) => (
                  <p key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 flex items-center justify-center text-[10px] font-bold flex-shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    {rule}
                  </p>
                ))}
              </div>

              <Button
                size="lg"
                className="w-full gap-2 bg-gradient-to-r from-primary to-violet-600 text-base"
                onClick={() => setStarted(true)}
              >
                <Play className="w-5 h-5" />Start Test — {questions.length} Questions
              </Button>
            </div>
          </Card>

          {/* Quick tips */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { icon: <Zap className="w-4 h-4 text-yellow-500" />, text: "Read carefully before answering" },
              { icon: <TrendingUp className="w-4 h-4 text-green-500" />, text: "Attempt all questions" },
              { icon: <Award className="w-4 h-4 text-orange-500" />, text: "No negative marking" },
            ].map((item, i) => (
              <div key={i} className="flex items-center sm:flex-col gap-2 sm:gap-1.5 p-3 rounded-xl bg-muted/30 sm:text-center">
                {item.icon}
                <p className="text-xs text-muted-foreground">{item.text}</p>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ─── RESULT SCREEN ───────────────────────────────────────────────────
  if (submitted) {
    const results = getResults();
    const grade = getGrade(results.accuracy);
    const timeTaken = DEFAULT_TIME_SECONDS - timeLeft;
    const timeTakenStr = `${Math.floor(timeTaken / 60)}m ${timeTaken % 60}s`;

    return (
      <div className="min-h-screen bg-background">
        <Navbar title={`${chapterName} — Result`} />

        <main className="container px-4 py-8 max-w-3xl mx-auto space-y-6">
          {/* Hero result card */}
          <Card className="overflow-hidden border-border/40">
            <div className={`${grade.bg} px-6 py-8 text-center border-b border-border/40`}>
              <div className={`w-20 h-20 mx-auto rounded-2xl ${grade.bg} border-2 ${results.passed ? "border-green-500/30" : "border-red-500/30"} flex items-center justify-center mb-4`}>
                <span className={`text-5xl font-black ${grade.color}`}>{grade.letter}</span>
              </div>
              <p className={`text-4xl font-black mb-1 ${grade.color}`}>{results.accuracy}%</p>
              <p className="text-lg font-semibold mb-1">{grade.label}</p>
              <p className="text-sm text-muted-foreground">{chapterName}</p>
              <div className="flex items-center justify-center gap-2 mt-3">
                <Badge variant={results.passed ? "default" : "destructive"} className="text-sm px-3 py-1">
                  {results.passed ? "✓ PASSED — Chapter Marked Done" : `✗ FAILED — Need ${PASS_THRESHOLD}% to Pass`}
                </Badge>
              </div>
            </div>
            {/* Stats row */}
            <div className="grid grid-cols-4 divide-x divide-border/40">
              {[
                { label: "Correct", value: results.correct, color: "text-green-600" },
                { label: "Wrong", value: results.wrong, color: "text-red-600" },
                { label: "Skipped", value: results.unanswered, color: "text-muted-foreground" },
                { label: "Time", value: timeTakenStr, color: "text-foreground" },
              ].map((s, i) => (
                <div key={i} className="py-4 text-center">
                  <p className={`text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                </div>
              ))}
            </div>
          </Card>

          {/* Performance bar */}
          <Card className="p-5 border-border/40">
            <div className="flex items-center justify-between text-sm mb-3">
              <span className="font-semibold">Score Progress</span>
              <span className="text-muted-foreground">Pass threshold: {PASS_THRESHOLD}%</span>
            </div>
            <div className="relative">
              <Progress value={results.accuracy} className="h-3" />
              <div
                className="absolute top-0 h-3 w-0.5 bg-orange-400"
                style={{ left: `${PASS_THRESHOLD}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0%</span>
              <span className="text-orange-500">Pass: {PASS_THRESHOLD}%</span>
              <span>100%</span>
            </div>
          </Card>

          {/* Motivation */}
          {results.passed ? (
            <Card className="p-4 border-border/40 bg-green-500/5 flex items-start gap-3">
              <Trophy className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-green-700 dark:text-green-400">Great work! Chapter completed.</p>
                <p className="text-xs text-muted-foreground mt-0.5">Keep going — move on to the next chapter to build your momentum!</p>
              </div>
            </Card>
          ) : (
            <Card className="p-4 border-border/40 bg-orange-500/5 flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-sm text-orange-700 dark:text-orange-400">Almost there! Review the explanations below.</p>
                <p className="text-xs text-muted-foreground mt-0.5">Focus on wrong answers, revisit the chapter content, then retake the test.</p>
              </div>
            </Card>
          )}

          {/* Question Review */}
          <div className="space-y-4">
            <h2 className="font-bold text-lg flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />Question Review
            </h2>
            {questions.map((q, idx) => {
              const userAnswer = answers[q.id];
              const isCorrect = userAnswer === q.correctIndex;
              const unanswered = userAnswer === undefined;
              return (
                <Card key={q.id} className={`border-border/40 overflow-hidden border-l-4 ${
                  unanswered ? "border-l-muted" : isCorrect ? "border-l-green-500" : "border-l-red-500"
                }`}>
                  <div className="p-4 space-y-3">
                    <div className="flex items-start gap-2">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md flex-shrink-0 mt-0.5 ${
                        unanswered ? "bg-muted text-muted-foreground"
                        : isCorrect ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                      }`}>
                        Q{idx + 1}
                      </span>
                      <p className="text-sm font-medium flex-1 leading-relaxed">{q.question}</p>
                      <div className="flex-shrink-0 ml-2">
                        {unanswered ? (
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">Skipped</span>
                        ) : isCorrect ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
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
                                ? "border-green-500/50 bg-green-500/5 font-medium"
                                : isUserPick && !isCorrectOpt
                                ? "border-red-500/50 bg-red-500/5"
                                : "border-border/40"
                            }`}
                          >
                            <span className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                              isCorrectOpt ? "bg-green-500 text-white"
                              : isUserPick && !isCorrectOpt ? "bg-red-500 text-white"
                              : "bg-muted text-muted-foreground"
                            }`}>
                              {String.fromCharCode(65 + oi)}
                            </span>
                            <span>{opt}</span>
                            {isCorrectOpt && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-auto flex-shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                    <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-700/30 rounded-lg p-3 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-amber-500" />
                      <span>{q.explanation}</span>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-3 pb-8">
            <Link to={`/chapter-test/${chapterId}`} onClick={() => window.location.reload()}>
              <Button variant="outline" className="gap-1.5">
                <RotateCcw className="w-4 h-4" />Retry Test
              </Button>
            </Link>
            <Link to="/syllabus">
              <Button className="gap-1.5">
                <BookMarked className="w-4 h-4" />Back to Syllabus
              </Button>
            </Link>
          </div>
        </main>
      </div>
    );
  }

  // ─── TEST TAKING SCREEN ──────────────────────────────────────────────
  const q = questions[current];
  const answeredCount = Object.keys(answers).length;
  const progressPct = ((current + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-background">
      <Navbar title={chapterName} showTimer />
      <Progress value={progressPct} className="h-1 rounded-none" />

      <main className="container px-6 sm:px-10 py-6 max-w-2xl mx-auto space-y-5">
        {/* Status bar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Q {current + 1} / {questions.length}
            </Badge>
            <Badge variant="secondary" className="text-xs">
              {answeredCount} answered
            </Badge>
            {answeredCount === questions.length && (
              <Badge className="text-xs bg-green-600">All Done!</Badge>
            )}
          </div>
          <Button size="sm" onClick={handleSubmit} disabled={answeredCount === 0} className="gap-1.5 bg-red-600 hover:bg-red-700">
            <CheckCircle2 className="w-3.5 h-3.5" />Submit
          </Button>
        </div>

        {/* Question */}
        <Card className="p-5 sm:p-6 border-border/40">
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
                    ? "border-primary bg-primary/5 ring-2 ring-primary/20 shadow-sm"
                    : "border-border/40 hover:border-primary/30 hover:bg-muted/30"
                }`}
              >
                <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all ${
                  isSelected ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="text-sm font-medium">{opt}</span>
                {isSelected && <CheckCircle2 className="w-4 h-4 text-primary ml-auto flex-shrink-0" />}
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-1">
          <Button
            variant="outline"
            onClick={() => setCurrent(Math.max(0, current - 1))}
            disabled={current === 0}
            className="gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />Prev
          </Button>

          {/* Question grid */}
          <div className="flex gap-1 flex-wrap justify-center max-w-xs">
            {questions.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all ${
                  i === current
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : answers[questions[i].id] !== undefined
                    ? "bg-green-500/20 text-green-600 dark:text-green-400"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {current < questions.length - 1 ? (
            <Button onClick={() => setCurrent(current + 1)} className="gap-1.5">
              Next<ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={answeredCount === 0} className="gap-1.5 bg-green-600 hover:bg-green-700">
              <CheckCircle2 className="w-4 h-4" />Finish
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
