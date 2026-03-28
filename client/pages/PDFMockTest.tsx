import { useState, useEffect, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  ArrowLeft,
  Clock,
  CheckCircle2,
  XCircle,
  Zap,
  Flag,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  BookOpen,
  Brain,
  Target,
  Award,
  RotateCcw,
  TrendingUp,
  Shield,
  Sparkles,
  BarChart3,
  Eye,
  ListChecks,
  Eraser,
  Send,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { usePDFMockTest } from "@/hooks/use-pdf-mock-test";
import { applyPdfMockTestSeo } from "@/lib/exam-seo";

/* ─── Helpers ──────────────────────────────────────────────────────────────── */

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60)
    .toString()
    .padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

const OPTION_LABELS = ["A", "B", "C", "D"];

const DIFF_STYLES: Record<string, { label: string; cls: string }> = {
  Easy: { label: "Easy", cls: "bg-emerald-100 text-emerald-700 border-emerald-300" },
  Medium: { label: "Medium", cls: "bg-amber-100 text-amber-700 border-amber-300" },
  Hard: { label: "Hard", cls: "bg-red-100 text-red-700 border-red-300" },
};

/* ─── Loading Pulse Dots ───────────────────────────────────────────────────── */

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-2.5 h-2.5 rounded-full bg-indigo-500"
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.15 }}
        />
      ))}
    </div>
  );
}

/* ─── Score Ring (SVG radial progress) ──────────────────────────────────────── */

