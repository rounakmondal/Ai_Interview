import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  User,
  Mail,
  Calendar,
  LogOut,
  Trophy,
  BookOpen,
  Target,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Edit3,
  Camera,
  Save,
  Zap,
  BarChart3,
  ChevronRight,
  GraduationCap,
  Flame,
  Award,
  Star,
  Shield,
  CircleDot,
  Sprout,
  CalendarRange,
  ArrowRight,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { getSession, clearSession, AuthUser } from "@/lib/auth-api";
import {
  fetchDashboard,
  DashboardStats,
  ExamType,
  EXAM_LABELS,
  SUBJECT_LABELS,
} from "@/lib/govt-practice-data";
import {
  calculateExamReadiness,
  getCurrentStreak,
  getTotalPoints,
  ExamReadiness,
} from "@/lib/daily-tasks";
import { StudyExamType, STUDY_EXAM_LABELS } from "@shared/study-types";
import {
  getStudyExamPreference,
  saveStudyExamPreference,
  getExamSyllabusWithProgress,
  getSavedAIPlan,
} from "@/lib/exam-syllabus-data";
import { BookMarked, GanttChart } from "lucide-react";

// ── Avatar color palettes ──────────────────────────────────────────────
const AVATAR_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-red-600",
  "from-pink-500 to-rose-600",
  "from-cyan-500 to-blue-600",
  "from-amber-500 to-yellow-600",
  "from-violet-500 to-fuchsia-600",
  "from-lime-500 to-green-600",
];

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const EXAM_OPTIONS: ExamType[] = ["WBCS", "SSC", "Railway", "Banking", "Police"];

