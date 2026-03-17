import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProfileButton from "@/components/ProfileButton";
import {
  ArrowLeft,
  Zap,
  Flame,
  Star,
  Trophy,
  BookOpen,
  CheckCircle2,
  Clock,
  ChevronRight,
  Target,
  Sparkles,
} from "lucide-react";
import {
  getDailyTasks,
  getMaxDailyPoints,
  getCurrentStreak,
  getTotalPoints,
  getWeeklyProgress,
  getExamSubjects,
  DailyTasksState,
  DailyTask,
} from "@/lib/daily-tasks";
import {
  ExamType,
  EXAM_LABELS,
  SUBJECT_LABELS,
  Subject,
  fetchQuestions,
} from "@/lib/govt-practice-data";
import { fetchDailyRecommendedQuestions } from "@/lib/daily-tasks";
import { isLoggedIn } from "@/lib/auth-api";

const subjectColor: Record<Subject, string> = {
  History: "from-amber-500 to-orange-500",
  Geography: "from-green-500 to-emerald-500",
  Polity: "from-blue-500 to-indigo-500",
  Reasoning: "from-purple-500 to-violet-500",
  Math: "from-red-500 to-pink-500",
  "Current Affairs": "from-cyan-500 to-teal-500",
};

const subjectIcon: Record<Subject, string> = {
  History: "📜",
  Geography: "🌍",
  Polity: "⚖️",
  Reasoning: "🧩",
  Math: "📐",
  "Current Affairs": "📰",
};

