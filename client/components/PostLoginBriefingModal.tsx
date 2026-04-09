import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  ChevronDown,
  Sparkles,
  BookOpen,
  Target,
  ArrowRight,
  LayoutGrid,
  Newspaper,
  GraduationCap,
  Shield,
  ClipboardList,
  Zap,
  Trophy,
  CheckCircle2,
  Circle,
  X,
  TrendingUp,
  Star,
} from "lucide-react";
import { isLoggedIn, getSession } from "@/lib/auth-api";
import {
  EXAM_LABELS,
  fetchCurrentAffairs,
  pickTodaysReelNews,
  getNewsBn,
  type NewsItem,
} from "@/lib/govt-practice-data";
import { getDailyTasks, type DailyTasksState } from "@/lib/daily-tasks";
import { fetchMockTestPaper, type MockPaperMeta } from "@/lib/mock-test-paper";

export const HOME_BRIEFING_DISMISS_DATE = "home_briefing_dismiss_date";
export const HOME_BRIEFING_FORCE_KEY = "home_briefing_force_show";

function dismissForToday() {
  const today = new Date().toISOString().split("T")[0];
  try {
    localStorage.setItem(HOME_BRIEFING_DISMISS_DATE, today);
    sessionStorage.removeItem(HOME_BRIEFING_FORCE_KEY);
  } catch { /* ignore */ }
}

function shouldOpenBriefing(): boolean {
  if (!isLoggedIn()) return false;
  const today = new Date().toISOString().split("T")[0];
  try {
    const dismissed = localStorage.getItem(HOME_BRIEFING_DISMISS_DATE) === today;
    const force = sessionStorage.getItem(HOME_BRIEFING_FORCE_KEY) === "1";
    if (dismissed && !force) return false;
    return true;
  } catch { return true; }
}

function isAnotherDialogOpen(): boolean {
  return !!document.querySelector('[data-state="open"][role="dialog"]');
}

const QUICK_LINKS = [
  { to: "/current-affairs",      labelBn: "সাম্প্রতিক ঘটনা",          label: "Current Affairs", icon: Newspaper,     color: "from-blue-500 to-cyan-500" },
  { to: "/daily-tasks",          labelBn: "আজকের টাস্ক",               label: "Daily Tasks",     icon: ClipboardList, color: "from-orange-500 to-amber-500" },
  { to: "/question-hub",         labelBn: "প্রশ্ন ব্যাংক",             label: "Previous Question Set",    icon: BookOpen,      color: "from-violet-500 to-purple-500" },
  { to: "/wbcs-mock-test",       labelBn: "WBCS মক টেস্ট",             label: "WBCS Mock",       icon: GraduationCap, color: "from-emerald-500 to-teal-500" },
  { to: "/wbp-police-mock-test", labelBn: "পুলিশ মক টেস্ট",            label: "WBP Mock",        icon: Shield,        color: "from-rose-500 to-pink-500" },
  { to: "/study-plan",           labelBn: "স্টাডি প্ল্যান",            label: "Study Plan",      icon: LayoutGrid,    color: "from-orange-500 to-red-500" },
];

export function requestPostLoginBriefing() {
  try { sessionStorage.setItem(HOME_BRIEFING_FORCE_KEY, "1"); } catch { /* ignore */ }
}

