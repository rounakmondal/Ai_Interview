import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { isLoggedIn } from "@/lib/auth-api";
import { fetchMockTestPaper, type MockPaperResponse } from "@/lib/mock-test-paper";
import {
  Eye, Timer, Sparkles, ArrowRight, LogIn, Loader2,
  FileText, Trophy, Clock, Brain, RefreshCw,
} from "lucide-react";

/* ─── Cache helpers ─────────────────────────────────────────────────────── */
const DAILY_KEY = "todays_mock_test";
const REFRESH_HOUR = 16; // 4 PM

interface DailyCache {
  data: MockPaperResponse;
  date: string;        // "YYYY-MM-DD"
  hour: number;
  refreshedAt4PM: boolean;
}

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

function getCache(): DailyCache | null {
  try {
    const raw = localStorage.getItem(DAILY_KEY);
    return raw ? (JSON.parse(raw) as DailyCache) : null;
  } catch {
    return null;
  }
}

function setCache(data: MockPaperResponse) {
  const now = new Date();
  const c: DailyCache = {
    data,
    date: todayStr(),
    hour: now.getHours(),
    refreshedAt4PM: now.getHours() >= REFRESH_HOUR,
  };
  localStorage.setItem(DAILY_KEY, JSON.stringify(c));
}

function needsRefresh(c: DailyCache | null): boolean {
  if (!c) return true;
  const today = todayStr();
  if (c.date !== today) return true;
  if (new Date().getHours() >= REFRESH_HOUR && !c.refreshedAt4PM) return true;
  return false;
}

function getUserExam(): string | null {
  try {
    const raw = localStorage.getItem("upcoming_exam");
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed.exam ?? null;
  } catch {
    return null;
  }
}

/* ─── Component ─────────────────────────────────────────────────────────── */

type Status = "idle" | "loading" | "ready" | "error";

