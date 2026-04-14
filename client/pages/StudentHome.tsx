/**
 * StudentHome — the post-login "command centre" shown at /home
 * Gives every logged-in student a personalised snapshot in <2 minutes:
 *   1. Hero greeting + exam countdown
 *   2. Today's live stats (streak, accuracy, questions done)
 *   3. Quick launch — 4 big action cards
 *   4. Exam Room — subject-wise progress bars
 *   5. AI Analytics teaser
 *   6. Syllabus snapshot
 *   7. Premium upsell
 */

import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProfileButton from "@/components/ProfileButton";
import {
  Flame, Target, Trophy, BookOpen, Brain, Zap, BarChart3,
  ChevronRight, Play, Lock, CheckCircle2, Clock, TrendingUp,
  ArrowRight, Sparkles, ListChecks, Star, CircleCheck, Map,
} from "lucide-react";
import { getSession } from "@/lib/auth-api";
import {
  getStudyExamPreference,
  getExamSyllabusWithProgress,
} from "@/lib/exam-syllabus-data";
import { fetchPersonalizedAnalysis, type DashboardAnalysis, SUBJECT_ICONS } from "@/lib/personal-dashboard-api";
import { getDailyTasks } from "@/lib/daily-tasks";
import type { StudyExamType } from "@shared/study-types";
import type { ExamType } from "@/lib/govt-practice-data";

// map StudyExamType → ExamType for practice navigation
const STUDY_TO_EXAM: Partial<Record<string, ExamType>> = {
  WBCS:     "WBCS",
  WBPSC:    "WBCS",
  Police_SI:"Police",
  SSC_CGL:  "SSC",
  Banking:  "Banking",
};

function getStreak(): number {
  try {
    const raw = localStorage.getItem("daily_streak");
    return raw ? parseInt(raw, 10) : 0;
  } catch { return 0; }
}

function greet(name: string): string {
  const h = new Date().getHours();
  if (h < 12) return `Good morning, ${name}! ☀️`;
  if (h < 17) return `Good afternoon, ${name}! 🎯`;
  return `Good evening, ${name}! 🌙`;
}

function daysLeft(): number | null {
  try {
    const raw = localStorage.getItem("upcoming_exam");
    if (!raw) return null;
    const { date } = JSON.parse(raw);
    const diff = Math.ceil((new Date(date).getTime() - Date.now()) / 86400000);
    return diff > 0 ? diff : null;
  } catch { return null; }
}

// ── helpers ───────────────────────────────────────────────────────────────────

const SUBJECT_COLORS: Record<string, { bg: string; bar: string; text: string }> = {
  History:         { bg: "bg-amber-50 dark:bg-amber-900/20",  bar: "bg-amber-500",  text: "text-amber-700 dark:text-amber-400" },
  Geography:       { bg: "bg-green-50 dark:bg-green-900/20",  bar: "bg-green-500",  text: "text-green-700 dark:text-green-400" },
  Polity:          { bg: "bg-blue-50 dark:bg-blue-900/20",    bar: "bg-blue-500",   text: "text-blue-700 dark:text-blue-400" },
  Reasoning:       { bg: "bg-purple-50 dark:bg-purple-900/20",bar: "bg-purple-500", text: "text-purple-700 dark:text-purple-400" },
  Math:            { bg: "bg-red-50 dark:bg-red-900/20",      bar: "bg-red-500",    text: "text-red-700 dark:text-red-400" },
  Mathematics:     { bg: "bg-red-50 dark:bg-red-900/20",      bar: "bg-red-500",    text: "text-red-700 dark:text-red-400" },
  "Current Affairs":{ bg:"bg-cyan-50 dark:bg-cyan-900/20",   bar: "bg-cyan-500",   text: "text-cyan-700 dark:text-cyan-400" },
  English:         { bg: "bg-indigo-50 dark:bg-indigo-900/20",bar: "bg-indigo-500", text: "text-indigo-700 dark:text-indigo-400" },
  Bengali:         { bg: "bg-rose-50 dark:bg-rose-900/20",   bar: "bg-rose-500",   text: "text-rose-700 dark:text-rose-400" },
  "General Knowledge":{ bg:"bg-sky-50 dark:bg-sky-900/20",   bar: "bg-sky-500",    text: "text-sky-700 dark:text-sky-400" },
};

