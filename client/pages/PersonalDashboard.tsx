import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageSEO } from "@/lib/page-seo";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/auth-api";
import {
  fetchPersonalizedAnalysis,
  generateWeakAreaTest,
  sendWeakAreaEmail,
  saveDailyTarget,
  LEVEL_COLORS,
  LEVEL_BAR_COLORS,
  SUBJECT_ICONS,
  type DashboardAnalysis,
  type SubjectPerformance,
  type WeakArea,
  type PerformanceLevel,
} from "@/lib/personal-dashboard-api";
import {
  ArrowLeft,
  Brain,
  Target,
  TrendingUp,
  Zap,
  Mail,
  Play,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Minus,
  BarChart3,
  Loader2,
  Settings,
  BookOpen,
  Trophy,
  Calendar,
  ChevronRight,
  Sparkles,
  Lock,
  Globe,
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────

function LevelBadge({ level }: { level: PerformanceLevel }) {
  const icon =
    level === "Weak" ? <AlertTriangle className="w-3 h-3" /> :
    level === "Average" ? <Minus className="w-3 h-3" /> :
    level === "Strong" ? <CheckCircle2 className="w-3 h-3" /> :
    null;
  return (
    <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full border ${LEVEL_COLORS[level]}`}>
      {icon}
      {level}
    </span>
  );
}

function difficultyForLevel(level: PerformanceLevel): "Easy" | "Medium" | "Hard" {
  if (level === "Weak") return "Easy";
  if (level === "Average") return "Medium";
  return "Hard";
}

function Section({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-[#e5e7eb] dark:border-[#1f2937] bg-white dark:bg-[#111827] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)] ${className}`}>
      {children}
    </div>
  );
}

// ── Subject Card ──────────────────────────────────────────────────────────────