export default function TodaysMockTest() {
  const navigate = useNavigate();
  const [status, setStatus] = useState<Status>("idle");
  const [paper, setPaper] = useState<MockPaperResponse | null>(null);
  const [examType, setExamType] = useState<string>("WBCS");

  useEffect(() => {
    const exam = getUserExam() ?? "WBCS";
    setExamType(exam);

    const cached = getCache();
    if (!needsRefresh(cached)) {
      setPaper(cached!.data);
      setStatus("ready");
      return;
    }

    // Auto-generate
    setStatus("loading");
    fetchMockTestPaper(exam)
      .then((res) => {
        setPaper(res);
        setCache(res);
        setStatus("ready");
      })
      .catch(() => {
        // If stale cache exists, serve it
        if (cached) {
          setPaper(cached.data);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      });
  }, []);

  const loggedIn = isLoggedIn();

  const goViewPaper = () => {
    if (!loggedIn) {
      navigate("/auth");
      return;
    }
    navigate(`/mock-test?exam=${encodeURIComponent(examType)}`);
  };

  const goAttempt = () => {
    if (!loggedIn) {
      navigate("/auth");
      return;
    }
    navigate(`/mock-test?exam=${encodeURIComponent(examType)}`);
  };

  const formattedDate = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  /* ── Not logged in ─────────────────────────────────────────────── */
  if (!loggedIn) {
    return (
      <section className="w-full py-12 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 shadow-2xl">
            {/* background accents */}
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-purple-500/10 blur-3xl" />

            <div className="relative z-10 flex flex-col items-center text-center gap-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-amber-300 uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Today&apos;s Mock Test
              </span>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white leading-tight">
                Get Your Daily Practice Paper
              </h2>
              <p className="text-slate-400 text-sm max-w-md">
                Login to access AI-generated fresh mock tests every morning &amp; 4 PM — tailored to your exam.
              </p>
              <button
                onClick={() => navigate("/auth")}
                className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 px-7 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <LogIn className="w-4 h-4" /> Login to Start
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Loading / Generating ──────────────────────────────────────── */
  if (status === "loading") {
    return (
      <section className="w-full py-12 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 p-8 md:p-12 shadow-2xl">
            <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
            <div className="relative z-10 flex flex-col items-center text-center gap-5">
              <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-amber-300 uppercase">
                <Sparkles className="w-3.5 h-3.5" /> Generating Today&apos;s Paper
              </span>
              <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Questions are being generated…
              </h2>
              <p className="text-slate-400 text-sm max-w-md">
                Our AI engine is curating your daily <span className="text-indigo-300 font-semibold">{examType}</span> paper. Check back in a few minutes.
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  /* ── Error ──────────────────────────────────────────────────────── */
  if (status === "error") {
    return (
      <section className="w-full py-12 px-4">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-red-500/20 bg-gradient-to-br from-slate-900 via-red-950/20 to-slate-900 p-8 md:p-12 shadow-2xl text-center">
            <RefreshCw className="w-8 h-8 text-red-400 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-white mb-2">Couldn&apos;t load today&apos;s paper</h2>
            <p className="text-slate-400 text-sm mb-5">Something went wrong. Try refreshing.</p>
            <button
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/20 transition-colors"
            >
              <RefreshCw className="w-4 h-4" /> Retry
            </button>
          </div>
        </div>
      </section>
    );
  }

  /* ── Ready — Two card layout ──────────────────────────────────── */
  const totalQ = paper?.meta.total_questions ?? 0;
  const duration = paper?.meta.duration_minutes ?? 60;

  return (
    <section className="w-full py-12 px-4">
      <div className="mx-auto max-w-5xl">
        {/* header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-amber-400/10 px-4 py-1.5 text-xs font-semibold tracking-wider text-amber-400 uppercase mb-3">
              <Sparkles className="w-3.5 h-3.5" /> Fresh Daily
            </span>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
              Today&apos;s Mock Test
            </h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{formattedDate}</p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-4 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wider">
            <Brain className="w-3.5 h-3.5" /> {examType}
          </span>
        </div>

        {/* cards */}
        <div className="grid md:grid-cols-2 gap-5">
          {/* View Paper */}
          <button
            onClick={goViewPaper}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 text-left shadow-sm hover:shadow-xl hover:border-amber-300/50 dark:hover:border-amber-400/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-amber-400 to-orange-400" />
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-400 shadow-lg shadow-amber-400/20">
                <Eye className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">View Paper</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Study questions &amp; answers at your own pace
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 text-[11px] font-semibold text-amber-600 dark:text-amber-300">
                    <FileText className="w-3 h-3" /> {totalQ}+ Questions
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 text-[11px] font-semibold text-emerald-600 dark:text-emerald-300">
                    Answer Key
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-500 group-hover:text-amber-600 transition-colors uppercase tracking-wider">
                  Explore Paper <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>

          {/* Take Mock Exam */}
          <button
            onClick={goAttempt}
            className="group relative overflow-hidden rounded-2xl border border-slate-200 dark:border-white/10 bg-white dark:bg-white/5 p-6 text-left shadow-sm hover:shadow-xl hover:border-indigo-300/50 dark:hover:border-indigo-400/30 transition-all duration-300 hover:-translate-y-0.5"
          >
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 to-purple-500" />
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/20">
                <Timer className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Take Mock Exam</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-3">
                  Timed exam with live scoring &amp; AI review
                </p>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-indigo-300">
                    <Clock className="w-3 h-3" /> {duration} Min Timer
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full bg-purple-50 dark:bg-purple-500/10 px-2.5 py-1 text-[11px] font-semibold text-purple-600 dark:text-purple-300">
                    <Trophy className="w-3 h-3" /> Live Score
                  </span>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-500 group-hover:text-indigo-600 transition-colors uppercase tracking-wider">
                  Launch Exam <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </span>
              </div>
            </div>
          </button>
        </div>

        {/* footer badge */}
        <div className="flex justify-center mt-6">
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 dark:bg-white/5 px-5 py-2 text-[11px] font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
            <Sparkles className="w-3 h-3 text-amber-400" /> Questions generated fresh daily
          </span>
        </div>
      </div>
    </section>
  );
}