/* ─── Radial progress ring ──────────────────────────────────────────── */
function ProgressRing({ pct, size = 64 }: { pct: number; size?: number }) {
  const r = (size - 8) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * (pct / 100);
  return (
    <svg width={size} height={size} className="rotate-[-90deg]">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#1e293b" strokeWidth={6} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none"
        stroke="url(#ring-grad)" strokeWidth={6}
        strokeDasharray={`${dash} ${circ - dash}`}
        strokeLinecap="round"
        style={{ transition: "stroke-dasharray 0.6s cubic-bezier(.4,0,.2,1)" }}
      />
      <defs>
        <linearGradient id="ring-grad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ─── Main component ─────────────────────────────────────────────────── */
export default function PostLoginBriefingModal() {
  const [open, setOpen] = useState(false);
  const [reelNews, setReelNews] = useState<NewsItem[]>([]);
  const [reelIdx, setReelIdx] = useState(0);
  const [animDir, setAnimDir] = useState<"up" | "down" | null>(null);
  const [taskState, setTaskState] = useState<DailyTasksState | null>(() => getDailyTasks());
  const [recommendedMeta, setRecommendedMeta] = useState<MockPaperMeta | null>(null);
  const [recommendedLoading, setRecommendedLoading] = useState(false);
  const navigate = useNavigate();
  const touchY = useRef<number | null>(null);
  const openedOnceRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;
    let observer: MutationObserver | null = null;

    const openNow = () => {
      if (cancelled || openedOnceRef.current || !shouldOpenBriefing()) return;
      openedOnceRef.current = true;
      setOpen(true);
      fetchCurrentAffairs().then((data) => {
        if (!cancelled) setReelNews(pickTodaysReelNews(data.news, 6));
      });
      if (!cancelled) setTaskState(getDailyTasks());
    };

    const watchAndOpenWhenReady = () => {
      if (cancelled || openedOnceRef.current || !shouldOpenBriefing()) return;
      if (!isAnotherDialogOpen()) { openNow(); return; }
      observer = new MutationObserver(() => {
        if (cancelled || openedOnceRef.current) return;
        if (!isAnotherDialogOpen() && shouldOpenBriefing()) {
          observer?.disconnect(); observer = null; openNow();
        }
      });
      observer.observe(document.body, { attributes: true, childList: true, subtree: true });
      timeoutId = setTimeout(() => {
        observer?.disconnect(); observer = null;
        if (!cancelled && !openedOnceRef.current) watchAndOpenWhenReady();
      }, 25000);
    };

    timeoutId = setTimeout(watchAndOpenWhenReady, 600);
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
      observer?.disconnect(); observer = null;
    };
  }, []);

  const goReel = useCallback((dir: -1 | 1) => {
    setAnimDir(dir === 1 ? "up" : "down");
    setTimeout(() => setAnimDir(null), 320);
    setReelIdx((i) => {
      const n = reelNews.length;
      if (n === 0) return 0;
      return Math.max(0, Math.min(n - 1, i + dir));
    });
  }, [reelNews.length]);

  const onTouchStart = (e: React.TouchEvent) => { touchY.current = e.touches[0].clientY; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current == null) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    touchY.current = null;
    if (dy < -48) goReel(1);
    else if (dy > 48) goReel(-1);
  };

  const handleClose = () => { dismissForToday(); setOpen(false); };
  const handleGoTasks = () => { dismissForToday(); setOpen(false); navigate("/daily-tasks"); };
  const handleGoRecommended = (examType: string) => {
    dismissForToday(); setOpen(false);
    navigate(`/mock-test?exam=${encodeURIComponent(examType)}`);
  };

  const currentItem = reelNews[reelIdx];
  const display = currentItem ? getNewsBn(currentItem) : null;

  const completed = taskState ? taskState.tasks.filter((t) => t.completed).length : 0;
  const total = taskState?.tasks.length ?? 0;
  const progressPct = total ? Math.round((completed / total) * 100) : 0;
  const pendingTasks = taskState?.tasks.filter((t) => !t.completed) ?? [];
  const session = getSession();

  const preferredExam: string =
    taskState?.exam ?? (() => {
      try {
        const raw = localStorage.getItem("upcoming_exam");
        const parsed = raw ? (JSON.parse(raw) as { exam?: string }) : null;
        return parsed?.exam ?? "WBCS";
      } catch { return "WBCS"; }
    })();

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setRecommendedLoading(true);
    setRecommendedMeta(null);
    fetchMockTestPaper(preferredExam)
      .then((data) => { if (!cancelled) setRecommendedMeta(data.meta); })
      .catch(() => { if (!cancelled) setRecommendedMeta(null); })
      .finally(() => { if (!cancelled) setRecommendedLoading(false); });
    return () => { cancelled = true; };
  }, [open, preferredExam]);

  const greetingHour = new Date().getHours();
  const greeting =
    greetingHour < 12 ? "শুভ সকাল" : greetingHour < 17 ? "শুভ অপরাহ্ণ" : "শুভ সন্ধ্যা";

  const importanceMeta = {
    high:   { label: "জরুরি",   bg: "bg-rose-500/20",    text: "text-rose-300",   dot: "bg-rose-400"    },
    medium: { label: "গুরুত্বপূর্ণ", bg: "bg-amber-500/20", text: "text-amber-300", dot: "bg-amber-400"   },
    low:    { label: "সাধারণ",  bg: "bg-emerald-500/20", text: "text-emerald-300", dot: "bg-emerald-400" },
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className={cn(
          "w-[96vw] max-w-xl md:max-w-2xl",
          "max-h-[92vh] overflow-y-auto",
          /* hide default close + scrollbar */
          "[&>button]:hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          "p-0 gap-0 border-0 rounded-2xl shadow-2xl",
          /* dark theme */
          "bg-[#0c1220] text-white",
        )}
        aria-describedby="briefing-desc"
        style={{ fontFamily: "'Hind Siliguri', 'Noto Sans Bengali', system-ui, sans-serif" }}
      >
        {/* ── Animated top bar ─────────────────────────────────────── */}
        <div className="h-1 w-full bg-gradient-to-r from-amber-400 via-orange-500 to-rose-500 animate-pulse" />

        {/* ── Header ───────────────────────────────────────────────── */}
        <div className="relative px-5 pt-5 pb-4 sm:px-7 sm:pt-6">
          {/* close button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="বন্ধ করুন"
          >
            <X className="w-4 h-4 text-white/70" />
          </button>

          {/* badge row */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-amber-400/20 text-amber-300 border border-amber-400/30">
              <Sparkles className="w-3 h-3" />
              Today's Briefing
            </span>
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/60">
              বাংলা · EN
            </span>
          </div>

          {/* greeting + name */}
          <div className="space-y-0.5">
            <p className="text-sm text-white/50">{greeting} 👋</p>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white leading-tight tracking-tight">
              {session?.user?.name ? (
                <>Welcome back, <span className="text-amber-400">{session.user.name}</span>!</>
              ) : (
                <>Welcome back!</>
              )}
            </h1>
            <p id="briefing-desc" className="text-xs text-white/40 pt-0.5">
              আজকের পরীক্ষা প্রস্তুতির সম্পূর্ণ আপডেট এক জায়গায়
            </p>
          </div>
        </div>

        <div className="px-5 pb-6 sm:px-7 space-y-4">

          {/* ── Recommended Paper card ──────────────────────────────── */}
          <div className="relative rounded-2xl overflow-hidden">
            {/* gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500 via-red-500 to-red-600" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(251,191,36,0.15),transparent_60%)]" />
            {/* subtle grid */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(255,255,255,.1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.1) 1px,transparent 1px)",
                backgroundSize: "24px 24px",
              }}
            />

            <div className="relative p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-3.5 h-3.5 text-amber-300 fill-amber-300" />
                    <span className="text-[11px] font-bold uppercase tracking-wider text-amber-300">
                      Recommended for you
                    </span>
                  </div>

                  {recommendedLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 rounded-lg bg-white/20 animate-pulse w-3/4" />
                      <div className="h-3 rounded-md bg-white/10 animate-pulse w-1/2" />
                    </div>
                  ) : recommendedMeta ? (
                    <>
                      <p className="text-base sm:text-lg font-bold text-white leading-snug line-clamp-2">
                        {recommendedMeta.paper_title}
                      </p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-xs text-white/60 flex items-center gap-1">
                          <ClipboardList className="w-3 h-3" />
                          {recommendedMeta.total_questions} প্রশ্ন
                        </span>
                        <span className="text-xs text-white/60 flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {recommendedMeta.duration_minutes} মিনিট
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-white/70">
                      আজকের <span className="text-white font-semibold">{preferredExam}</span> মক টেস্ট শুরু করুন
                    </p>
                  )}
                </div>

                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-white" />
                </div>
              </div>

              <div className="mt-5 flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => handleGoRecommended(preferredExam)}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 text-sm font-bold transition-all shadow-lg shadow-amber-500/30 active:scale-[.97]"
                >
                  <Zap className="w-4 h-4" />
                  এখনই শুরু করুন
                  <ArrowRight className="w-4 h-4" />
                </button>
                <button
                  onClick={handleGoTasks}
                  className="flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-sm font-semibold border border-white/20 transition-all active:scale-[.97]"
                >
                  <ClipboardList className="w-4 h-4" />
                  Daily tasks
                </button>
              </div>
            </div>
          </div>

          {/* ── Current affairs reel ─────────────────────────────────── */}
          <div className="rounded-2xl border border-white/10 bg-white/5 overflow-hidden">
            {/* header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-white/70">
                  আজকের কারেন্ট অ্যাফেয়ার্স
                </span>
              </div>
              {reelNews.length > 0 && (
                <span className="text-[11px] text-white/40 tabular-nums">
                  {reelIdx + 1} / {reelNews.length}
                </span>
              )}
            </div>

            {/* reel body */}
            <div
              className="relative min-h-[220px] touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {display && currentItem ? (
                <div
                  className={cn(
                    "p-4 sm:p-5 transition-all duration-300",
                    animDir === "up" && "opacity-0 translate-y-2",
                    animDir === "down" && "opacity-0 -translate-y-2",
                  )}
                >
                  {/* importance badge + date */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    {(() => {
                      const imp = importanceMeta[currentItem.importance as keyof typeof importanceMeta] ?? importanceMeta.low;
                      return (
                        <span className={cn("inline-flex items-center gap-1.5 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full", imp.bg, imp.text)}>
                          <span className={cn("w-1.5 h-1.5 rounded-full", imp.dot)} />
                          {imp.label}
                        </span>
                      );
                    })()}
                    <span className="text-[11px] text-white/35">
                      {new Date(currentItem.date).toLocaleDateString("bn-BD", { day: "numeric", month: "short" })}
                    </span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-white leading-snug mb-2">
                    {display.headline}
                  </h3>
                  <p className="text-xs sm:text-sm leading-relaxed text-white/60">
                    {display.summary}
                  </p>

                  {/* dot indicators */}
                  {reelNews.length > 1 && (
                    <div className="flex items-center gap-1.5 mt-4">
                      {reelNews.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`কার্ড ${i + 1}`}
                          onClick={() => setReelIdx(i)}
                          className={cn(
                            "rounded-full transition-all duration-300",
                            i === reelIdx
                              ? "w-5 h-1.5 bg-cyan-400"
                              : "w-1.5 h-1.5 bg-white/25 hover:bg-white/50",
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center min-h-[220px]">
                  <div className="flex flex-col items-center gap-2 text-white/30">
                    <div className="w-6 h-6 border-2 border-white/20 border-t-cyan-400 rounded-full animate-spin" />
                    <span className="text-xs">লোড হচ্ছে…</span>
                  </div>
                </div>
              )}

              {/* arrow controls */}
              {reelNews.length > 1 && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col gap-1">
                  <button
                    onClick={() => goReel(-1)}
                    disabled={reelIdx === 0}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-25 transition-colors"
                    aria-label="পূর্ববর্তী"
                  >
                    <ChevronUp className="w-4 h-4 text-white" />
                  </button>
                  <button
                    onClick={() => goReel(1)}
                    disabled={reelIdx === reelNews.length - 1}
                    className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 disabled:opacity-25 transition-colors"
                    aria-label="পরবর্তী"
                  >
                    <ChevronDown className="w-4 h-4 text-white" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ── Daily tasks ──────────────────────────────────────────── */}
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-5">
            <div className="flex items-center gap-2 mb-4">
              <Trophy className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white">আজকের টাস্ক রিমাইন্ডার</h3>
            </div>

            {!taskState ? (
              <p className="text-sm text-white/50">
                পরীক্ষার টার্গেট সেট করলে দৈনিক টাস্ক ও XP পাবেন।{" "}
                <Link
                  to="/profile"
                  className="text-amber-400 font-semibold hover:text-amber-300 underline underline-offset-2"
                  onClick={handleClose}
                >
                  প্রোফাইলে যান →
                </Link>
              </p>
            ) : pendingTasks.length === 0 ? (
              <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <p className="text-sm font-semibold text-emerald-300">
                  দারুন! আজকের সব টাস্ক সম্পন্ন হয়েছে 🎉
                </p>
              </div>
            ) : (
              <div className="flex gap-4">
                {/* ring */}
                <div className="flex-shrink-0 flex flex-col items-center gap-1">
                  <div className="relative">
                    <ProgressRing pct={progressPct} size={64} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xs font-extrabold text-white">{progressPct}%</span>
                    </div>
                  </div>
                  <span className="text-[10px] text-white/40">
                    {completed}/{total}
                  </span>
                </div>

                {/* task list */}
                <div className="flex-1 min-w-0 space-y-2">
                  {pendingTasks.slice(0, 4).map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center justify-between gap-2 rounded-xl bg-white/8 border border-white/10 px-3 py-2"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Circle className="w-3 h-3 text-white/30 flex-shrink-0" />
                        <span className="text-xs text-white/70 truncate">{t.label}</span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-400 shrink-0">
                        +{t.points} XP
                      </span>
                    </div>
                  ))}
                  <button
                    onClick={handleGoTasks}
                    className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-400/15 hover:bg-amber-400/25 text-amber-300 text-xs font-bold border border-amber-400/20 transition-all"
                  >
                    <TrendingUp className="w-3.5 h-3.5" />
                    সব টাস্ক দেখুন
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Quick links ──────────────────────────────────────────── */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <LayoutGrid className="w-3.5 h-3.5 text-white/40" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-white/40">
                Quick Links
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {QUICK_LINKS.map(({ to, labelBn, label, icon: Icon, color }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={handleClose}
                  className="group flex flex-col items-center gap-2 p-3 rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all active:scale-[.96]"
                >
                  <div className={cn(
                    "w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br",
                    color,
                    "shadow-lg group-hover:scale-110 transition-transform duration-200"
                  )}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-[10px] text-center font-semibold text-white/70 leading-tight line-clamp-2">
                    {labelBn}
                  </span>
                </Link>
              ))}
            </div>
          </div>

          {/* ── Footer CTA ───────────────────────────────────────────── */}
          <div className="pt-1 flex flex-col sm:flex-row gap-2.5">
            <button
              onClick={() => handleGoRecommended(preferredExam)}
              disabled={recommendedLoading}
              className="flex-1 flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-400 hover:to-red-400 text-white text-sm font-bold shadow-lg shadow-orange-500/30 transition-all active:scale-[.97] disabled:opacity-50"
            >
              <BookOpen className="w-4 h-4" />
              Recommended paper
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={handleClose}
              className="sm:w-auto px-5 py-3 rounded-xl border border-white/15 bg-white/8 hover:bg-white/12 text-white/60 hover:text-white/80 text-sm font-medium transition-all"
            >
              আজকের জন্য বন্ধ
            </button>
          </div>

        </div>
      </DialogContent>
    </Dialog>
  );
}