function SubjectCard({
  perf,
  onStartTest,
  generatingSubject,
}: {
  perf: SubjectPerformance;
  onStartTest: (subject: string, difficulty: "Easy" | "Medium" | "Hard") => void;
  generatingSubject: string | null;
}) {
  const diff = difficultyForLevel(perf.level);
  const isGenerating = generatingSubject === perf.topic;
  const hasData = perf.accuracy !== null;

  return (
    <div className="flex flex-col gap-2 p-4 rounded-xl border border-[#e5e7eb] dark:border-[#1f2937] bg-[#fafafa] dark:bg-[#0d1117]">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl" role="img" aria-label={perf.topic}>{SUBJECT_ICONS[perf.topic] ?? "📚"}</span>
          <div>
            <p className="text-[13px] font-semibold text-[#111827] dark:text-white">{perf.topic}</p>
            {perf.lastAttempt && (
              <p className="text-[11px] text-[#9ca3af]">
                Last: {new Date(perf.lastAttempt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
              </p>
            )}
          </div>
        </div>
        <LevelBadge level={perf.level} />
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        {hasData ? (
          <>
            <div className="flex justify-between text-[11px] text-[#6b7280]">
              <span>Accuracy</span>
              <span className="font-semibold">{perf.accuracy}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#e5e7eb] dark:bg-[#1f2937] overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${LEVEL_BAR_COLORS[perf.level]}`}
                style={{ width: `${perf.accuracy}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#9ca3af]">
              <span>{perf.correctAnswers}/{perf.totalQuestions} correct</span>
              <span>{perf.attempts} test{perf.attempts !== 1 ? "s" : ""}</span>
            </div>
          </>
        ) : (
          <p className="text-[12px] text-[#9ca3af] italic">No attempts yet — take a test to track progress</p>
        )}
      </div>

      {/* Action button */}
      <Button
        size="sm"
        variant={perf.level === "Weak" ? "default" : "outline"}
        className={`mt-1 h-8 text-[12px] w-full gap-1.5 ${perf.level === "Weak" ? "bg-red-500 hover:bg-red-600 border-0 text-white" : ""}`}
        disabled={isGenerating}
        onClick={() => onStartTest(perf.topic, diff)}
      >
        {isGenerating ? (
          <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…</>
        ) : (
          <><Play className="w-3 h-3" /> {diff} Test</>
        )}
      </Button>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────────

export default function PersonalDashboard() {
  usePageSEO("/personal-dashboard");
  const navigate = useNavigate();
  const { toast } = useToast();

  // Read language preference set in Profile
  const LANG_KEY = "interview-ai-language";
  const [questionLang, setQuestionLang] = useState<"en" | "bn">(() => {
    const stored = localStorage.getItem(LANG_KEY);
    return stored === "bn" ? "bn" : "en";
  });
  const handleLangChange = (lang: "en" | "bn") => {
    setQuestionLang(lang);
    localStorage.setItem(LANG_KEY, lang);
    toast({ title: lang === "bn" ? "ভাষা: বাংলা ✓" : "Language: English ✓" });
  };

  const [data, setData]                       = useState<DashboardAnalysis | null>(null);
  const [loading, setLoading]                 = useState(true);
  const [refreshing, setRefreshing]           = useState(false);
  const [generatingSubject, setGenerating]    = useState<string | null>(null);
  const [sendingEmail, setSendingEmail]        = useState(false);
  const [targetInput, setTargetInput]         = useState("10");
  const [editingTarget, setEditingTarget]     = useState(false);
  const [savingTarget, setSavingTarget]       = useState(false);

  // Guard: must be logged in
  useEffect(() => {
    if (!getSession()) {
      navigate("/auth", { replace: true, state: { redirect: "/dashboard" } });
    }
  }, [navigate]);

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    else setRefreshing(true);

    const result = await fetchPersonalizedAnalysis();
    if (result?.success) {
      setData(result);
      setTargetInput(String(result.todayProgress.target));
    }
    setLoading(false);
    setRefreshing(false);
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Start weak-area test ────────────────────────────────────────────────────

  const handleStartTest = async (subject: string, difficulty: "Easy" | "Medium" | "Hard") => {
    setGenerating(subject);
    const result = await generateWeakAreaTest(subject, difficulty, 10, "WBCS", questionLang);
    setGenerating(null);

    if (!result?.success || !result.questions.length) {
      toast({ title: "Failed to generate test", description: "Please try again.", variant: "destructive" });
      return;
    }

    // Transform to GovtQuestion format for GovtTest page
    const questions = result.questions.map((q) => ({
      id:           q.id,
      exam:         q.exam as any,
      subject:      q.subject as any,
      difficulty:   q.difficulty as any,
      question:     q.question,
      options:      q.options as [string, string, string, string],
      correctIndex: q.correctIndex,
      explanation:  q.explanation,
    }));

    const config = {
      exam:       result.questions[0]?.exam ?? "WBCS",
      subject:    subject as any,
      difficulty,
      count:      10 as const,
      language:   "english" as const,
    };

    navigate("/govt-test", { state: { config, questions, language: "english" } });
  };

  // ── Send email report ───────────────────────────────────────────────────────

  const handleSendEmail = async () => {
    if (!data?.aiAnalysis) {
      toast({ title: "No analysis data", description: "Complete at least one test first.", variant: "destructive" });
      return;
    }
    setSendingEmail(true);
    const result = await sendWeakAreaEmail(
      data.aiAnalysis.weakAreas,
      data.aiAnalysis.recommendedAction,
      data.aiAnalysis.message,
    );
    setSendingEmail(false);
    if (result?.success) {
      toast({ title: "Report sent! 📧", description: result.message });
    } else {
      toast({ title: "Failed to send email", variant: "destructive" });
    }
  };

  // ── Save daily target ───────────────────────────────────────────────────────

  const handleSaveTarget = async () => {
    const t = Math.max(1, Math.min(200, Number(targetInput) || 10));
    setSavingTarget(true);
    const ok = await saveDailyTarget(t);
    setSavingTarget(false);
    setEditingTarget(false);
    if (ok) {
      toast({ title: `Daily target set: ${t} questions` });
      load(true);
    } else {
      toast({ title: "Failed to save target", variant: "destructive" });
    }
  };

  // ── Derived values ──────────────────────────────────────────────────────────

  const todayPct = data
    ? Math.min(100, Math.round((data.todayProgress.attempted / data.todayProgress.target) * 100))
    : 0;

  const weakSubjects  = data?.performance.filter(p => p.level === "Weak") ?? [];
  const avgSubjects   = data?.performance.filter(p => p.level === "Average") ?? [];
  const strongSubjects = data?.performance.filter(p => p.level === "Strong") ?? [];
  const noDataSubjects = data?.performance.filter(p => p.level === "No Data") ?? [];

  const overallAccuracy = data?.performance
    .filter(p => p.accuracy !== null)
    .reduce((acc, p, _, arr) => acc + (p.accuracy! / arr.length), 0) ?? null;

  // ── Loading state ───────────────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0d1117] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center animate-pulse">
            <Brain className="w-5 h-5 text-white" />
          </div>
          <p className="text-[13px] text-[#6b7280]">Analysing your performance…</p>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0d1117]">

      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-[#e5e7eb] dark:border-[#1f2937]">
        <div className="max-w-5xl mx-auto px-4 sm:px-5 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0">
            <Link
              to="/profile"
              className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white transition-colors flex-shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Profile</span>
            </Link>
            <span className="text-[#d1d5db] dark:text-[#374151] mx-0.5 flex-shrink-0 hidden sm:inline">/</span>
            <span className="text-[13px] font-medium text-[#111827] dark:text-white truncate">
              <span className="hidden sm:inline">Personalized </span>Dashboard
            </span>
          </div>
          <div className="flex items-center gap-3">
            {/* Language switcher */}
            <div className="flex items-center gap-1 bg-[#f3f4f6] dark:bg-[#1f2937] rounded-lg p-0.5">
              {([
                { value: "en" as const, label: "EN", title: "English" },
                { value: "bn" as const, label: "বাং", title: "Bengali" },
              ]).map(({ value, label, title }) => (
                <button
                  key={value}
                  title={title}
                  onClick={() => handleLangChange(value)}
                  className={`px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all ${
                    questionLang === value
                      ? "bg-white dark:bg-[#111827] text-violet-700 dark:text-violet-300 shadow-sm"
                      : "text-[#6b7280] hover:text-[#374151] dark:hover:text-[#d1d5db]"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={() => load(true)}
              disabled={refreshing}
              className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-5 py-8 space-y-6">

        {/* ── AI Analysis Banner ───────────────────────────────────────── */}
        {data?.aiAnalysis && (
          <Section>
            <div className="h-1 w-full rounded-t-2xl bg-gradient-to-r from-violet-500 to-indigo-500" />
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-100 to-indigo-100 dark:from-violet-950/40 dark:to-indigo-950/40 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4.5 h-4.5 text-violet-600 dark:text-violet-400" />
                  </div>
                  <div>
                    <h2 className="text-[15px] font-semibold text-[#111827] dark:text-white mb-0.5">AI Tutor Insight</h2>
                    <p className="text-[13px] text-[#6b7280] leading-relaxed">{data.aiAnalysis.message}</p>
                    {data.aiAnalysis.recommendedAction && (
                      <div className="mt-3 inline-flex items-center gap-1.5 text-[12px] font-medium text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 px-3 py-1.5 rounded-full">
                        <Target className="w-3 h-3" />
                        {data.aiAnalysis.recommendedAction}
                      </div>
                    )}
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-shrink-0 h-8 text-[12px] gap-1.5"
                  disabled={sendingEmail}
                  onClick={handleSendEmail}
                >
                  {sendingEmail ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Mail className="w-3.5 h-3.5" />
                  )}
                  Email Report
                </Button>
              </div>
            </div>
          </Section>
        )}

        {/* ── Overview Stats ───────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Overall Accuracy",
              value: overallAccuracy !== null ? `${Math.round(overallAccuracy)}%` : "—",
              icon: BarChart3,
              color: "text-blue-600",
              bg: "bg-blue-50 dark:bg-blue-950/20",
            },
            {
              label: "Weak Subjects",
              value: String(weakSubjects.length),
              icon: AlertTriangle,
              color: "text-red-500",
              bg: "bg-red-50 dark:bg-red-950/20",
            },
            {
              label: "Strong Subjects",
              value: String(strongSubjects.length),
              icon: Trophy,
              color: "text-emerald-600",
              bg: "bg-emerald-50 dark:bg-emerald-950/20",
            },
            {
              label: "Today's Progress",
              value: `${data?.todayProgress.attempted ?? 0}/${data?.todayProgress.target ?? 10}`,
              icon: Target,
              color: "text-amber-600",
              bg: "bg-amber-50 dark:bg-amber-950/20",
            },
          ].map(({ label, value, icon: Icon, color, bg }) => (
            <Section key={label}>
              <div className="p-4 flex flex-col gap-2">
                <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center`}>
                  <Icon className={`w-4 h-4 ${color}`} />
                </div>
                <p className="text-[18px] font-bold text-[#111827] dark:text-white leading-none">{value}</p>
                <p className="text-[11px] text-[#6b7280]">{label}</p>
              </div>
            </Section>
          ))}
        </div>

        {/* ── Daily Target ─────────────────────────────────────────────── */}
        <Section>
          <div className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#6b7280]" />
                <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white">Today's Target</h2>
              </div>
              <button
                onClick={() => setEditingTarget(e => !e)}
                className="text-[12px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white flex items-center gap-1 transition-colors"
              >
                <Settings className="w-3.5 h-3.5" />
                Edit
              </button>
            </div>

            {editingTarget && (
              <div className="flex items-center gap-2 mb-4">
                <input
                  type="number"
                  min={1}
                  max={200}
                  value={targetInput}
                  onChange={e => setTargetInput(e.target.value)}
                  className="w-20 h-8 text-[13px] text-center rounded-lg border border-[#d1d5db] dark:border-[#374151] bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500"
                />
                <span className="text-[12px] text-[#6b7280]">questions/day</span>
                <Button size="sm" className="h-8 text-[12px]" disabled={savingTarget} onClick={handleSaveTarget}>
                  {savingTarget ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between text-[12px]">
                <span className="text-[#6b7280]">
                  {data?.todayProgress.attempted ?? 0} of {data?.todayProgress.target ?? 10} questions
                </span>
                <span className={`font-semibold ${todayPct >= 100 ? "text-emerald-600" : "text-[#6b7280]"}`}>
                  {todayPct >= 100 ? "✓ Completed!" : `${todayPct}%`}
                </span>
              </div>
              <Progress value={todayPct} className="h-2.5" />
              {todayPct < 100 && (
                <p className="text-[11px] text-[#9ca3af]">
                  {(data?.todayProgress.target ?? 10) - (data?.todayProgress.attempted ?? 0)} more questions to reach your goal
                </p>
              )}
            </div>
          </div>
        </Section>

        {/* ── Weak Areas (priority) ────────────────────────────────────── */}
        {weakSubjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white">Weak Areas — Practice First</h2>
              <Badge variant="destructive" className="text-[11px] h-5">{weakSubjects.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {weakSubjects.map(p => (
                <SubjectCard
                  key={p.topic}
                  perf={p}
                  onStartTest={handleStartTest}
                  generatingSubject={generatingSubject}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Average Areas ────────────────────────────────────────────── */}
        {avgSubjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-amber-500" />
              <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white">Average Areas — Room to Improve</h2>
              <Badge className="text-[11px] h-5 bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-400 border-0">{avgSubjects.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {avgSubjects.map(p => (
                <SubjectCard
                  key={p.topic}
                  perf={p}
                  onStartTest={handleStartTest}
                  generatingSubject={generatingSubject}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── Strong Areas ─────────────────────────────────────────────── */}
        {strongSubjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="w-4 h-4 text-emerald-500" />
              <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white">Strong Areas — Keep It Up</h2>
              <Badge className="text-[11px] h-5 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-400 border-0">{strongSubjects.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {strongSubjects.map(p => (
                <SubjectCard
                  key={p.topic}
                  perf={p}
                  onStartTest={handleStartTest}
                  generatingSubject={generatingSubject}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── No Data Subjects ─────────────────────────────────────────── */}
        {noDataSubjects.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-[#9ca3af]" />
              <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white">Never Attempted</h2>
              <Badge variant="outline" className="text-[11px] h-5">{noDataSubjects.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {noDataSubjects.map(p => (
                <SubjectCard
                  key={p.topic}
                  perf={p}
                  onStartTest={handleStartTest}
                  generatingSubject={generatingSubject}
                />
              ))}
            </div>
          </div>
        )}

        {/* ── No data at all ───────────────────────────────────────────── */}
        {!loading && (weakSubjects.length + avgSubjects.length + strongSubjects.length + noDataSubjects.length) === 0 && (
          <Section>
            <div className="p-12 flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-[#f3f4f6] dark:bg-[#1f2937] flex items-center justify-center">
                <Brain className="w-7 h-7 text-[#9ca3af]" />
              </div>
              <h3 className="text-[15px] font-semibold text-[#111827] dark:text-white">No performance data yet</h3>
              <p className="text-[13px] text-[#6b7280] max-w-xs">
                Complete a few practice tests to unlock your personalized weak-area analysis and targeted tests.
              </p>
              <Button asChild className="mt-2 h-9 text-[13px]">
                <Link to="/govt-practice">
                  <Play className="w-3.5 h-3.5 mr-1.5" />
                  Start Practising
                </Link>
              </Button>
            </div>
          </Section>
        )}

        {/* ── Quick actions ────────────────────────────────────────────── */}
        <Section>
          <div className="p-5">
            <h2 className="text-[14px] font-semibold text-[#111827] dark:text-white mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                {
                  label:  "Full Mock Test",
                  desc:   "Timed full paper across all subjects",
                  icon:   Zap,
                  color:  "text-violet-600",
                  bg:     "bg-violet-50 dark:bg-violet-950/20",
                  href:   "/govt-practice",
                },
                {
                  label:  "Previous Year Papers",
                  desc:   "Practice with real exam questions",
                  icon:   BookOpen,
                  color:  "text-blue-600",
                  bg:     "bg-blue-50 dark:bg-blue-950/20",
                  href:   "/previous-year",
                },
                {
                  label:  "Leaderboard",
                  desc:   "See how you rank against others",
                  icon:   Trophy,
                  color:  "text-amber-600",
                  bg:     "bg-amber-50 dark:bg-amber-950/20",
                  href:   "/leaderboard",
                },
              ].map(({ label, desc, icon: Icon, color, bg, href }) => (
                <Link
                  key={label}
                  to={href}
                  className="flex items-center gap-3 p-3 rounded-xl border border-[#e5e7eb] dark:border-[#1f2937] hover:border-violet-300 dark:hover:border-violet-700 transition-colors group"
                >
                  <div className={`w-8 h-8 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4 h-4 ${color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[13px] font-semibold text-[#111827] dark:text-white">{label}</p>
                    <p className="text-[11px] text-[#6b7280] truncate">{desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#9ca3af] group-hover:text-[#6b7280] transition-colors" />
                </Link>
              ))}
            </div>
          </div>
        </Section>

      </main>
    </div>
  );
}