function getUpcomingExam(): { exam: ExamType; date: string } | null {
  try {
    const raw = localStorage.getItem("upcoming_exam");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUpcomingExam(exam: ExamType, date: string) {
  localStorage.setItem("upcoming_exam", JSON.stringify({ exam, date }));
}

// ── Clean Section Card ────────────────────────────────────────────────
function Section({
  children,
  className = "",
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={`rounded-2xl border border-[#e5e7eb] dark:border-[#1f2937] bg-white dark:bg-[#111827] shadow-[0_1px_4px_rgba(0,0,0,0.06)] dark:shadow-[0_1px_4px_rgba(0,0,0,0.3)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

// ── Section Header ─────────────────────────────────────────────────────
function SectionHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: React.ElementType;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#f3f4f6] dark:bg-[#1f2937] flex items-center justify-center">
          <Icon className="w-4.5 h-4.5 text-[#374151] dark:text-[#9ca3af]" size={18} />
        </div>
        <div>
          <h2 className="text-[15px] font-semibold text-[#111827] dark:text-[#f9fafb] tracking-tight">{title}</h2>
          {subtitle && <p className="text-[12px] text-[#6b7280] dark:text-[#6b7280] mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export default function Profile() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [user, setUser] = useState<AuthUser | null>(null);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [upcomingExam, setUpcomingExam] = useState<ExamType | "">(getUpcomingExam()?.exam ?? "");
  const [examDate, setExamDate] = useState(getUpcomingExam()?.date ?? "");
  const [editingExam, setEditingExam] = useState(false);
  const [readiness, setReadiness] = useState<ExamReadiness | null>(null);
  const [studyExam, setStudyExam] = useState<StudyExamType | "">(getStudyExamPreference() ?? "");
  const [planRefresh, setPlanRefresh] = useState(0);

  useEffect(() => {
    const onFocus = () => setPlanRefresh((t) => t + 1);
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate("/auth", { replace: true });
      return;
    }
    setUser(session.user);
    const savedAvatar = localStorage.getItem("profile_avatar");
    if (savedAvatar) setAvatarUrl(savedAvatar);
    fetchDashboard().then((data) => {
      setStats(data);
      setLoading(false);
      // Calculate exam readiness
      if (data && getUpcomingExam()) {
        const r = calculateExamReadiness(
          data.averageScore,
          data.subjectScores,
          data.totalTests,
          data.progressData
        );
        setReadiness(r);
      }
    });
  }, [navigate]);

  const savedAiPlan = getSavedAIPlan();
  const activeAiPlan =
    studyExam && savedAiPlan?.examId === studyExam ? savedAiPlan : null;

  let syllabusDone = 0;
  let syllabusTotal = 0;
  if (studyExam) {
    const syllabus = getExamSyllabusWithProgress(studyExam);
    for (const subj of syllabus.subjects) {
      syllabusTotal += subj.chapters.length;
      syllabusDone += subj.chapters.filter((c) => c.status === "done").length;
    }
  }
  const syllabusPct =
    syllabusTotal > 0 ? Math.round((syllabusDone / syllabusTotal) * 100) : 0;

  const profileDaysLeft =
    examDate && upcomingExam
      ? Math.max(
          0,
          Math.ceil(
            (new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24),
          ),
        )
      : null;

  const planDaysLeft =
    activeAiPlan?.examDate
      ? Math.max(
          0,
          Math.ceil(
            (new Date(activeAiPlan.examDate).getTime() - Date.now()) /
              (1000 * 60 * 60 * 24),
          ),
        )
      : null;

  const handleLogout = () => {
    clearSession();
    toast({ title: "Logged out", description: "See you soon!" });
    navigate("/");
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500_000) {
      toast({ title: "File too large", description: "Max 500KB", variant: "destructive" });
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      setAvatarUrl(dataUrl);
      localStorage.setItem("profile_avatar", dataUrl);
      toast({ title: "Avatar updated!" });
    };
    reader.readAsDataURL(file);
  };

  const handleSaveExam = () => {
    if (upcomingExam && examDate) {
      saveUpcomingExam(upcomingExam, examDate);
      setEditingExam(false);
      toast({ title: "Exam target saved!" });
    }
  };

  const daysUntilExam = (() => {
    if (!examDate) return null;
    const diff = Math.ceil(
      (new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    return diff > 0 ? diff : null;
  })();

  if (!user) return null;

  const initials = getInitials(user.name);
  const avatarGradient = getAvatarColor(user.name);

  return (
    <div className="min-h-screen bg-[#f9fafb] dark:bg-[#0d1117]">

      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 bg-white/90 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-[#e5e7eb] dark:border-[#1f2937]">
        <div className="max-w-4xl mx-auto px-5 h-[52px] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#111827] dark:hover:text-white transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Home
            </Link>
            <span className="text-[#d1d5db] dark:text-[#374151] mx-0.5">/</span>
            <span className="text-[13px] font-medium text-[#111827] dark:text-white">Profile</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-[13px] text-[#6b7280] hover:text-[#ef4444] dark:hover:text-[#f87171] transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Sign out
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-5 py-8 space-y-5">

        {/* ═══════════════════════════════════════════════════════════
            PROFILE HERO
        ═══════════════════════════════════════════════════════════ */}
        <Section>
          {/* Top accent bar using avatar gradient */}
          <div className={`h-1 w-full rounded-t-2xl bg-gradient-to-r ${avatarGradient}`} />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start gap-6">
              {/* Avatar */}
              <button
                onClick={() => fileInputRef.current?.click()}
                className="relative group flex-shrink-0"
              >
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={user.name}
                    className="w-[72px] h-[72px] rounded-2xl object-cover ring-1 ring-black/[0.08] dark:ring-white/[0.08]"
                  />
                ) : (
                  <div
                    className={`w-[72px] h-[72px] rounded-2xl bg-gradient-to-br ${avatarGradient} flex items-center justify-center ring-1 ring-black/[0.08] dark:ring-white/[0.08]`}
                  >
                    <span className="text-xl font-bold text-white tracking-tight">{initials}</span>
                  </div>
                )}
                <div className="absolute inset-0 rounded-2xl bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Camera className="w-5 h-5 text-white" />
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarUpload}
                />
              </button>

              {/* Identity */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <h1 className="text-xl font-semibold text-[#111827] dark:text-white tracking-tight">{user.name}</h1>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#16a34a] bg-[#f0fdf4] dark:bg-[#16a34a]/10 dark:text-[#4ade80] border border-[#bbf7d0] dark:border-[#16a34a]/20 px-2 py-0.5 rounded-full">
                    <CircleDot className="w-2 h-2" />
                    Active
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#6b7280] bg-[#f3f4f6] dark:bg-[#1f2937] dark:text-[#9ca3af] border border-[#e5e7eb] dark:border-[#374151] px-2 py-0.5 rounded-full">
                    <Shield className="w-2.5 h-2.5" />
                    Free
                  </span>
                </div>
                <div className="flex flex-wrap gap-x-5 gap-y-1 mt-2">
                  <span className="flex items-center gap-1.5 text-[13px] text-[#6b7280]">
                    <Mail className="w-3.5 h-3.5" />
                    {user.email}
                  </span>
                  <span className="flex items-center gap-1.5 text-[13px] text-[#6b7280]">
                    <Calendar className="w-3.5 h-3.5" />
                    Joined {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#f3f4f6] dark:border-[#1f2937] mt-6 mb-5" />

            {/* Inline stats row */}
            {stats && !loading && (
              <div className="grid grid-cols-3 gap-4">
                {[
                  { label: "Tests Taken", value: stats.totalTests, color: "text-[#2563eb]" },
                  { label: "Average Score", value: `${stats.averageScore}%`, color: "text-[#059669]" },
                  { label: "This Week", value: stats.weeklyTests, color: "text-[#d97706]" },
                ].map((s) => (
                  <div key={s.label}>
                    <p className={`text-2xl font-bold tracking-tight ${s.color}`}>{s.value}</p>
                    <p className="text-[12px] text-[#9ca3af] mt-0.5 font-medium">{s.label}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Section>

        {/* ═══════════════════════════════════════════════════════════
            STUDY PLAN — high visibility, clear + sustainable habits
        ═══════════════════════════════════════════════════════════ */}
        <section
          className="rounded-2xl border-2 border-primary/25 dark:border-primary/35 bg-gradient-to-br from-primary/[0.07] via-background to-violet-500/[0.06] shadow-[0_8px_30px_-12px_rgba(79,70,229,0.35)] dark:shadow-[0_8px_30px_-12px_rgba(99,102,241,0.2)] overflow-hidden"
          data-sync={planRefresh}
        >
          <div className="px-5 sm:px-8 py-6 sm:py-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div className="space-y-2 max-w-xl">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge className="bg-primary text-primary-foreground border-0 font-semibold text-xs">
                    <GanttChart className="w-3 h-3 mr-1" />
                    Study plan
                  </Badge>
                  <Badge variant="outline" className="text-xs gap-1 border-emerald-500/40 text-emerald-700 dark:text-emerald-400">
                    <Sprout className="w-3 h-3" />
                    Sustainable prep
                  </Badge>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#111827] dark:text-white tracking-tight">
                  Your week-by-week roadmap
                </h2>
                <p className="text-[13px] sm:text-sm text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                  <span className="font-medium text-[#374151] dark:text-[#d1d5db]">
                    Same small session daily beats cramming.
                  </span>{" "}
                  Set your exam target below for countdown &amp; daily tasks, choose a study exam here for syllabus +
                  AI plan — progress stays in sync when you tick chapters in Syllabus Tracker.
                </p>
              </div>
              <div className="flex flex-col sm:items-end gap-2 shrink-0">
                <Link to="/study-plan" className="w-full sm:w-auto">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto gap-2 rounded-xl font-semibold shadow-md shadow-primary/20"
                    disabled={!studyExam}
                  >
                    Open full study plan
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link to="/syllabus" className="w-full sm:w-auto">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full sm:w-auto rounded-xl gap-1.5"
                    disabled={!studyExam}
                  >
                    <BookMarked className="w-3.5 h-3.5" />
                    Syllabus tracker
                  </Button>
                </Link>
                {!studyExam && (
                  <p className="text-[11px] text-amber-700 dark:text-amber-400 text-center sm:text-right max-w-[220px] sm:ml-auto">
                    Pick a study exam in the next section to unlock your plan.
                  </p>
                )}
              </div>
            </div>

            {studyExam ? (
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="rounded-xl border border-[#e5e7eb] dark:border-[#374151] bg-white/80 dark:bg-[#111827]/80 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold text-[#374151] dark:text-[#d1d5db]">
                      Syllabus coverage
                    </span>
                    <span className="text-lg font-bold tabular-nums text-primary">{syllabusPct}%</span>
                  </div>
                  <Progress value={syllabusPct} className="h-2" />
                  <p className="text-[11px] text-[#9ca3af]">
                    {syllabusDone} of {syllabusTotal} chapters done ·{" "}
                    <span className="text-[#6b7280] dark:text-[#9ca3af]">
                      mark topics in tracker to update this
                    </span>
                  </p>
                </div>

                <div className="rounded-xl border border-[#e5e7eb] dark:border-[#374151] bg-white/80 dark:bg-[#111827]/80 p-4 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[12px] font-semibold text-[#374151] dark:text-[#d1d5db]">
                      AI weekly plan
                    </span>
                    {activeAiPlan ? (
                      <Badge variant="secondary" className="text-[10px]">
                        {activeAiPlan.totalWeeks} weeks
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-[10px] text-amber-700 border-amber-500/40">
                        Not set
                      </Badge>
                    )}
                  </div>
                  {activeAiPlan ? (
                    <>
                      <p className="text-[13px] font-medium text-[#111827] dark:text-white line-clamp-2">
                        {activeAiPlan.weeks[0]?.title ?? "Plan ready"}
                      </p>
                      <p className="text-[11px] text-[#9ca3af]">
                        {activeAiPlan.hoursPerDay}h/day target · exam{" "}
                        {formatDate(activeAiPlan.examDate)}
                        {planDaysLeft != null && (
                          <span className="text-primary font-medium"> · {planDaysLeft}d left</span>
                        )}
                      </p>
                    </>
                  ) : (
                    <p className="text-[12px] text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Open Study Plan, set your exam date, and generate — you&apos;ll get structured weeks + daily
                      hours.
                    </p>
                  )}
                </div>

                <div className="rounded-xl border border-[#e5e7eb] dark:border-[#374151] bg-white/80 dark:bg-[#111827]/80 p-4 space-y-3">
                  <div className="flex items-center gap-2">
                    <CalendarRange className="w-4 h-4 text-[#d97706]" />
                    <span className="text-[12px] font-semibold text-[#374151] dark:text-[#d1d5db]">
                      Exam countdown
                    </span>
                  </div>
                  {profileDaysLeft != null ? (
                    <>
                      <p className="text-3xl font-bold tabular-nums text-[#111827] dark:text-white">
                        {profileDaysLeft}
                        <span className="text-sm font-semibold text-[#9ca3af] ml-1">days</span>
                      </p>
                      <p className="text-[11px] text-[#9ca3af]">
                        From your <span className="font-medium text-foreground">Exam target</span> below (
                        {upcomingExam ? EXAM_LABELS[upcomingExam as ExamType] : "—"})
                      </p>
                    </>
                  ) : (
                    <p className="text-[12px] text-[#6b7280] dark:text-[#9ca3af] leading-relaxed">
                      Add an exam date in <strong className="text-foreground">Exam target</strong> so your prep
                      stays time-bound and realistic.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-primary/30 bg-white/50 dark:bg-[#111827]/50 p-6 text-center">
                <p className="text-[14px] font-medium text-[#374151] dark:text-[#d1d5db] mb-1">
                  Choose your study exam to see progress &amp; plan status
                </p>
                <p className="text-[12px] text-[#9ca3af] mb-4">
                  WBCS, WBPSC, Police SI, SSC — syllabus and AI plan both use this choice.
                </p>
              </div>
            )}

            <div className="flex flex-wrap gap-3 items-center justify-between pt-2 border-t border-[#e5e7eb]/80 dark:border-[#374151]">
              <p className="text-[11px] text-[#9ca3af] flex items-center gap-1.5 max-w-md">
                <Sprout className="w-3.5 h-3.5 shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span>
                  <strong className="text-[#374151] dark:text-[#d1d5db]">Sustainable habit:</strong> 45–90 min
                  daily + one mock weekly. Adjust hours in Study Plan when life gets busy — consistency matters more
                  than marathon days.
                </span>
              </p>
              <Link
                to="/daily-tasks"
                className="text-[12px] font-semibold text-primary inline-flex items-center gap-1 hover:underline underline-offset-2"
              >
                Today&apos;s tasks
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
            EXAM TARGET
        ═══════════════════════════════════════════════════════════ */}
        <Section className="p-6 sm:p-8">
          <SectionHeader
            icon={Target}
            title="Exam Target"
            subtitle="Used for daily tasks, streaks & countdown — pair with your Study plan exam above"
            action={
              !editingExam ? (
                <button
                  onClick={() => setEditingExam(true)}
                  className="flex items-center gap-1.5 text-[13px] font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  {upcomingExam ? "Edit" : "Set target"}
                </button>
              ) : null
            }
          />

          {editingExam ? (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-[#374151] dark:text-[#d1d5db]">Exam</Label>
                  <select
                    className="w-full h-9 px-3 rounded-xl border border-[#e5e7eb] dark:border-[#374151] bg-[#f9fafb] dark:bg-[#1f2937] text-[13px] text-[#111827] dark:text-white focus:border-[#2563eb] focus:ring-2 focus:ring-[#2563eb]/10 transition-all outline-none"
                    value={upcomingExam}
                    onChange={(e) => setUpcomingExam(e.target.value as ExamType)}
                  >
                    <option value="">Select exam</option>
                    {EXAM_OPTIONS.map((ex) => (
                      <option key={ex} value={ex}>{EXAM_LABELS[ex]}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <Label className="text-[12px] font-medium text-[#374151] dark:text-[#d1d5db]">Exam Date</Label>
                  <Input
                    type="date"
                    value={examDate}
                    onChange={(e) => setExamDate(e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className="h-9 rounded-xl border-[#e5e7eb] dark:border-[#374151] bg-[#f9fafb] dark:bg-[#1f2937] text-[13px]"
                  />
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  className="h-9 px-4 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-[13px] font-medium disabled:opacity-40 transition-opacity flex items-center gap-1.5"
                  onClick={handleSaveExam}
                  disabled={!upcomingExam || !examDate}
                >
                  <Save className="w-3.5 h-3.5" />
                  Save
                </button>
                <button
                  className="h-9 px-4 rounded-xl border border-[#e5e7eb] dark:border-[#374151] text-[13px] font-medium text-[#374151] dark:text-[#d1d5db] hover:bg-[#f3f4f6] dark:hover:bg-[#1f2937] transition-colors"
                  onClick={() => setEditingExam(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : upcomingExam && examDate ? (
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-xl bg-[#f3f4f6] dark:bg-[#1f2937] flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-[#374151] dark:text-[#9ca3af]" />
                </div>
                <div>
                  <p className="text-[15px] font-semibold text-[#111827] dark:text-white">{EXAM_LABELS[upcomingExam]}</p>
                  <p className="text-[12px] text-[#6b7280] mt-0.5">{formatDate(examDate)}</p>
                </div>
              </div>
              {daysUntilExam && (
                <div className={`px-5 py-3 rounded-2xl border text-center ${
                  daysUntilExam <= 30
                    ? "bg-[#fef2f2] border-[#fecaca] dark:bg-[#ef4444]/10 dark:border-[#ef4444]/20"
                    : daysUntilExam <= 90
                    ? "bg-[#fffbeb] border-[#fde68a] dark:bg-[#d97706]/10 dark:border-[#d97706]/20"
                    : "bg-[#f0fdf4] border-[#bbf7d0] dark:bg-[#059669]/10 dark:border-[#059669]/20"
                }`}>
                  <p className={`text-3xl font-bold tracking-tight ${
                    daysUntilExam <= 30 ? "text-[#dc2626] dark:text-[#f87171]"
                    : daysUntilExam <= 90 ? "text-[#d97706] dark:text-[#fbbf24]"
                    : "text-[#16a34a] dark:text-[#4ade80]"
                  }`}>{daysUntilExam}</p>
                  <p className="text-[10px] font-medium text-[#9ca3af] mt-0.5 uppercase tracking-wide">days left</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <div className="w-10 h-10 rounded-xl bg-[#f3f4f6] dark:bg-[#1f2937] flex items-center justify-center mb-1">
                <Target className="w-5 h-5 text-[#9ca3af]" />
              </div>
              <p className="text-[14px] font-medium text-[#374151] dark:text-[#d1d5db]">No exam set</p>
              <p className="text-[12px] text-[#9ca3af]">Set a target to start your countdown</p>
            </div>
          )}
        </Section>

        {/* ═══════════════════════════════════════════════════════════
            EXAM READINESS
        ═══════════════════════════════════════════════════════════ */}
        {readiness && upcomingExam && (
          <Section className="p-6 sm:p-8">
            <SectionHeader
              icon={Target}
              title="Exam Readiness"
              subtitle="Your probability of cracking the exam"
              action={
                <Link to="/daily-tasks" className="flex items-center gap-1 text-[13px] font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
                  Daily Tasks <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              }
            />

            {/* Big probability gauge */}
            <div className="flex flex-col items-center mb-6">
              <div className={`relative w-32 h-32 rounded-full flex items-center justify-center border-[6px] ${
                readiness.probability >= 70
                  ? "border-[#059669]"
                  : readiness.probability >= 40
                  ? "border-[#d97706]"
                  : "border-[#dc2626]"
              }`}>
                <div>
                  <p className={`text-3xl font-bold text-center ${
                    readiness.probability >= 70
                      ? "text-[#059669] dark:text-[#4ade80]"
                      : readiness.probability >= 40
                      ? "text-[#d97706] dark:text-[#fbbf24]"
                      : "text-[#dc2626] dark:text-[#f87171]"
                  }`}>{readiness.probability}%</p>
                  <p className="text-[10px] text-[#9ca3af] text-center font-medium uppercase tracking-wide">Readiness</p>
                </div>
              </div>
              <p className="text-[13px] text-[#6b7280] mt-3 text-center max-w-xs">{readiness.insight}</p>
            </div>

            {/* Factor breakdown */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Score Factor", value: readiness.scoreFactor, weight: "40%", color: "bg-[#2563eb]" },
                { label: "Consistency", value: readiness.consistencyFactor, weight: "25%", color: "bg-[#059669]" },
                { label: "Coverage", value: readiness.coverageFactor, weight: "20%", color: "bg-[#d97706]" },
                { label: "Improvement", value: readiness.improvementFactor, weight: "15%", color: "bg-[#7c3aed]" },
              ].map((f) => (
                <div key={f.label} className="p-3 rounded-xl bg-[#f9fafb] dark:bg-[#1f2937]/50 border border-[#f3f4f6] dark:border-[#1f2937]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[12px] font-medium text-[#374151] dark:text-[#d1d5db]">{f.label}</span>
                    <span className="text-[11px] text-[#9ca3af]">{f.weight}</span>
                  </div>
                  <p className="text-lg font-bold text-[#111827] dark:text-white mb-1.5">{f.value}%</p>
                  <div className="h-1.5 bg-[#e5e7eb] dark:bg-[#374151] rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${f.color} transition-all duration-700`} style={{ width: `${f.value}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Points & streak summary */}
            <div className="flex items-center justify-center gap-6 mt-5 pt-5 border-t border-[#f3f4f6] dark:border-[#1f2937]">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-[#d97706]" />
                <span className="text-[13px] font-semibold text-[#111827] dark:text-white">{getTotalPoints()} XP</span>
              </div>
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-[#f97316]" />
                <span className="text-[13px] font-semibold text-[#111827] dark:text-white">{getCurrentStreak()} day streak</span>
              </div>
            </div>
          </Section>
        )}

      
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Section key={i} className="p-5 animate-pulse">
                <div className="h-8 w-12 bg-[#f3f4f6] dark:bg-[#1f2937] rounded-lg mb-2" />
                <div className="h-3 w-20 bg-[#f3f4f6] dark:bg-[#1f2937] rounded-lg" />
              </Section>
            ))}
          </div>
        ) : stats ? (
          <>
            {/* Stat cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { label: "Total Tests", value: stats.totalTests, icon: BookOpen, num: "text-[#2563eb]", bg: "bg-[#eff6ff] dark:bg-[#2563eb]/10" },
                { label: "Avg Score", value: `${stats.averageScore}%`, icon: BarChart3, num: "text-[#059669]", bg: "bg-[#f0fdf4] dark:bg-[#059669]/10" },
                { label: "This Week", value: stats.weeklyTests, icon: Zap, num: "text-[#d97706]", bg: "bg-[#fffbeb] dark:bg-[#d97706]/10" },
                { label: "Subjects", value: stats.subjectScores.length, icon: GraduationCap, num: "text-[#7c3aed]", bg: "bg-[#f5f3ff] dark:bg-[#7c3aed]/10" },
              ].map((item) => (
                <Section key={item.label} className="p-5">
                  <div className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                    <item.icon className={`w-4 h-4 ${item.num}`} />
                  </div>
                  <p className={`text-2xl font-bold tracking-tight ${item.num}`}>{item.value}</p>
                  <p className="text-[12px] text-[#9ca3af] mt-0.5 font-medium">{item.label}</p>
                </Section>
              ))}
            </div>

            {/* Subject performance + sidebar */}
            <div className="grid lg:grid-cols-5 gap-5">
              {/* Subject breakdown */}
              <Section className="lg:col-span-3 p-6 sm:p-8">
                <SectionHeader icon={BarChart3} title="Subject Performance" />
                <div className="space-y-5">
                  {stats.subjectScores.map((s) => (
                    <div key={s.subject}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[13px] font-medium text-[#374151] dark:text-[#d1d5db]">
                          {SUBJECT_LABELS[s.subject] || s.subject}
                        </span>
                        <div className="flex items-center gap-2.5">
                          <span className="text-[11px] text-[#9ca3af]">{s.tests} tests</span>
                          <span
                            className={`text-[12px] font-semibold px-2 py-0.5 rounded-lg ${
                              s.score >= 75
                                ? "text-[#059669] bg-[#f0fdf4] dark:bg-[#059669]/10"
                                : s.score >= 50
                                ? "text-[#d97706] bg-[#fffbeb] dark:bg-[#d97706]/10"
                                : "text-[#dc2626] bg-[#fef2f2] dark:bg-[#dc2626]/10"
                            }`}
                          >
                            {s.score}%
                          </span>
                        </div>
                      </div>
                      <div className="h-1.5 bg-[#f3f4f6] dark:bg-[#1f2937] rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            s.score >= 75
                              ? "bg-[#059669]"
                              : s.score >= 50
                              ? "bg-[#d97706]"
                              : "bg-[#dc2626]"
                          }`}
                          style={{ width: `${s.score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </Section>

              {/* Right column */}
              <div className="lg:col-span-2 space-y-5">
                {/* Strong areas */}
                {stats.strongSubjects.length > 0 && (
                  <Section className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <CheckCircle2 className="w-4 h-4 text-[#059669]" />
                      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white">Strong Areas</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {stats.strongSubjects.map((sub) => (
                        <span
                          key={sub}
                          className="text-[12px] font-medium text-[#059669] bg-[#f0fdf4] dark:bg-[#059669]/10 border border-[#bbf7d0] dark:border-[#059669]/20 px-2.5 py-1 rounded-lg"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Weak areas */}
                {stats.weakSubjects.length > 0 && (
                  <Section className="p-5">
                    <div className="flex items-center gap-2 mb-4">
                      <AlertTriangle className="w-4 h-4 text-[#d97706]" />
                      <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white">Needs Work</h3>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {stats.weakSubjects.map((sub) => (
                        <span
                          key={sub}
                          className="text-[12px] font-medium text-[#d97706] bg-[#fffbeb] dark:bg-[#d97706]/10 border border-[#fde68a] dark:border-[#d97706]/20 px-2.5 py-1 rounded-lg"
                        >
                          {sub}
                        </span>
                      ))}
                    </div>
                  </Section>
                )}

                {/* Quick actions */}
                <Section className="p-5">
                  <h3 className="text-[13px] font-semibold text-[#111827] dark:text-white mb-3">Quick Actions</h3>
                  <div className="space-y-0.5">
                    {[
                      { label: "Study Plan", to: "/study-plan", icon: GanttChart },
                      { label: "Syllabus Tracker", to: "/syllabus", icon: BookMarked },
                      { label: "Daily Tasks", to: "/daily-tasks", icon: Flame },
                      { label: "Start Practice Test", to: "/govt-practice", icon: BookOpen },
                      { label: "View Leaderboard", to: "/leaderboard", icon: Trophy },
                      { label: "Full Dashboard", to: "/dashboard", icon: BarChart3 },
                      { label: "Current Affairs", to: "/current-affairs", icon: Zap },
                      { label: "Previous Year Papers", to: "/prev-year-questions", icon: Clock },
                    ].map((link) => (
                      <Link
                        key={link.to}
                        to={link.to}
                        className="flex items-center gap-3 px-2.5 py-2 rounded-xl hover:bg-[#f3f4f6] dark:hover:bg-[#1f2937] transition-colors group"
                      >
                        <link.icon className="w-3.5 h-3.5 text-[#9ca3af] group-hover:text-[#374151] dark:group-hover:text-[#d1d5db] transition-colors" />
                        <span className="text-[13px] font-medium text-[#374151] dark:text-[#d1d5db] flex-1">{link.label}</span>
                        <ChevronRight className="w-3.5 h-3.5 text-[#d1d5db] dark:text-[#374151] group-hover:translate-x-0.5 transition-transform" />
                      </Link>
                    ))}
                  </div>
                </Section>
              </div>
            </div>

            {/* Recent Tests */}
            {stats.recentTests.length > 0 && (
              <Section className="p-6 sm:p-8">
                <SectionHeader
                  icon={Clock}
                  title="Recent Tests"
                  action={
                    <Link to="/dashboard" className="flex items-center gap-1 text-[13px] font-medium text-[#2563eb] hover:text-[#1d4ed8] transition-colors">
                      View all <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  }
                />
                <div className="space-y-1">
                  {stats.recentTests.map((test, idx) => {
                    const pct = Math.round((test.score / test.total) * 100);
                    return (
                      <div
                        key={idx}
                        className="flex items-center gap-4 px-3 py-3 rounded-xl hover:bg-[#f9fafb] dark:hover:bg-[#1f2937]/50 transition-colors"
                      >
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            pct >= 60
                              ? "bg-[#f0fdf4] dark:bg-[#059669]/10"
                              : "bg-[#fffbeb] dark:bg-[#d97706]/10"
                          }`}
                        >
                          <span className={`text-[12px] font-bold ${pct >= 60 ? "text-[#059669]" : "text-[#d97706]"}`}>
                            {pct}%
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-medium text-[#111827] dark:text-white truncate">{test.exam}</p>
                          <p className="text-[11px] text-[#9ca3af] mt-0.5">{test.score}/{test.total} correct</p>
                        </div>
                        <span className="text-[11px] text-[#9ca3af] flex-shrink-0">{formatDate(test.date)}</span>
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}

            {/* Score Trend */}
            {stats.progressData.length > 0 && (
              <Section className="p-6 sm:p-8">
                <SectionHeader icon={TrendingUp} title="Score Trend" subtitle="Weekly performance" />
                <div className="flex items-end gap-2 h-28 mt-2">
                  {stats.progressData.map((w, idx) => {
                    const max = Math.max(...stats.progressData.map((d) => d.score), 1);
                    const height = Math.max((w.score / max) * 100, 4);
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 group">
                        <span className="text-[10px] font-semibold text-[#9ca3af] opacity-0 group-hover:opacity-100 transition-opacity">
                          {w.score}%
                        </span>
                        <div className="w-full flex-1 flex items-end">
                          <div
                            className="w-full rounded-lg bg-[#2563eb] dark:bg-[#3b82f6] opacity-70 group-hover:opacity-100 transition-all duration-300"
                            style={{ height: `${height}%` }}
                          />
                        </div>
                        <span className="text-[9px] font-medium text-[#9ca3af]">
                          {w.week.replace("Week ", "W")}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </Section>
            )}
          </>
        ) : (
          <Section className="p-12 text-center">
            <div className="w-12 h-12 mx-auto rounded-2xl bg-[#f3f4f6] dark:bg-[#1f2937] flex items-center justify-center mb-4">
              <BookOpen className="w-6 h-6 text-[#9ca3af]" />
            </div>
            <p className="text-[15px] font-semibold text-[#374151] dark:text-[#d1d5db] mb-1">No test data yet</p>
            <p className="text-[13px] text-[#9ca3af] mb-5">Start practicing to see your stats here</p>
            <Link to="/govt-practice">
              <button className="h-9 px-5 rounded-xl bg-[#111827] dark:bg-white text-white dark:text-[#111827] text-[13px] font-medium inline-flex items-center gap-1.5 hover:opacity-90 transition-opacity">
                <BookOpen className="w-3.5 h-3.5" />
                Start First Test
              </button>
            </Link>
          </Section>
        )}

        {/* ═══════════════════════════════════════════════════════════
            ACCOUNT
        ═══════════════════════════════════════════════════════════ */}
        <Section className="p-6 sm:p-8">
          <SectionHeader
            icon={Shield}
            title="Account"
            subtitle="Your account information"
          />
          <div className="grid sm:grid-cols-2 gap-3">
            {[
              { label: "Full Name", value: user.name, icon: User },
              { label: "Email", value: user.email, icon: Mail },
              { label: "Member Since", value: formatDate(user.createdAt), icon: Calendar },
              { label: "Total Tests", value: String(stats?.totalTests ?? 0), icon: Trophy },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 p-3.5 rounded-xl bg-[#f9fafb] dark:bg-[#1f2937]/50 border border-[#f3f4f6] dark:border-[#1f2937]"
              >
                <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#1f2937] border border-[#e5e7eb] dark:border-[#374151] flex items-center justify-center flex-shrink-0">
                  <item.icon className="w-3.5 h-3.5 text-[#6b7280]" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-medium text-[#9ca3af] uppercase tracking-wide">{item.label}</p>
                  <p className="text-[13px] font-semibold text-[#111827] dark:text-white truncate mt-0.5">{item.value}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-5 mt-5 border-t border-[#f3f4f6] dark:border-[#1f2937]">
            <p className="text-[12px] text-[#9ca3af]">You're signed in as <span className="font-medium text-[#374151] dark:text-[#d1d5db]">{user.email}</span></p>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 h-8 px-3.5 rounded-lg border border-[#fecaca] dark:border-[#ef4444]/20 text-[#dc2626] dark:text-[#f87171] text-[12px] font-medium hover:bg-[#fef2f2] dark:hover:bg-[#ef4444]/10 transition-colors"
            >
              <LogOut className="w-3 h-3" />
              Sign out
            </button>
          </div>
        </Section>

        <div className="h-8" />
      </main>
    </div>
  );
}
