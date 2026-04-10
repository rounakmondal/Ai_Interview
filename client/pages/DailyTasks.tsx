import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProfileButton from "@/components/ProfileButton";
import {
  ArrowLeft, Zap, Flame, Star, Trophy, BookOpen,
  CheckCircle2, ChevronRight, Target, Brain,
  Award, TrendingUp, Shield, Sparkles, Users, Play,
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

// ── Subject accent config ──────────────────────────────────────────────────────

const SUBJECT_STYLE: Record<string, { accent: string; icon: string; dot: string; gradient: string; glow: string; bg: string; badge: string }> = {
  History:           { accent: "text-amber-600 dark:text-amber-400",   icon: "📜", dot: "bg-amber-500",   gradient: "from-amber-500 to-orange-600",   glow: "shadow-amber-500/30",   bg: "bg-amber-500/10",   badge: "border-amber-500/30 text-amber-600 dark:text-amber-400" },
  Geography:         { accent: "text-emerald-600 dark:text-emerald-400", icon: "🌍", dot: "bg-emerald-500", gradient: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/30", bg: "bg-emerald-500/10", badge: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400" },
  Polity:            { accent: "text-blue-600 dark:text-blue-400",     icon: "⚖️", dot: "bg-blue-500",    gradient: "from-orange-500 to-red-500",    glow: "shadow-orange-500/30",    bg: "bg-blue-500/10",    badge: "border-blue-500/30 text-blue-600 dark:text-blue-400" },
  Reasoning:         { accent: "text-orange-600 dark:text-orange-400", icon: "🧩", dot: "bg-orange-500",  gradient: "from-violet-500 to-purple-600",  glow: "shadow-orange-500/30",  bg: "bg-orange-500/10",  badge: "border-orange-500/30 text-orange-600 dark:text-orange-400" },
  Math:              { accent: "text-rose-600 dark:text-rose-400",     icon: "📐", dot: "bg-rose-500",    gradient: "from-rose-500 to-pink-600",      glow: "shadow-rose-500/30",    bg: "bg-rose-500/10",    badge: "border-rose-500/30 text-rose-600 dark:text-rose-400" },
  "Current Affairs": { accent: "text-cyan-600 dark:text-cyan-400",    icon: "📰", dot: "bg-cyan-500",    gradient: "from-cyan-500 to-sky-600",       glow: "shadow-cyan-500/30",    bg: "bg-cyan-500/10",    badge: "border-cyan-500/30 text-cyan-600 dark:text-cyan-400" },
};
const DEFAULT_STYLE = { accent: "text-muted-foreground", icon: "📝", dot: "bg-muted-foreground", gradient: "from-gray-500 to-gray-600", glow: "shadow-gray-500/30", bg: "bg-gray-500/10", badge: "border-gray-500/30 text-gray-600" };
function sStyle(s: string) { return SUBJECT_STYLE[s] ?? DEFAULT_STYLE; }

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

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
          <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
            <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />Back
            </Link>
          </div>
        </header>
        <main className="max-w-sm mx-auto px-4 py-24 text-center space-y-6">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center">
              <Target className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold mb-2 mt-4">Set Your Exam First</h1>
            <p className="text-muted-foreground text-sm">Set your upcoming exam in your profile to unlock daily tasks.</p>
          </motion.div>
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

      {/* ── Ambient background ───────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* ── Header ──────────────────────────────────────────────────────── */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
          <span className="text-sm font-semibold text-foreground">Daily Challenge</span>

          <div className="ml-auto flex items-center gap-2">
            <ProfileButton />
            <Link to="/govt-practice">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 text-xs font-medium transition-all">
                <Play className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Full Exam Test</span>
              </motion.button>
            </Link>
            <Link to="/govt-practice">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:border-border text-xs font-medium transition-all">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Question Bank</span>
              </motion.button>
            </Link>
            <Link to="/leaderboard">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-all">
                <Trophy className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Leaderboard</span>
              </motion.button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 pb-16">

        {/* ── Hero ──────────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: smoothEase }} className="text-center mb-8">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-semibold mb-4">
            <Flame className="w-3.5 h-3.5" />
            {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })} — {EXAM_LABELS[taskState.exam]}
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
            Today's{"\ "}
            <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500 bg-clip-text text-transparent">
              Mission
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed">
            Practice every day, grow your streak — complete all tasks and earn <span className="text-primary font-semibold">{maxDaily} XP</span>.
          </p>
        </motion.div>

        {/* ── Quick stats bar ───────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: smoothEase }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {[
            { icon: <Flame className="w-4 h-4" />,  label: "Streak",    value: `${streak} days`, color: "text-orange-500" },
            { icon: <Trophy className="w-4 h-4" />,  label: "Total XP",  value: `${totalPts}`,    color: "text-amber-500" },
            { icon: <Star className="w-4 h-4" />,    label: "Today's XP", value: `${taskState.totalPointsEarned}/${maxDaily}`, color: "text-primary" },
            { icon: <Users className="w-4 h-4" />,   label: "Completed",  value: `${completedCount}/${taskState.tasks.length}`, color: "text-emerald-500" },
          ].map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 + i * 0.05 }}
              className="bg-card border border-border/50 rounded-xl px-4 py-3 flex items-center gap-2.5">
              <div className={`${s.color} flex-shrink-0`}>{s.icon}</div>
              <div>
                <p className="text-xs font-bold text-foreground leading-none">{s.value}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── Progress Card ──────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: smoothEase }}
          className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-lg shadow-black/5 mb-8">
          {/* Gradient top strip */}
          <div className="h-1 w-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
          <div className="p-5 sm:p-6">
            <div className="flex items-center gap-2 mb-3">
              <Target className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">Daily Progress</p>
              <span className="text-xs text-muted-foreground ml-auto font-medium">{progressPct}%</span>
            </div>
            <Progress value={progressPct} className="h-2.5 mb-2" />
            <p className="text-xs text-muted-foreground">{taskState.totalPointsEarned} / {maxDaily} XP earned today</p>
          </div>
        </motion.div>

        {/* ── Daily Mock Test — Featured Challenge ────────────────────── */}
        {mockTest && (
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.6, ease: smoothEase }} className="mb-8">

            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground">1</div>
              <p className="text-sm font-semibold text-foreground">Today's Recommended Paper</p>
              {mockTest.completed && (
                <Badge className="text-xs bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/30 ml-auto">Done ✓</Badge>
              )}
            </div>

            <motion.div
              whileHover={!mockTest.completed ? { y: -2 } : {}}
              whileTap={!mockTest.completed ? { scale: 0.99 } : {}}
              onClick={!mockTest.completed ? handleStartMockTest : undefined}
              className={`bg-card border border-border/50 rounded-2xl overflow-hidden shadow-lg shadow-black/5 transition-all ${
                !mockTest.completed ? "cursor-pointer hover:border-primary/40 hover:shadow-xl" : "opacity-80"
              }`}>

              <div className={`h-1 w-full ${mockTest.completed ? "bg-green-500" : "bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500"}`} />

              <div className="p-6 sm:p-8">
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    mockTest.completed ? "bg-green-500/10" : "bg-gradient-to-br from-orange-500/10 to-amber-500/10 border border-orange-500/20"
                  }`}>
                    {mockTest.completed
                      ? <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                      : <Star className="w-7 h-7 text-amber-500" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="text-lg font-bold">Daily Mock Test</h3>
                      <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-600 dark:text-amber-400">
                        <Zap className="w-3 h-3" />{mockTest.points} XP
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">{mockTest.description}</p>

                    {/* Feature chips */}
                    <div className="flex flex-wrap gap-2 mb-5">
                      {[
                        { icon: Brain,      text: "AI-generated" },
                        { icon: Shield,     text: "Exam pattern" },
                        { icon: TrendingUp, text: "Result analysis" },
                        { icon: BookOpen,   text: `${mockTest.questionCount} questions` },
                      ].map(({ icon: Icon, text }) => (
                        <div key={text} className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-muted/60 border border-border/40 text-xs text-muted-foreground">
                          <Icon className="w-3 h-3 text-amber-500" />
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
                      <motion.button
                        onClick={handleStartMockTest}
                        whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                        className="relative h-11 px-6 rounded-xl font-bold text-sm text-white overflow-hidden flex items-center gap-2 shadow-lg shadow-amber-500/20">
                        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-500" />
                        <span className="relative flex items-center gap-2">
                          <BookOpen className="w-4 h-4" />
                          Start Mock Test
                          <ChevronRight className="w-4 h-4" />
                        </span>
                      </motion.button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* ── Subject Quizzes ──────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6, ease: smoothEase }}>

          <div className="flex items-center gap-2 mb-5">
              <div className="w-6 h-6 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground">2</div>
            <p className="text-sm font-semibold text-foreground">Subject Quizzes</p>
            <span className="text-xs text-muted-foreground">10 questions each</span>
            <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
              <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
              {quizzes.filter((q) => q.completed).length}/{quizzes.length} done
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quizzes.map((quiz, i) => {
              const subj = quiz.subject as Subject;
              const sty  = sStyle(subj);
              return (
                <motion.div
                  key={quiz.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.45 + i * 0.05 }}
                  whileHover={!quiz.completed ? { y: -3, scale: 1.01 } : {}}
                  whileTap={!quiz.completed ? { scale: 0.98 } : {}}
                  onClick={() => handleStartQuiz(quiz)}
                  className={`bg-card border border-border/50 rounded-xl overflow-hidden transition-all duration-200 ${
                    quiz.completed
                      ? "opacity-75 cursor-default"
                      : "cursor-pointer hover:border-primary/30 hover:shadow-lg"
                  }`}
                >
                  {/* Subject gradient top line */}
                  <div className={`h-1 w-full bg-gradient-to-r ${sty.gradient}`} />

                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-9 h-9 rounded-lg ${sty.bg} border ${sty.badge.split(' ')[0]} flex items-center justify-center`}>
                          <span className="text-lg select-none">{sty.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-sm leading-snug">{SUBJECT_LABELS[subj] || quiz.label}</h3>
                          <span className={`text-xs font-medium ${sty.accent}`}>{subj}</span>
                        </div>
                      </div>
                      {quiz.completed ? (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                          <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0 mt-0.5" />
                        </motion.div>
                      ) : (
                        <span className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${sty.badge}`}>
                          <Zap className="w-2.5 h-2.5" />{quiz.points} XP
                        </span>
                      )}
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
                      <div className={`flex items-center gap-1.5 text-xs font-semibold ${sty.accent}`}>
                        <Sparkles className="w-3 h-3" />
                        Start Quiz
                        <ChevronRight className="w-3.5 h-3.5 ml-auto" />
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* ── Quick Access Grid ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease: smoothEase }}
          className="mt-8 grid grid-cols-3 gap-3">
          {[
            { label: "Question Bank", sub: "By subject", icon: BookOpen, to: "/govt-practice", color: "from-orange-500/10 to-red-500/10 border-blue-500/20 hover:border-blue-500/40", icon_color: "text-blue-500" },
            { label: "Mock Test", sub: "Full practice test", icon: Target, to: "/question-hub", color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/40", icon_color: "text-amber-500" },
            { label: "Leaderboard", sub: "Top scorers", icon: Trophy, to: "/leaderboard", color: "from-orange-500/10 to-purple-500/10 border-orange-500/20 hover:border-orange-500/40", icon_color: "text-orange-500" },
          ].map((item) => (
            <Link key={item.to} to={item.to}>
              <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}
                className={`bg-gradient-to-br ${item.color} border rounded-xl p-4 text-center cursor-pointer transition-all h-full`}>
                <item.icon className={`w-6 h-6 mx-auto mb-2 ${item.icon_color}`} />
                <p className="text-xs font-bold text-foreground leading-tight">{item.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">{item.sub}</p>
              </motion.div>
            </Link>
          ))}
        </motion.div>

        {/* ── All done celebration ─────────────────────────────────────── */}
        <AnimatePresence>
          {progressPct === 100 && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: smoothEase }}
              className="mt-8 rounded-2xl border border-green-500/30 bg-gradient-to-br from-green-500/5 to-emerald-500/5 overflow-hidden shadow-lg shadow-green-500/10">
              <div className="h-1 w-full bg-gradient-to-r from-green-500 to-emerald-500" />
              <div className="p-6 flex items-center gap-4">
                <div className="w-14 h-14 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-7 h-7 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">All tasks done! 🎉</h3>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    You earned <span className="text-green-600 dark:text-green-400 font-semibold">{maxDaily} XP</span> today. Come back tomorrow to keep your streak!
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Motivational bottom strip ─────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-8 rounded-2xl border border-border/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900/60 dark:to-slate-900/60 p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-white">You are building your future today 🚀</p>
            <p className="text-xs text-slate-400 mt-0.5">Consistent daily practice is the biggest key to success in government exams. Even 30 minutes a day makes a massive difference.</p>
          </div>
          <Link to="/govt-practice" className="flex-shrink-0 ml-auto hidden sm:block">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 transition-colors">
              Start Practising
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