function ScoreRing({ percentage, size = 160 }: { percentage: number; size?: number }) {
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  const color =
    percentage >= 70 ? "#10b981" : percentage >= 50 ? "#f59e0b" : "#ef4444";

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className="text-4xl font-black"
          style={{ color }}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {percentage}%
        </motion.span>
        <span className="text-xs text-slate-400 font-medium">Score</span>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════════════════════════ */

export default function PDFMockTest() {
  const location = useLocation();
  const state = location.state as {
    pdfPath?: string;
    pdfFileName?: string;
    testType?: string;
    folder?: string;
  } | null;

  /* ── No PDF Selected ─────────────────────────────────────────────────────── */
  if (!state?.pdfPath) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(239,68,68,0.06),transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center relative z-10 max-w-md mx-4"
        >
          <div className="w-20 h-20 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100/40">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">
            No PDF Selected
          </h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            Please select a question paper from the Question Hub to start a mock test.
          </p>
          <Link to="/question-hub">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold h-12 px-8 rounded-2xl gap-2 border-0 shadow-lg shadow-indigo-200/40">
              <ArrowLeft className="w-4 h-4" />
              Go to Question Hub
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return <TestEngine pdfPath={state.pdfPath} pdfFileName={state.pdfFileName ?? ""} folder={state.folder ?? ""} />;
}

/* ═══════════════════════════════════════════════════════════════════════════════
   TEST ENGINE (extracted to avoid hooks after early return)
   ═══════════════════════════════════════════════════════════════════════════════ */

function TestEngine({ pdfPath, pdfFileName, folder }: { pdfPath: string; pdfFileName: string; folder: string }) {
  const test = usePDFMockTest({
    pdfPath,
    onError: (error) => console.error("Test error:", error),
  });

  const [showInstructions, setShowInstructions] = useState(true);
  const [showNav, setShowNav] = useState(false); // mobile sidebar toggle
  const [showReview, setShowReview] = useState(false); // results review toggle
  const [customDuration, setCustomDuration] = useState<number | null>(null); // user-picked duration (minutes)

  const LOADING_MSGS = [
    "Loading question paper…",
    "Parsing questions…",
    "Preparing your test…",
    "Almost ready…",
  ];
  const [loadingMsgIdx, setLoadingMsgIdx] = useState(0);

  useEffect(() => {
    if (!test.loading) return;
    const id = setInterval(() => setLoadingMsgIdx((p) => Math.min(p + 1, LOADING_MSGS.length - 1)), 1200);
    return () => clearInterval(id);
  }, [test.loading]);

  useEffect(() => {
    applyPdfMockTestSeo(folder, pdfFileName);
  }, [folder, pdfFileName]);

  // Calculations for the results page
  const resultData = useMemo(() => {
    if (!test.submitted) return null;

    let correct = 0;
    let wrong = 0;
    let skipped = 0;
    const bySubject: Record<string, { correct: number; wrong: number; total: number }> = {};

    for (const q of test.questions) {
      if (!bySubject[q.subject]) bySubject[q.subject] = { correct: 0, wrong: 0, total: 0 };
      bySubject[q.subject].total++;
      const ans = test.answers[q.id];
      if (ans === undefined || ans === null) {
        skipped++;
      } else if (q.correct_index !== undefined && ans === q.correct_index) {
        correct++;
        bySubject[q.subject].correct++;
      } else {
        wrong++;
        bySubject[q.subject].wrong++;
      }
    }
    const percentage = test.questions.length > 0 ? Math.round((correct / test.questions.length) * 100) : 0;

    return { correct, wrong, skipped, bySubject, percentage };
  }, [test.submitted, test.questions, test.answers]);

  /* ── ERROR SCREEN ────────────────────────────────────────────────────────── */
  if (test.error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(239,68,68,0.06),transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-4 relative z-10"
        >
          <div className="w-20 h-20 rounded-3xl bg-red-50 border border-red-200 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-red-100/40">
            <AlertCircle className="w-10 h-10 text-red-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">Unable to Load Test</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">{test.error}</p>
          <div className="flex gap-3">
            <Link to="/question-hub" className="flex-1">
              <Button variant="outline" className="w-full h-12 rounded-2xl font-semibold gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Hub
              </Button>
            </Link>
            <Button
              onClick={() => window.location.reload()}
              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold h-12 rounded-2xl gap-2 border-0"
            >
              <RotateCcw className="w-4 h-4" />
              Retry
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  /* ── LOADING SCREEN ──────────────────────────────────────────────────────── */
  if (test.loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        {/* Ambient circles */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.06),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-indigo-50/60 blur-3xl pointer-events-none" />
        <div className="absolute top-20 -right-32 w-64 h-64 rounded-full bg-purple-50/60 blur-3xl pointer-events-none" />

        {/* Back button */}
        <Link
          to="/question-hub"
          className="absolute top-5 left-5 z-20 flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        <div className="relative text-center space-y-6 z-10">
          {/* Animated ring */}
          <div className="relative w-28 h-28 mx-auto">
            <svg className="w-28 h-28 -rotate-90 animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 112 112">
              <circle cx="56" cy="56" r="48" fill="none" stroke="rgba(99,102,241,0.1)" strokeWidth="7" />
              <circle cx="56" cy="56" r="48" fill="none" stroke="url(#loader-grad)" strokeWidth="7"
                strokeLinecap="round" strokeDasharray="301" strokeDashoffset="226" />
              <defs>
                <linearGradient id="loader-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-10 h-10 text-indigo-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-black text-slate-900">Preparing Your Test</h2>
            <p className="text-slate-400 text-sm min-h-[20px] transition-all">{LOADING_MSGS[loadingMsgIdx]}</p>
          </div>

          {/* Step dots */}
          <div className="flex items-center justify-center gap-2">
            {LOADING_MSGS.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-500 ${
                i < loadingMsgIdx ? "w-2 h-2 bg-indigo-500" : i === loadingMsgIdx ? "w-3 h-3 bg-indigo-400 animate-pulse" : "w-2 h-2 bg-slate-200"
              }`} />
            ))}
          </div>

          <p className="text-xs text-slate-400">{pdfFileName}</p>
        </div>
      </div>
    );
  }

  /* ── NO QUESTIONS ────────────────────────────────────────────────────────── */
  if (test.questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(245,158,11,0.06),transparent)]" />
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md mx-4 relative z-10"
        >
          <div className="w-20 h-20 rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-amber-100/40">
            <AlertCircle className="w-10 h-10 text-amber-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-3">No Questions Found</h1>
          <p className="text-slate-500 mb-8 leading-relaxed">
            We couldn't extract questions from this file. Try another paper or contact support.
          </p>
          <Link to="/question-hub">
            <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold h-12 px-8 rounded-2xl gap-2 border-0 shadow-lg shadow-indigo-200/40">
              <ArrowLeft className="w-4 h-4" />
              Back to Question Hub
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  /* ── INSTRUCTIONS SCREEN ─────────────────────────────────────────────────── */
  if (showInstructions && !test.submitted && test.questions.length > 0) {
    const activeDuration = customDuration ?? test.duration;
    const perQ = test.questions.length > 0 ? (activeDuration * 60 / test.questions.length).toFixed(0) : "0";
    const TIMER_PRESETS = [15, 30, 45, 60, 90, 120];

    const handleStartExam = () => {
      if (customDuration !== null) {
        test.setDuration(customDuration);
      }
      setShowInstructions(false);
    };

    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)]" />
        <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-40 -left-32 w-96 h-96 rounded-full bg-indigo-100/60 blur-3xl pointer-events-none" />
        <div className="absolute top-60 -right-32 w-96 h-96 rounded-full bg-purple-100/40 blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="container px-4 h-14 flex items-center gap-3 max-w-6xl mx-auto">
            <Link to="/question-hub" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Question Hub
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Mock Test</span>
            <div className="ml-auto">
              <ProfileButton />
            </div>
          </div>
        </header>

        <main className="relative z-10 container px-4 py-8 sm:py-12 max-w-3xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Hero */}
            <div className="text-center mb-8 sm:mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-xs text-indigo-600 mb-4">
                <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
                Previous Year Paper · Ready
              </div>
              <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3">
                {test.testTitle}
              </h1>
              <p className="text-slate-400 text-sm">{pdfFileName}</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              {[
                { icon: BookOpen, label: "Questions", value: String(test.questions.length), color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200", iconBg: "bg-indigo-100" },
                { icon: Clock, label: "Duration", value: `${activeDuration} min`, color: "text-amber-600", bg: "bg-amber-50 border-amber-200", iconBg: "bg-amber-100" },
                { icon: Zap, label: "Per Question", value: `${perQ}s`, color: "text-orange-600", bg: "bg-orange-50 border-orange-200", iconBg: "bg-orange-100" },
              ].map((s) => (
                <motion.div key={s.label} whileHover={{ scale: 1.02 }} className={`${s.bg} border rounded-2xl p-4 sm:p-5 text-center`}>
                  <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl ${s.iconBg} flex items-center justify-center mx-auto mb-3`}>
                    <s.icon className={`w-5 h-5 sm:w-6 sm:h-6 ${s.color}`} />
                  </div>
                  <p className={`text-xl sm:text-2xl font-black ${s.color}`}>{s.value}</p>
                  <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>

            {/* ── Set Your Timer ──────────────────────────────────────────── */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50/30 border border-amber-200 rounded-2xl p-5 sm:p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Set Your Timer</h3>
                  <p className="text-[11px] text-slate-400">Choose a preset or enter custom minutes</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mb-3">
                {TIMER_PRESETS.map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setCustomDuration(mins === test.duration && customDuration === null ? null : mins)}
                    className={`px-4 py-2 rounded-xl text-sm font-semibold border-2 transition-all ${
                      activeDuration === mins
                        ? "bg-amber-500 text-white border-amber-500 shadow-lg shadow-amber-200/40"
                        : "bg-white text-slate-600 border-slate-200 hover:border-amber-300 hover:text-amber-600"
                    }`}
                  >
                    {mins}m
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs text-slate-400 font-medium">Custom:</span>
                <input
                  type="number"
                  min={5}
                  max={300}
                  placeholder="minutes"
                  value={customDuration ?? ""}
                  onChange={(e) => {
                    const v = parseInt(e.target.value);
                    setCustomDuration(isNaN(v) || v < 1 ? null : Math.min(v, 300));
                  }}
                  className="w-24 px-3 py-2 rounded-xl border-2 border-slate-200 focus:border-amber-400 focus:outline-none text-sm font-semibold text-slate-700 bg-white transition-colors"
                />
                <span className="text-xs text-slate-400">min</span>
                {customDuration !== null && customDuration !== test.duration && (
                  <button
                    onClick={() => setCustomDuration(null)}
                    className="text-xs text-slate-400 hover:text-red-500 transition-colors underline ml-auto"
                  >
                    Reset to default ({test.duration}m)
                  </button>
                )}
              </div>
            </div>

            {/* Instructions Card */}
            <div className="bg-gradient-to-br from-slate-50 to-indigo-50/30 border border-slate-200 rounded-2xl p-5 sm:p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <ListChecks className="w-5 h-5 text-indigo-600" />
                </div>
                <h3 className="font-bold text-slate-900">Test Instructions</h3>
              </div>
              <div className="space-y-3">
                {[
                  { icon: Clock, text: `Complete all questions within ${activeDuration} minutes`, color: "text-amber-500" },
                  { icon: Flag, text: "Flag difficult questions to revisit later", color: "text-orange-500" },
                  { icon: Target, text: "Navigate freely between any question", color: "text-emerald-500" },
                  { icon: BarChart3, text: "Get detailed results with per-question analysis", color: "text-indigo-500" },
                  { icon: Shield, text: "Auto-submit when time runs out", color: "text-rose-500" },
                ].map(({ icon: Icon, text, color }) => (
                  <div key={text} className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                      <Icon className={`w-3.5 h-3.5 ${color}`} />
                    </div>
                    <span className="text-sm text-slate-600">{text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 sm:gap-4">
              <Link to="/question-hub" className="flex-1">
                <Button variant="outline" className="w-full h-12 sm:h-14 rounded-2xl font-semibold text-sm gap-2 border-2">
                  <ArrowLeft className="w-4 h-4" />
                  Cancel
                </Button>
              </Link>
              <Button
                onClick={handleStartExam}
                className="flex-[2] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white font-bold h-12 sm:h-14 rounded-2xl text-sm gap-2 border-0 shadow-xl shadow-indigo-200/40 transition-all"
              >
                <Zap className="w-5 h-5" />
                Start Exam Now
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>

            {/* Bottom Feature Strip */}
            <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
              {[
                { icon: Shield, label: "Exam Pattern", sub: "Authentic" },
                { icon: Brain, label: "JSON Source", sub: "Accurate data" },
                { icon: Target, label: "Scoring", sub: "Real-time" },
                { icon: TrendingUp, label: "Analysis", sub: "Detailed results" },
              ].map(({ icon: Icon, label, sub }) => (
                <div key={label} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="w-7 h-7 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                    <Icon className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-slate-700">{label}</p>
                    <p className="text-[9px] text-slate-400">{sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     EXAM ATTEMPT SCREEN
     ═══════════════════════════════════════════════════════════════════════════ */
  if (!test.submitted && test.questions.length > 0) {
    const q = test.currentQuestionData;
    if (!q) return null;

    const currentAnswer = test.answers[q.id];
    const isAnswered = currentAnswer !== null && currentAnswer !== undefined;
    const isFlagged = test.flagged.has(test.currentQuestion);
    const totalAnswered = Object.values(test.answers).filter((a) => a !== null && a !== undefined).length;
    const timerCritical = test.timeRemaining <= 300;
    const timerWarning = test.timeRemaining <= 900;
    const diff = DIFF_STYLES[q.difficulty] ?? DIFF_STYLES.Medium;

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">

        {/* ── Exam Header ────────────────────────────────────────────────── */}
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
          <div className="container px-3 sm:px-4 max-w-7xl mx-auto h-14 sm:h-16 flex items-center gap-2 sm:gap-4">
            {/* Left */}
            <div className="flex items-center gap-2 sm:gap-3 flex-1 min-w-0">
              <Link to="/question-hub" className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300 transition-all text-xs font-semibold flex-shrink-0">
                <ArrowLeft className="w-3.5 h-3.5" />
                Exit Test
              </Link>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-bold text-slate-900 truncate">{test.testTitle}</span>
                <span className="text-[10px] text-slate-400">{pdfFileName}</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-600">
                Q {test.currentQuestion + 1}/{test.questions.length}
              </div>
            </div>

            {/* Center: Timer */}
            <div className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-2xl border font-mono transition-all ${
              timerCritical
                ? "bg-red-50 border-red-300 text-red-600 animate-pulse"
                : timerWarning
                  ? "bg-amber-50 border-amber-300 text-amber-600"
                  : "bg-slate-50 border-slate-200 text-slate-700"
            }`}>
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-lg sm:text-xl font-black tabular-nums tracking-widest">{formatTime(test.timeRemaining)}</span>
            </div>

            {/* Right */}
            <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span className="text-[10px] text-slate-400 font-medium">{totalAnswered}/{test.questions.length}</span>
                <Progress value={(totalAnswered / test.questions.length) * 100} className="w-20 h-1" />
              </div>
              <button
                onClick={() => test.finalize()}
                className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-all border border-emerald-500/30 shadow-lg shadow-emerald-200"
              >
                <Send className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Submit</span>
              </button>
              {/* Mobile nav toggle */}
              <button
                onClick={() => setShowNav(!showNav)}
                className="lg:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 text-slate-500"
              >
                <ListChecks className="w-4 h-4" />
              </button>
            </div>
          </div>
        </header>

        {/* ── Main content ─────────────────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Question Panel (scrollable) ───────────────────────────────── */}
          <main className="flex-1 overflow-y-auto">
            <div className="container px-3 sm:px-4 py-5 sm:py-6 max-w-3xl mx-auto space-y-5">

              {/* Question card */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={q.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white"
                >
                  {/* Subject strip */}
                  <div className="px-4 sm:px-5 py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 flex items-center gap-3 flex-wrap">
                    <span className="text-xl sm:text-2xl font-black text-white/20 tabular-nums select-none">
                      {String(test.currentQuestion + 1).padStart(2, "0")}
                    </span>
                    <div className="w-px h-5 bg-white/15" />
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${diff.cls}`}>
                      {diff.label}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/70 border border-white/10 font-medium">
                      {q.subject}
                    </span>
                    <button
                      onClick={() => test.toggleFlag()}
                      className={`ml-auto flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                        isFlagged
                          ? "bg-amber-100 text-amber-700 border-amber-400"
                          : "bg-white/15 text-white/60 border-white/15 hover:text-amber-300"
                      }`}
                    >
                      <Flag className={`w-3 h-3 ${isFlagged ? "fill-current" : ""}`} />
                      {isFlagged ? "Flagged" : "Flag"}
                    </button>
                  </div>

                  {/* Question text */}
                  <div className="px-5 sm:px-6 py-5 sm:py-6">
                    <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">{q.question}</p>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Options */}
              <div className="space-y-2.5">
                {q.options.map((option, idx) => {
                  const isSelected = currentAnswer === idx;
                  return (
                    <motion.button
                      key={idx}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => test.answerQuestion(idx)}
                      className={`w-full flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 sm:py-4 rounded-2xl border-2 text-left transition-all duration-150 group ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-400 shadow-lg shadow-indigo-100/60 scale-[1.005]"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300 hover:shadow-sm"
                      }`}
                    >
                      <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                        isSelected
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                      }`}>
                        {OPTION_LABELS[idx]}
                      </div>
                      <span className={`text-sm sm:text-[15px] leading-relaxed flex-1 transition-colors ${
                        isSelected ? "text-indigo-700 font-semibold" : "text-slate-600 group-hover:text-slate-800"
                      }`}>
                        {option}
                      </span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />}
                    </motion.button>
                  );
                })}
              </div>

              {/* Bottom actions */}
              <div className="flex items-center gap-3 pt-2">
                {isAnswered && (
                  <button
                    onClick={() => test.clearAnswer()}
                    className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Eraser className="w-3.5 h-3.5" />
                    Clear selection
                  </button>
                )}
                <div className="flex-1" />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => test.previousQuestion()}
                  disabled={test.currentQuestion === 0}
                  className="rounded-xl h-10 px-4 gap-1 border-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Prev
                </Button>
                <Button
                  size="sm"
                  onClick={() => test.nextQuestion()}
                  disabled={test.currentQuestion === test.questions.length - 1}
                  className="rounded-xl h-10 px-4 gap-1 bg-slate-800 hover:bg-slate-700 text-white border-0"
                >
                  Next
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </main>

          {/* ── Sidebar: Question Navigator (Desktop) ──────────────────────── */}
          <aside className="hidden lg:block w-96 border-l border-slate-200 bg-white overflow-y-auto">
            <div className="p-5 space-y-5">
              <div>
                <h3 className="font-bold text-sm text-slate-900 mb-3">Progress</h3>
                <Progress value={test.progress} className="mb-3 h-2" />
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                    <p className="text-lg font-black text-emerald-600">{test.stats.answered}</p>
                    <p className="text-[9px] text-emerald-500 uppercase tracking-wider">Answered</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                    <p className="text-lg font-black text-slate-500">{test.stats.unanswered}</p>
                    <p className="text-[9px] text-slate-400 uppercase tracking-wider">Remaining</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                    <p className="text-lg font-black text-amber-600">{test.stats.flagged}</p>
                    <p className="text-[9px] text-amber-500 uppercase tracking-wider">Flagged</p>
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 text-[9px] font-medium">
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-emerald-400" />Answered</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-blue-400" />Visited</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded bg-slate-300" />Not visited</span>
                <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded ring-2 ring-amber-400" />Flagged</span>
              </div>

              {/* Question Grid */}
              <div className="grid grid-cols-6 gap-1.5 max-h-[500px] overflow-y-auto pr-1">
                {test.questions.map((_, idx) => {
                  const answer = test.answers[test.questions[idx].id];
                  const flagged = test.flagged.has(idx);
                  const visited = test.visited.has(idx);

                  return (
                    <button
                      key={idx}
                      onClick={() => test.goToQuestion(idx)}
                      className={`aspect-square text-xs font-bold rounded-lg flex items-center justify-center transition-all hover:scale-105 ${
                        idx === test.currentQuestion ? "ring-2 ring-indigo-500 ring-offset-1" : ""
                      } ${
                        answer !== null && answer !== undefined
                          ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                          : visited
                            ? "bg-blue-50 text-blue-600 border border-blue-200"
                            : "bg-slate-100 text-slate-400 border border-slate-200"
                      } ${flagged ? "ring-1 ring-amber-400" : ""}`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>

              <Button
                onClick={() => test.finalize()}
                className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-12 rounded-2xl gap-2 border-0 shadow-lg shadow-emerald-200/40"
              >
                <Send className="w-4 h-4" />
                Submit Test
              </Button>
            </div>
          </aside>
        </div>

        {/* ── Mobile Bottom Drawer ─────────────────────────────────────────── */}
        <AnimatePresence>
          {showNav && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/30 z-50 lg:hidden"
                onClick={() => setShowNav(false)}
              />
              <motion.div
                initial={{ y: "100%" }}
                animate={{ y: 0 }}
                exit={{ y: "100%" }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 rounded-t-3xl z-50 lg:hidden max-h-[70vh] overflow-y-auto shadow-2xl"
              >
                <div className="p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900">Question Navigator</h3>
                    <button onClick={() => setShowNav(false)} className="text-slate-400 hover:text-slate-700">
                      <ChevronDown className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-2.5">
                      <p className="text-lg font-black text-emerald-600">{test.stats.answered}</p>
                      <p className="text-[9px] text-emerald-500 uppercase">Answered</p>
                    </div>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-2.5">
                      <p className="text-lg font-black text-slate-500">{test.stats.unanswered}</p>
                      <p className="text-[9px] text-slate-400 uppercase">Remaining</p>
                    </div>
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5">
                      <p className="text-lg font-black text-amber-600">{test.stats.flagged}</p>
                      <p className="text-[9px] text-amber-500 uppercase">Flagged</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-8 gap-1.5">
                    {test.questions.map((_, idx) => {
                      const answer = test.answers[test.questions[idx].id];
                      const flagged = test.flagged.has(idx);
                      const visited = test.visited.has(idx);
                      return (
                        <button
                          key={idx}
                          onClick={() => { test.goToQuestion(idx); setShowNav(false); }}
                          className={`aspect-square text-xs font-bold rounded-lg flex items-center justify-center transition-all ${
                            idx === test.currentQuestion ? "ring-2 ring-indigo-500" : ""
                          } ${
                            answer !== null && answer !== undefined
                              ? "bg-emerald-100 text-emerald-700 border border-emerald-300"
                              : visited
                                ? "bg-blue-50 text-blue-600 border border-blue-200"
                                : "bg-slate-100 text-slate-400 border border-slate-200"
                          } ${flagged ? "ring-1 ring-amber-400" : ""}`}
                        >
                          {idx + 1}
                        </button>
                      );
                    })}
                  </div>

                  <Button
                    onClick={() => { test.finalize(); setShowNav(false); }}
                    className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold h-12 rounded-2xl gap-2 border-0"
                  >
                    <Send className="w-4 h-4" />
                    Submit Test
                  </Button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }

  /* ═══════════════════════════════════════════════════════════════════════════
     RESULTS SCREEN
     ═══════════════════════════════════════════════════════════════════════════ */
  if (test.submitted && resultData) {
    const { correct, wrong, skipped, bySubject, percentage } = resultData;

    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Ambient BG */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.06),transparent)]" />

        {/* Header */}
        <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="container px-4 h-14 flex items-center gap-3 max-w-6xl mx-auto">
            <Link to="/question-hub" className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Question Hub
            </Link>
            <div className="w-px h-4 bg-slate-200" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Results</span>
            <div className="ml-auto">
              <ProfileButton />
            </div>
          </div>
        </header>

        <main className="relative z-10 container px-4 py-8 sm:py-12 max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>

            {/* Top Hero */}
            <div className="text-center mb-8 sm:mb-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 15, stiffness: 200, delay: 0.2 }}
              >
                <div className="mx-auto mb-6">
                  <ScoreRing percentage={percentage} />
                </div>
              </motion.div>

              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
                  {percentage >= 70 ? "Excellent Performance! 🎉" : percentage >= 50 ? "Good Effort! 👍" : "Keep Practicing! 💪"}
                </h1>
                <p className="text-slate-500">
                  You scored <strong className="text-slate-800">{correct}</strong> out of <strong className="text-slate-800">{test.questions.length}</strong> questions
                </p>
              </motion.div>
            </div>

            {/* Stats Grid */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }} className="grid grid-cols-3 gap-3 sm:gap-4 mb-8">
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-emerald-100 flex items-center justify-center mx-auto mb-2">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-600" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">{correct}</p>
                <p className="text-[10px] sm:text-xs text-emerald-500 uppercase tracking-wider">Correct</p>
              </div>
              <div className="bg-red-50 border border-red-200 rounded-2xl p-4 sm:p-5 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-red-100 flex items-center justify-center mx-auto mb-2">
                  <XCircle className="w-5 h-5 sm:w-6 sm:h-6 text-red-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-red-500">{wrong}</p>
                <p className="text-[10px] sm:text-xs text-red-400 uppercase tracking-wider">Wrong</p>
              </div>
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 sm:p-5 text-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-slate-100 flex items-center justify-center mx-auto mb-2">
                  <Eye className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
                </div>
                <p className="text-2xl sm:text-3xl font-black text-slate-500">{skipped}</p>
                <p className="text-[10px] sm:text-xs text-slate-400 uppercase tracking-wider">Skipped</p>
              </div>
            </motion.div>

            {/* Subject Breakdown */}
            {Object.keys(bySubject).length > 1 && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }} className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <BarChart3 className="w-5 h-5 text-indigo-500" />
                  <h2 className="font-bold text-slate-900">Subject Breakdown</h2>
                </div>
                <div className="space-y-2">
                  {Object.entries(bySubject).map(([subject, data]) => {
                    const pct = data.total > 0 ? Math.round((data.correct / data.total) * 100) : 0;
                    return (
                      <div key={subject} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-slate-800 truncate">{subject}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 font-medium">{data.correct}/{data.total}</span>
                          </div>
                          <Progress value={pct} className="h-2" />
                        </div>
                        <span className={`text-lg font-black w-14 text-right ${
                          pct >= 70 ? "text-emerald-600" : pct >= 50 ? "text-amber-600" : "text-red-500"
                        }`}>{pct}%</span>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Question Review Toggle */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}>
              <button
                onClick={() => setShowReview(!showReview)}
                className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 transition-colors mb-4"
              >
                <div className="flex items-center gap-3">
                  <Eye className="w-5 h-5 text-indigo-500" />
                  <span className="font-semibold text-indigo-700 text-sm">Review All Questions</span>
                </div>
                {showReview ? <ChevronUp className="w-5 h-5 text-indigo-400" /> : <ChevronDown className="w-5 h-5 text-indigo-400" />}
              </button>

              <AnimatePresence>
                {showReview && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden space-y-3 mb-8"
                  >
                    {test.questions.map((question, idx) => {
                      const userAns = test.answers[question.id];
                      const correctIdx = question.correct_index ?? 0;
                      const isCorrect = userAns === correctIdx;
                      const wasSkipped = userAns === null || userAns === undefined;

                      return (
                        <div key={question.id} className={`rounded-2xl border p-4 sm:p-5 ${
                          wasSkipped ? "bg-slate-50 border-slate-200"
                            : isCorrect ? "bg-emerald-50/50 border-emerald-200"
                              : "bg-red-50/50 border-red-200"
                        }`}>
                          <div className="flex items-start gap-3 mb-3">
                            <span className="text-xs font-black text-slate-300 mt-0.5">Q{idx + 1}</span>
                            <p className="text-sm font-medium text-slate-800 leading-relaxed flex-1">{question.question}</p>
                            {wasSkipped ? (
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-500 font-semibold flex-shrink-0">Skipped</span>
                            ) : isCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                            )}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-1.5 ml-6">
                            {question.options.map((opt, oi) => (
                              <div key={oi} className={`text-xs px-3 py-2 rounded-lg border ${
                                oi === correctIdx
                                  ? "bg-emerald-100 border-emerald-300 text-emerald-700 font-semibold"
                                  : userAns === oi
                                    ? "bg-red-100 border-red-300 text-red-600"
                                    : "bg-white border-slate-200 text-slate-500"
                              }`}>
                                <span className="font-bold mr-1.5">{OPTION_LABELS[oi]}.</span>{opt}
                                {oi === correctIdx && <span className="ml-1">✓</span>}
                                {userAns === oi && oi !== correctIdx && <span className="ml-1">✗</span>}
                              </div>
                            ))}
                          </div>
                          {question.explanation && (
                            <p className="text-[11px] text-slate-500 mt-3 ml-6 italic leading-relaxed">
                              💡 {question.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Action buttons */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.6 }} className="flex gap-3 sm:gap-4">
              <Link to="/question-hub" className="flex-1">
                <Button variant="outline" className="w-full h-12 sm:h-14 rounded-2xl font-semibold text-sm gap-2 border-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Hub
                </Button>
              </Link>
              <Button
                onClick={() => window.location.reload()}
                className="flex-[2] bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700 hover:from-indigo-500 hover:via-purple-500 hover:to-indigo-600 text-white font-bold h-12 sm:h-14 rounded-2xl text-sm gap-2 border-0 shadow-xl shadow-indigo-200/40 transition-all"
              >
                <RotateCcw className="w-4 h-4" />
                Retake Test
              </Button>
            </motion.div>
          </motion.div>
        </main>
      </div>
    );
  }

  return null;
}