function subjectColor(name: string) {
  return SUBJECT_COLORS[name] ?? { bg: "bg-slate-50 dark:bg-slate-800", bar: "bg-slate-400", text: "text-slate-600 dark:text-slate-300" };
}

const FADE_UP = { hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } };
const STAGGER = { show: { transition: { staggerChildren: 0.07 } } };

// ── Main Component ────────────────────────────────────────────────────────────

export default function StudentHome({ onClose }: { onClose?: () => void }) {
  const navigate = useNavigate();
  const session = getSession();
  const firstName = session?.user?.name?.split(" ")[0] ?? "Student";

  const studyExam = getStudyExamPreference();
  const practiceExam: ExamType = STUDY_TO_EXAM[studyExam ?? ""] ?? "WBCS";
  const days      = daysLeft();
  const streak    = getStreak();

  const [analysis, setAnalysis] = useState<DashboardAnalysis | null>(null);
  const [loadingAnalysis, setLoadingAnalysis] = useState(true);
  const [todayDone, setTodayDone] = useState(0);
  const [todayTarget, setTodayTarget] = useState(20);

  // Syllabus completion
  const { syllabusSubjects, syllabusPercent } = (() => {
    if (!studyExam) return { syllabusSubjects: [], syllabusPercent: 0 };
    const syl = getExamSyllabusWithProgress(studyExam);
    let total = 0, done = 0;
    for (const s of syl.subjects) {
      for (const c of s.chapters) { total++; if (c.status === "done") done++; }
    }
    return {
      syllabusSubjects: syl.subjects,
      syllabusPercent: total > 0 ? Math.round((done / total) * 100) : 0,
    };
  })();

  useEffect(() => {
    // Load daily tasks count
    if (studyExam) {
      try {
        const tasks = getDailyTasks(practiceExam);
        const completed = tasks.tasks.filter((t) => t.completed).length;
        setTodayDone(completed);
        setTodayTarget(tasks.tasks.length);
      } catch { /* ignore */ }
    }
    // Load AI analysis (fire-and-forget, non-blocking)
    fetchPersonalizedAnalysis()
      .then((d) => { if (d) setAnalysis(d); })
      .catch(() => {})
      .finally(() => setLoadingAnalysis(false));
  }, [studyExam]);

  // Overall accuracy from analysis
  const overallAccuracy = (() => {
    if (!analysis?.performance?.length) return null;
    const withData = analysis.performance.filter((p) => p.accuracy !== null);
    if (!withData.length) return null;
    return Math.round(withData.reduce((s, p) => s + (p.accuracy ?? 0), 0) / withData.length);
  })();

  // Top 3 weak subjects
  const weakSubjects = analysis?.performance
    .filter((p) => p.level === "Weak" && p.accuracy !== null)
    .sort((a, b) => (a.accuracy ?? 0) - (b.accuracy ?? 0))
    .slice(0, 3) ?? [];

  return (
    <div className="min-h-screen bg-[#f8f9fc] dark:bg-[#0a0d14]">
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <header className="sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-[#0a0d14]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {onClose ? (
              <button
                onClick={onClose}
                className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 hover:text-violet-600 transition-colors mr-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
                Back
              </button>
            ) : null}
            <div className="w-8 h-8 rounded-lg flex items-center justify-center shadow"
              style={{ background: "linear-gradient(135deg,#1e1b4b,#3730a3)" }}>
              <svg viewBox="0 0 36 36" width="18" height="18" fill="none">
                <path d="M4 28L4 8L18 20L32 8L32 28L28 28L28 12L18 22L8 12L8 28Z" fill="white"/>
                <circle cx="18" cy="6" r="3.5" fill="#fb923c"/>
              </svg>
            </div>
            <span className="font-bold text-base text-slate-900 dark:text-white hidden sm:inline">MedhaHub</span>
          </div>
          <nav className="hidden md:flex items-center gap-5 text-sm text-slate-500 dark:text-slate-400">
            <Link to="/govt-practice" onClick={onClose} className="hover:text-violet-600 transition-colors">Practice</Link>
            <Link to="/question-hub" onClick={onClose} className="hover:text-violet-600 transition-colors">Mock Tests</Link>
            <Link to="/syllabus" onClick={onClose} className="hover:text-violet-600 transition-colors">Syllabus</Link>
            <Link to="/personal-dashboard" onClick={onClose} className="hover:text-violet-600 transition-colors">Analytics</Link>
          </nav>
          <ProfileButton />
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-6 space-y-6">

        {/* ── 1. HERO GREETING BANNER ──────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
          style={{ background: "linear-gradient(135deg, #1e1b4b 0%, #3730a3 50%, #6d28d9 100%)" }}
        >
          {/* Decorative blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-8 -right-8 w-48 h-48 bg-violet-400/20 rounded-full blur-3xl" />
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-indigo-600/20 rounded-full blur-3xl" />
            <div className="absolute top-4 right-1/3 w-2 h-2 bg-white/30 rounded-full" />
            <div className="absolute bottom-6 right-1/4 w-1.5 h-1.5 bg-orange-300/50 rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-white mb-1">
                {greet(firstName)}
              </h1>
              <p className="text-indigo-200 text-sm">
                {studyExam
                  ? `Preparing for ${studyExam} — every question counts today.`
                  : "Set your target exam in Profile to get a personalised plan."}
              </p>
              <div className="flex flex-wrap items-center gap-2 mt-3">
                {studyExam && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-white/15 px-3 py-1.5 rounded-full text-white border border-white/20">
                    🎯 {studyExam} 2026
                  </span>
                )}
                {days !== null && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-orange-400/20 px-3 py-1.5 rounded-full text-orange-200 border border-orange-300/20">
                    ⏳ {days} days to exam
                  </span>
                )}
                {streak > 0 && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-red-400/20 px-3 py-1.5 rounded-full text-red-200 border border-red-300/20">
                    🔥 {streak}-day streak
                  </span>
                )}
              </div>
            </div>

            {/* Progress ring */}
            <div className="flex-shrink-0 text-center">
              <div className="relative w-20 h-20 mx-auto">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="8" />
                  <circle
                    cx="40" cy="40" r="32" fill="none"
                    stroke="#fb923c" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${Math.PI * 64}`}
                    strokeDashoffset={`${Math.PI * 64 * (1 - syllabusPercent / 100)}`}
                    style={{ transition: "stroke-dashoffset 1s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-lg font-black text-white">{syllabusPercent}%</span>
                  <span className="text-[9px] text-indigo-200 font-medium leading-tight text-center">Syllabus<br/>Done</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 2. TODAY'S LIVE STATS ────────────────────────────── */}
        <motion.div
          variants={STAGGER} initial="hidden" animate="show"
          className="grid grid-cols-3 gap-3"
        >
          {[
            {
              icon: <Flame className="w-5 h-5 text-orange-500" />,
              label: "Day Streak",
              value: streak > 0 ? `${streak} 🔥` : "Start today!",
              sub: streak > 0 ? "Keep it alive!" : "Build a habit",
              bg: "from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20",
              border: "border-orange-200 dark:border-orange-800/40",
            },
            {
              icon: <Target className="w-5 h-5 text-violet-500" />,
              label: "Today's Tasks",
              value: `${todayDone}/${todayTarget}`,
              sub: todayDone >= todayTarget ? "All done! 🎉" : `${todayTarget - todayDone} remaining`,
              bg: "from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20",
              border: "border-violet-200 dark:border-violet-800/40",
            },
            {
              icon: <TrendingUp className="w-5 h-5 text-emerald-500" />,
              label: "Accuracy",
              value: loadingAnalysis ? "..." : overallAccuracy !== null ? `${overallAccuracy}%` : "No data",
              sub: overallAccuracy !== null
                ? overallAccuracy >= 70 ? "Excellent! 🏆" : overallAccuracy >= 50 ? "Good progress" : "Keep practising"
                : "Take a test first",
              bg: "from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20",
              border: "border-emerald-200 dark:border-emerald-800/40",
            },
          ].map((s, i) => (
            <motion.div key={i} variants={FADE_UP}
              className={`rounded-2xl border bg-gradient-to-br ${s.bg} ${s.border} p-4 text-center`}>
              <div className="flex justify-center mb-1">{s.icon}</div>
              <div className="text-lg sm:text-xl font-black text-slate-900 dark:text-white leading-tight">{s.value}</div>
              <div className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mt-0.5">{s.label}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{s.sub}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* ── 3. QUICK LAUNCH ACTIONS ──────────────────────────── */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.15 }}>
          <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Quick Launch</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                icon: "🤖",
                title: "AI Practice",
                desc: "Smart MCQs — adapts to your weak areas",
                gradient: "from-violet-600 to-indigo-600",
                to: "/govt-practice",
                badge: "AI",
                hot: true,
              },
              {
                icon: "📝",
                title: "Mock Test",
                desc: "Previous year question papers + instant score",
                gradient: "from-orange-500 to-rose-500",
                to: "/question-hub",
                badge: "PYQ",
                hot: false,
              },
              {
                icon: "📚",
                title: "Syllabus",
                desc: "Track chapters · See what's pending",
                gradient: "from-emerald-500 to-teal-500",
                to: "/syllabus",
                badge: `${syllabusPercent}%`,
                hot: false,
              },
              {
                icon: "📊",
                title: "My Analytics",
                desc: "AI insight · Accuracy · Weak spots",
                gradient: "from-sky-500 to-blue-600",
                to: "/personal-dashboard",
                badge: "New",
                hot: false,
              },
            ].map((c, i) => (
              <Link key={i} to={c.to} onClick={onClose}
                className={`relative flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-br ${c.gradient} text-white shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-transform`}>
                {c.hot && (
                  <span className="absolute top-2.5 right-2.5 text-[9px] font-black bg-white/25 px-1.5 py-0.5 rounded-full uppercase tracking-wide">HOT</span>
                )}
                <span className="text-2xl">{c.icon}</span>
                <div>
                  <p className="text-sm font-black leading-tight">{c.title}</p>
                  <p className="text-[10px] text-white/70 mt-0.5 leading-snug">{c.desc}</p>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-full">{c.badge}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-70" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* ── 4. EXAM ROOM — Subject Progress ──────────────────── */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.22 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Your Exam Room{studyExam ? ` — ${studyExam}` : ""}
            </h2>
            <Link to="/exam-room" onClick={onClose} className="text-xs text-violet-600 font-semibold flex items-center gap-1 hover:underline">
              Full view <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {syllabusSubjects.slice(0, 6).map((subj) => {
              const total = subj.chapters.length;
              const done  = subj.chapters.filter((c) => c.status === "done").length;
              const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
              const col   = subjectColor(subj.name);
              // accuracy from analysis
              const perf  = analysis?.performance?.find((p) => p.topic === subj.name || p.topic === subj.name.replace(" Affairs",""));
              const acc   = perf?.accuracy ?? null;

              return (
                <button
                  key={subj.id}
                  onClick={() => { onClose?.(); navigate("/govt-practice", {
                    state: { exam: practiceExam, subject: subj.name, difficulty: "Medium", count: 10, autoGenerate: true }
                  }); }}
                  className={`flex items-start gap-3 p-4 rounded-2xl border ${col.bg} border-slate-200/60 dark:border-slate-700/40 text-left hover:shadow-md hover:scale-[1.01] active:scale-[0.99] transition-all group`}
                >
                  <span className="text-2xl mt-0.5">{subj.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`text-[13px] font-bold ${col.text}`}>{subj.name}</span>
                      <Badge variant="outline" className={`text-[10px] ${col.text} border-current/30`}>
                        {done}/{total}
                      </Badge>
                    </div>
                    {/* Chapter progress */}
                    <div className="h-1.5 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden mb-1.5">
                      <div className={`h-full rounded-full ${col.bar} transition-all duration-700`} style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                      <span>{pct}% syllabus</span>
                      {acc !== null
                        ? <span className={`font-semibold ${acc >= 70 ? "text-emerald-600" : acc >= 50 ? "text-amber-600" : "text-red-500"}`}>{acc}% accuracy</span>
                        : <span className="flex items-center gap-1 text-violet-500 font-semibold group-hover:gap-1.5 transition-all"><Play className="w-2.5 h-2.5 fill-current" />Practice</span>
                      }
                    </div>
                  </div>
                </button>
              );
            })}
            {syllabusSubjects.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-10 gap-3 text-slate-400 text-sm">
                <Map className="w-8 h-8 opacity-40" />
                <p>No exam selected yet.</p>
                <Button size="sm" onClick={() => { onClose?.(); navigate("/profile"); }} className="bg-violet-600 hover:bg-violet-700 text-white">Set your exam</Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* ── 5. AI ANALYTICS TEASER ───────────────────────────── */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.28 }}>
          <div className="rounded-3xl border border-violet-200 dark:border-violet-800/40 bg-gradient-to-br from-violet-50 to-indigo-50/60 dark:from-violet-900/20 dark:to-indigo-900/10 p-5 sm:p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-violet-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-violet-300/30 dark:shadow-violet-900/30">
                <Brain className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <h3 className="text-[15px] font-black text-slate-900 dark:text-white">AI Personalised Analytics</h3>
                  <span className="text-[9px] font-black bg-violet-600 text-white px-2 py-0.5 rounded-full">AI</span>
                </div>
                <p className="text-[12px] text-slate-500 dark:text-slate-400">Your weak spots, action plan & daily target — powered by LLaMA 3.3</p>
              </div>
            </div>

            {loadingAnalysis ? (
              <div className="flex items-center gap-3 py-4">
                <div className="w-5 h-5 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
                <span className="text-sm text-slate-400">Loading your personalised insights…</span>
              </div>
            ) : analysis?.performance?.length ? (
              <>
                {/* Subject accuracy mini-bars */}
                <div className="space-y-2 mb-4">
                  {analysis.performance.slice(0, 4).map((p) => {
                    const col = subjectColor(p.topic);
                    const acc = p.accuracy ?? 0;
                    return (
                      <div key={p.topic} className="flex items-center gap-3">
                        <span className="text-sm w-5">{SUBJECT_ICONS[p.topic] ?? "📚"}</span>
                        <span className="text-[12px] font-medium text-slate-700 dark:text-slate-300 w-28 truncate">{p.topic}</span>
                        <div className="flex-1 h-2 rounded-full bg-slate-200 dark:bg-slate-700 overflow-hidden">
                          <div className={`h-full rounded-full ${col.bar} transition-all duration-700`} style={{ width: `${acc}%` }} />
                        </div>
                        <span className={`text-[11px] font-bold w-9 text-right ${acc >= 70 ? "text-emerald-600" : acc >= 50 ? "text-amber-600" : "text-red-500"}`}>
                          {p.accuracy !== null ? `${acc}%` : "—"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Weak areas */}
                {weakSubjects.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="text-[11px] text-slate-500 font-semibold">⚠️ Weak areas:</span>
                    {weakSubjects.map((w) => (
                      <button
                        key={w.subTopic}
                        onClick={() => { onClose?.(); navigate("/govt-practice", { state: { exam: practiceExam, subject: w.subTopic, difficulty: "Easy", count: 10, autoGenerate: true } }); }}
                        className="text-[11px] font-semibold bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 px-2.5 py-1 rounded-full hover:bg-red-200 transition-colors"
                      >
                        {w.subTopic} · {w.accuracy}%
                      </button>
                    ))}
                  </div>
                )}

                {analysis.aiAnalysis?.message && (
                  <p className="text-[12px] italic text-violet-700 dark:text-violet-300 bg-violet-100 dark:bg-violet-900/30 px-3 py-2 rounded-xl mb-4">
                    ✨ {analysis.aiAnalysis.message}
                  </p>
                )}
              </>
            ) : (
              <div className="py-3 mb-4">
                <p className="text-[12px] text-slate-500 mb-2">Take your first AI practice test to unlock personalised analytics.</p>
                <div className="flex gap-2">
                  {["History 📜", "Reasoning 🧩", "Math 📐", "Polity ⚖️"].map((s) => (
                    <span key={s} className="text-[10px] bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 px-2 py-1 rounded-full">{s}</span>
                  ))}
                </div>
              </div>
            )}

            <Button
              onClick={() => { onClose?.(); navigate("/personal-dashboard"); }}
              className="bg-violet-600 hover:bg-violet-700 text-white text-sm gap-2 rounded-xl h-10 shadow-lg shadow-violet-300/20"
            >
              <Sparkles className="w-4 h-4" />
              View Full Analytics
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </motion.div>

        {/* ── 6. SYLLABUS SNAPSHOT ─────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.32 }}>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Syllabus Progress</h2>
            <Link to="/syllabus" onClick={onClose} className="text-xs text-violet-600 font-semibold flex items-center gap-1 hover:underline">
              Full syllabus <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 gap-3">
            {/* Overall bar card */}
            <div className="rounded-2xl border border-emerald-200 dark:border-emerald-800/40 bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-900/20 dark:to-teal-900/10 p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[13px] font-black text-slate-900 dark:text-white">Overall Coverage</p>
                  <p className="text-[11px] text-slate-500">{syllabusSubjects.reduce((n, s) => n + s.chapters.filter(c => c.status === "done").length, 0)} / {syllabusSubjects.reduce((n, s) => n + s.chapters.length, 0)} chapters done</p>
                </div>
              </div>
              <div className="h-3 rounded-full bg-emerald-100 dark:bg-emerald-900/30 overflow-hidden">
                <div className="h-full rounded-full bg-emerald-500 transition-all duration-1000" style={{ width: `${syllabusPercent}%` }} />
              </div>
              <p className="text-right text-[11px] font-bold text-emerald-600 mt-1">{syllabusPercent}%</p>
            </div>

            {/* Per-subject mini grid */}
            <div className="rounded-2xl border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0f1420] p-4 grid grid-cols-2 gap-y-2.5 gap-x-3">
              {syllabusSubjects.slice(0, 6).map((subj) => {
                const total = subj.chapters.length;
                const done  = subj.chapters.filter(c => c.status === "done").length;
                const pct   = total > 0 ? Math.round((done / total) * 100) : 0;
                const col   = subjectColor(subj.name);
                return (
                  <div key={subj.id} className="flex items-center gap-2 min-w-0">
                    <span className="text-sm">{subj.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between text-[10px] text-slate-500 mb-0.5">
                        <span className="truncate">{subj.name}</span>
                        <span className={`font-bold ${col.text}`}>{pct}%</span>
                      </div>
                      <div className="h-1 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                        <div className={`h-full rounded-full ${col.bar}`} style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* ── 7. PREMIUM CTA BANNER ────────────────────────────── */}
        <motion.div initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.38 }}>
          <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8"
            style={{ background: "linear-gradient(135deg, #ea580c 0%, #dc2626 50%, #9f1239 100%)" }}>
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute -top-4 -right-4 w-40 h-40 bg-orange-400/20 rounded-full blur-2xl" />
              <div className="absolute bottom-0 left-12 w-32 h-32 bg-red-900/30 rounded-full blur-2xl" />
            </div>
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-5 sm:gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="w-4 h-4 text-yellow-300 fill-yellow-300" />
                  <span className="text-xs font-black text-yellow-300 uppercase tracking-wider">Unlock More</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">AI-Powered Unlimited Practice</h3>
                <p className="text-sm text-red-100/80 mb-4 leading-relaxed">
                  Get unlimited AI-generated questions, subject-wise weak-area detection, detailed answer explanations, email reports & daily AI study targets.
                </p>
                <div className="flex flex-wrap gap-2">
                  {["✓ Unlimited MCQs", "✓ Weak area AI plan", "✓ Email reports", "✓ Leaderboard"].map(f => (
                    <span key={f} className="text-[11px] bg-white/15 border border-white/20 text-white px-2.5 py-1 rounded-full font-semibold">{f}</span>
                  ))}
                </div>
              </div>
              <div className="flex flex-col items-center gap-3">
                <Button
                  onClick={() => { onClose?.(); navigate("/govt-practice"); }}
                  className="bg-white text-orange-600 hover:bg-orange-50 font-black text-base px-6 h-12 rounded-2xl gap-2 shadow-xl shadow-black/20 border-0"
                >
                  <Zap className="w-5 h-5" />
                  Start Free Practice
                </Button>
                <span className="text-[11px] text-red-200">No credit card needed</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── 8. QUICK LINKS FOOTER ROW ────────────────────────── */}
        <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.42 }}>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "🎙️", label: "Voice Interview", sub: "Mock interview practice", to: "/setup" },
              { icon: "📅", label: "Daily Tasks",   sub: "Today's challenge set",   to: "/daily-tasks" },
              { icon: "🏆", label: "Leaderboard",   sub: "See your rank",            to: "/leaderboard" },
              { icon: "💬", label: "AI Chatbot",    sub: "Ask any exam question",    to: "/chatbot" },
            ].map((l, i) => (
              <Link key={i} to={l.to} onClick={onClose}
                className="flex items-center gap-3 p-4 rounded-2xl border border-slate-200 dark:border-slate-700/40 bg-white dark:bg-[#0f1420] hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-sm transition-all group">
                <span className="text-2xl">{l.icon}</span>
                <div className="min-w-0">
                  <p className="text-[13px] font-bold text-slate-800 dark:text-white group-hover:text-violet-700 dark:group-hover:text-violet-300 transition-colors">{l.label}</p>
                  <p className="text-[10px] text-slate-400 truncate">{l.sub}</p>
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* bottom spacer */}
        <div className="h-4" />
      </main>
    </div>
  );
}