export default function DailyTasks() {
  const navigate = useNavigate();
  const [taskState, setTaskState] = useState<DailyTasksState | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingTask, setLoadingTask] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/auth", { replace: true });
      return;
    }
    const state = getDailyTasks();
    setTaskState(state);
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
          <div className="container px-4 h-14 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Home
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="text-sm font-medium">Daily Tasks</span>
          </div>
        </header>
        <main className="container px-4 py-16 max-w-lg mx-auto text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
            <Target className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold">Set Your Exam First</h1>
          <p className="text-muted-foreground">To unlock daily tasks, set an upcoming exam target in your profile.</p>
          <Link to="/profile">
            <Button className="gap-1.5 mt-2">
              <Target className="w-4 h-4" />
              Go to Profile
            </Button>
          </Link>
        </main>
      </div>
    );
  }

  const streak = getCurrentStreak();
  const totalPts = getTotalPoints();
  const maxDaily = getMaxDailyPoints(taskState.exam);
  const completedCount = taskState.tasks.filter((t) => t.completed).length;
  const progressPct = Math.round((completedCount / taskState.tasks.length) * 100);
  const weeklyData = getWeeklyProgress();

  const mockTest = taskState.tasks.find((t) => t.type === "daily_mock_test");
  const quizzes = taskState.tasks.filter((t) => t.type === "subject_quiz");

  const handleStartMockTest = async () => {
    if (!mockTest || mockTest.completed) return;
    setLoadingTask(mockTest.id);
    try {
      const questions = await fetchDailyRecommendedQuestions(taskState.exam);
      navigate("/govt-test", {
        state: {
          config: {
            exam: taskState.exam,
            subject: "History" as const,
            difficulty: "Medium" as const,
            count: 50,
          },
          questions,
          language: "english",
          dailyTaskId: mockTest.id,
        },
      });
    } catch {
      // Fallback: fetch normally
      const questions = await fetchQuestions({
        exam: taskState.exam,
        subject: "History",
        difficulty: "Medium",
        count: 50,
      });
      navigate("/govt-test", {
        state: {
          config: {
            exam: taskState.exam,
            subject: "History" as const,
            difficulty: "Medium" as const,
            count: 50,
          },
          questions,
          language: "english",
          dailyTaskId: mockTest.id,
        },
      });
    } finally {
      setLoadingTask(null);
    }
  };

  const handleStartQuiz = (task: DailyTask) => {
    if (task.completed || !task.subject) return;
    navigate("/govt-practice", {
      state: {
        exam: taskState.exam,
        subject: task.subject,
        dailyTaskId: task.id,
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Daily Tasks</span>
          <div className="ml-auto flex items-center gap-2">
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="container px-4 py-8 max-w-4xl mx-auto space-y-8">

        {/* ── Hero Stats ───────────────────────────────────────── */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">Daily Challenges</h1>
              <p className="text-muted-foreground text-sm mt-1">
                {EXAM_LABELS[taskState.exam]} — {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}
              </p>
            </div>
            <Badge variant="secondary" className="text-sm gap-1.5 px-3 py-1.5">
              <Flame className="w-4 h-4 text-orange-500" />
              {streak} day streak
            </Badge>
          </div>

          {/* Progress bar + stats */}
          <Card className="p-5 border-border/40">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium">Today's Progress</span>
              <span className="text-sm text-muted-foreground">
                {completedCount}/{taskState.tasks.length} tasks · {taskState.totalPointsEarned}/{maxDaily} pts
              </span>
            </div>
            <Progress value={progressPct} className="h-2.5 mb-4" />
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-xl font-bold text-primary">{taskState.totalPointsEarned}</p>
                <p className="text-xs text-muted-foreground">Today's XP</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{totalPts}</p>
                <p className="text-xs text-muted-foreground">Total XP</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-orange-500">{streak}</p>
                <p className="text-xs text-muted-foreground">Day Streak</p>
              </div>
            </div>
          </Card>
        </div>

        {/* ── Weekly activity ──────────────────────────────────── */}
        <Card className="p-5 border-border/40">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4 text-primary" />
            <h2 className="text-sm font-bold">This Week</h2>
          </div>
          <div className="flex items-end gap-1.5 h-16">
            {weeklyData.map((d) => {
              const max = getMaxDailyPoints(taskState.exam);
              const pct = max > 0 ? Math.round((d.points / max) * 100) : 0;
              const height = Math.max(pct, 4);
              const isToday = d.date === new Date().toISOString().split("T")[0];
              return (
                <div key={d.date} className="flex-1 flex flex-col items-center gap-1 group">
                  <span className="text-[10px] text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                    {d.points}pts
                  </span>
                  <div
                    className={`w-full rounded-t-md transition-all ${
                      isToday ? "bg-primary" : d.points > 0 ? "bg-primary/40" : "bg-muted"
                    }`}
                    style={{ height: `${height}%` }}
                  />
                  <span className={`text-[9px] ${isToday ? "font-bold text-primary" : "text-muted-foreground"}`}>
                    {new Date(d.date).toLocaleDateString("en", { weekday: "narrow" })}
                  </span>
                </div>
              );
            })}
          </div>
        </Card>

        {/* ── Daily Mock Test ──────────────────────────────────── */}
        {mockTest && (
          <Card className={`p-6 border-border/40 relative overflow-hidden ${mockTest.completed ? "opacity-75" : ""}`}>
            {mockTest.completed && (
              <div className="absolute top-3 right-3">
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              </div>
            )}
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center flex-shrink-0">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-lg font-bold">Today's Recommended Paper</h2>
                  <Badge variant="secondary" className="text-xs">{mockTest.points} XP</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-4">{mockTest.description}</p>

                {mockTest.completed ? (
                  <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                    <CheckCircle2 className="w-4 h-4" />
                    Completed — Score: {mockTest.score ?? 0}%
                  </div>
                ) : (
                  <Button
                    onClick={handleStartMockTest}
                    disabled={loadingTask === mockTest.id}
                    className="gap-1.5"
                  >
                    {loadingTask === mockTest.id ? (
                      <>
                        <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                        Loading Questions...
                      </>
                    ) : (
                      <>
                        <BookOpen className="w-4 h-4" />
                        Start Mock Test ({mockTest.questionCount} Qs)
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        )}

        {/* ── Subject Quizzes ──────────────────────────────────── */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Zap className="w-5 h-5 text-primary" />
            <h2 className="text-lg font-bold">Subject Quizzes</h2>
            <span className="text-sm text-muted-foreground ml-1">10 questions each</span>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const subj = quiz.subject as Subject;
              const gradient = subjectColor[subj] ?? "from-gray-500 to-gray-600";
              const icon = subjectIcon[subj] ?? "📝";
              return (
                <Card
                  key={quiz.id}
                  className={`p-5 border-border/40 cursor-pointer transition-all hover:shadow-md ${
                    quiz.completed ? "opacity-75" : "hover:border-primary/30"
                  }`}
                  onClick={() => handleStartQuiz(quiz)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-lg`}>
                      {icon}
                    </div>
                    {quiz.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Badge variant="outline" className="text-xs">{quiz.points} XP</Badge>
                    )}
                  </div>
                  <h3 className="font-semibold text-sm mb-1">{SUBJECT_LABELS[subj] || quiz.label}</h3>
                  <p className="text-xs text-muted-foreground mb-3">{quiz.description}</p>

                  {quiz.completed ? (
                    <div className="flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                      <CheckCircle2 className="w-3 h-3" />
                      Done — {quiz.score ?? 0}%
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-xs text-primary font-medium">
                      Start Quiz <ChevronRight className="w-3 h-3" />
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
