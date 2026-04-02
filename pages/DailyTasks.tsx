import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProfileButton from "@/components/ProfileButton";
import {
  ArrowLeft, Zap, Flame, Star, Trophy, BookOpen,
  CheckCircle2, ChevronRight, Target, Brain,
  Award, TrendingUp, Shield, Sparkles,
} from "lucide-react";
import {
  getDailyTasks,
  getMaxDailyPoints,
  getCurrentStreak,
  getTotalPoints,
  DailyTasksState,
  DailyTask,
} from "@/lib/daily-tasks";
import {
  EXAM_LABELS,
  SUBJECT_LABELS,
  Subject,
} from "@/lib/govt-practice-data";
import { isLoggedIn } from "@/lib/auth-api";

// ── Subject accent colours (uses Tailwind opacity so they work in both themes) ─

const SUBJECT_STYLE: Record<string, { accent: string; icon: string; dot: string }> = {
  History:           { accent: "text-amber-600 dark:text-amber-400",   icon: "📜", dot: "bg-amber-500" },
  Geography:         { accent: "text-emerald-600 dark:text-emerald-400", icon: "🌍", dot: "bg-emerald-500" },
  Polity:            { accent: "text-blue-600 dark:text-blue-400",     icon: "⚖️", dot: "bg-blue-500" },
  Reasoning:         { accent: "text-violet-600 dark:text-violet-400", icon: "🧩", dot: "bg-violet-500" },
  Math:              { accent: "text-rose-600 dark:text-rose-400",     icon: "📐", dot: "bg-rose-500" },
  "Current Affairs": { accent: "text-cyan-600 dark:text-cyan-400",    icon: "📰", dot: "bg-cyan-500" },
};
const DEFAULT_STYLE = { accent: "text-muted-foreground", icon: "📝", dot: "bg-muted-foreground" };
function sStyle(s: string) { return SUBJECT_STYLE[s] ?? DEFAULT_STYLE; }

export default function DailyTasks() {
  const navigate = useNavigate();
  const [taskState, setTaskState] = useState<DailyTasksState | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isLoggedIn()) { navigate("/auth", { replace: true }); return; }
    setTaskState(getDailyTasks());
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!taskState) {
    return (
      <div className="min-h-screen bg-background">
        <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
          <div className="container px-4 h-14 flex items-center gap-3 max-w-5xl mx-auto">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />Back
            </Link>
          </div>
        </header>
        <main className="container px-4 py-24 max-w-sm mx-auto text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold mb-2">Set Your Exam First</h1>
            <p className="text-muted-foreground text-sm">To unlock daily tasks, set an upcoming exam target in your profile.</p>
          </div>
          <Link to="/profile">
            <Button className="gap-1.5"><Target className="w-4 h-4" />Go to Profile</Button>
          </Link>
        </main>
      </div>
    );
  }

  const streak         = getCurrentStreak();
  const totalPts       = getTotalPoints();
  const maxDaily       = getMaxDailyPoints(taskState.exam);
  const completedCount = taskState.tasks.filter((t) => t.completed).length;
  const progressPct    = Math.round((completedCount / taskState.tasks.length) * 100);
  const mockTest       = taskState.tasks.find((t) => t.type === "daily_mock_test");
  const quizzes        = taskState.tasks.filter((t) => t.type === "subject_quiz");

  const handleStartMockTest = () => {
    if (!mockTest || mockTest.completed) return;
    navigate(`/mock-test?exam=${encodeURIComponent(taskState.exam)}`);
  };

  const handleStartQuiz = (task: DailyTask) => {
    if (task.completed || !task.subject) return;
    navigate("/govt-practice", { state: { exam: taskState.exam, subject: task.subject, dailyTaskId: task.id } });
  };

  return (
    <div className="min-h-screen bg-background">

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container px-4 h-14 flex items-center gap-3 max-w-5xl mx-auto">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />Back
          </Link>
          <div className="w-px h-4 bg-border" />
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" />
            <span className="text-sm font-semibold">Daily Challenges</span>
          </div>
          <Badge variant="secondary" className="text-xs hidden sm:flex">{EXAM_LABELS[taskState.exam]}</Badge>
          <div className="ml-auto"><ProfileButton /></div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-5xl mx-auto space-y-8">

        {/* ── Hero stats card ──────────────────────────────────────────── */}
        <Card className="border-border/40 overflow-hidden">
          {/* Subtle primary tinted top strip */}
          <div className="h-1.5 w-full bg-gradient-to-r from-primary via-primary/70 to-primary/30" />
          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-start gap-6">

              {/* Left */}
              <div className="flex-1 space-y-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span className="text-xs text-muted-foreground">
                      {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
                    </span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Today's Mission</h1>
                  <p className="text-sm text-muted-foreground mt-1">
                    Complete all tasks to earn <span className="text-primary font-semibold">{maxDaily} XP</span> and keep your streak alive.
                  </p>
                </div>

                {/* Progress */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Daily progress</span>
                    <span className="font-semibold text-foreground">{completedCount}/{taskState.tasks.length} tasks</span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                  <p className="text-xs text-muted-foreground">{taskState.totalPointsEarned} / {maxDaily} XP earned today</p>
                </div>
              </div>

              {/* Right: stat pills */}
              <div className="grid grid-cols-3 sm:grid-cols-1 gap-3 sm:w-44">
                {[
                  { icon: Flame,  val: streak,   label: "Day Streak",  cls: "text-orange-500" },
                  { icon: Trophy, val: totalPts, label: "Total XP",    cls: "text-amber-500" },
                  { icon: Star,   val: `${taskState.totalPointsEarned}/${maxDaily}`, label: "Today's XP", cls: "text-primary" },
                ].map(({ icon: Icon, val, label, cls }) => (
                  <div key={label} className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border/60 bg-muted/30">
                    <Icon className={`w-4 h-4 flex-shrink-0 ${cls}`} />
                    <div className="min-w-0">
                      <p className={`text-base font-bold tabular-nums leading-none ${cls}`}>{val}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5 truncate">{label}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* ── Daily Mock Test ──────────────────────────────────────────── */}
        {mockTest && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-0.5 h-4 rounded-full bg-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Featured Challenge</h2>
            </div>

            <Card
              className={`border-border/40 overflow-hidden transition-all duration-200 ${
                !mockTest.completed ? "hover:border-primary/40 hover:shadow-md cursor-pointer" : "opacity-80"
              }`}
              onClick={!mockTest.completed ? handleStartMockTest : undefined}
            >
              {/* Accent band */}
              <div className={`h-1 w-full ${mockTest.completed ? "bg-green-500" : "bg-primary"}`} />

              <div className="p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    mockTest.completed ? "bg-green-500/10" : "bg-primary/10"
                  }`}>
                    {mockTest.completed
                      ? <CheckCircle2 className="w-6 h-6 text-green-600 dark:text-green-400" />
                      : <Star className="w-6 h-6 text-primary" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-base font-bold">Today's Recommended Paper</h3>
                      <Badge variant="secondary" className="text-xs">{mockTest.points} XP</Badge>
                      {mockTest.completed && (
                        <Badge className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30">Completed</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{mockTest.description}</p>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {[
                        { icon: Brain,      text: "AI Curated" },
                        { icon: Shield,     text: "Exam Pattern" },
                        { icon: TrendingUp, text: "Result Analysis" },
                        { icon: Award,      text: `${mockTest.points} XP` },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/40 text-xs text-muted-foreground">
                          <Icon className="w-3 h-3 text-primary" />
                          {text}
                        </div>
                      ))}
                    </div>

                    {mockTest.completed ? (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        Completed — Score: {mockTest.score ?? 0}%
                      </div>
                    ) : (
                      <Button onClick={handleStartMockTest} className="gap-2">
                        <BookOpen className="w-4 h-4" />
                        Start Mock Test
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {/* ── Subject Quizzes ──────────────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-0.5 h-4 rounded-full bg-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Subject Quizzes</h2>
            <span className="text-xs text-muted-foreground">10 questions each</span>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              {quizzes.filter((q) => q.completed).length}/{quizzes.length} done
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const subj = quiz.subject as Subject;
              const sty  = sStyle(subj);
              return (
                <Card
                  key={quiz.id}
                  onClick={() => handleStartQuiz(quiz)}
                  className={`border-border/40 overflow-hidden transition-all duration-200 ${
                    quiz.completed
                      ? "opacity-75 cursor-default"
                      : "hover:border-primary/40 hover:shadow-md cursor-pointer"
                  }`}
                >
                  {/* Subject accent top line */}
                  <div className={`h-0.5 w-full ${sty.dot}`} />

                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-xl select-none">{sty.icon}</span>
                        <div>
                          <h3 className="font-semibold text-sm leading-snug">{SUBJECT_LABELS[subj] || quiz.label}</h3>
                          <span className={`text-xs font-medium ${sty.accent}`}>{subj}</span>
                        </div>
                      </div>
                      {quiz.completed
                        ? <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        : <Badge variant="outline" className="text-xs flex-shrink-0">{quiz.points} XP</Badge>}
                    </div>

                    <p className="text-xs text-muted-foreground leading-relaxed">{quiz.description}</p>

                    {quiz.completed ? (
                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-muted-foreground">Score</span>
                          <span className={`font-semibold tabular-nums ${
                            (quiz.score ?? 0) >= 70 ? "text-green-600 dark:text-green-400"
                            : (quiz.score ?? 0) >= 40 ? "text-amber-600 dark:text-amber-400"
                            : "text-destructive"
                          }`}>{quiz.score ?? 0}%</span>
                        </div>
                        <Progress value={quiz.score ?? 0} className="h-1.5" />
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:underline">
                        <Sparkles className="w-3 h-3" />
                        Start Quiz
                        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── All done banner ──────────────────────────────────────────── */}
        {progressPct === 100 && (
          <Card className="border-green-500/30 bg-green-500/5 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                <Trophy className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h3 className="font-bold text-base">All Tasks Completed! 🎉</h3>
                <p className="text-sm text-muted-foreground mt-0.5">
                  You earned <span className="text-green-600 dark:text-green-400 font-semibold">{maxDaily} XP</span> today. Come back tomorrow to keep your streak alive!
                </p>
              </div>
            </div>
          </Card>
        )}

      </main>
    </div>
  );
}
