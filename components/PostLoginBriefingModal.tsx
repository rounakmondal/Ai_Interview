import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { isLoggedIn, getSession } from "@/lib/auth-api";
import { fetchCurrentAffairs, pickTodaysReelNews, getNewsBn, type NewsItem } from "@/lib/govt-practice-data";
import { getDailyTasks, type DailyTasksState } from "@/lib/daily-tasks";

export const HOME_BRIEFING_DISMISS_DATE = "home_briefing_dismiss_date";
export const HOME_BRIEFING_FORCE_KEY = "home_briefing_force_show";

function dismissForToday() {
  const today = new Date().toISOString().split("T")[0];
  try {
    localStorage.setItem(HOME_BRIEFING_DISMISS_DATE, today);
    sessionStorage.removeItem(HOME_BRIEFING_FORCE_KEY);
  } catch {
    /* ignore */
  }
}

function shouldOpenBriefing(): boolean {
  if (!isLoggedIn()) return false;
  const today = new Date().toISOString().split("T")[0];
  try {
    const dismissed = localStorage.getItem(HOME_BRIEFING_DISMISS_DATE) === today;
    const force = sessionStorage.getItem(HOME_BRIEFING_FORCE_KEY) === "1";
    if (dismissed && !force) return false;
    return true;
  } catch {
    return true;
  }
}

function isAnotherDialogOpen(): boolean {
  return !!document.querySelector('[data-state="open"][role="dialog"]');
}

const QUICK_LINKS: {
  to: string;
  labelBn: string;
  label: string;
  icon: typeof BookOpen;
}[] = [
  { to: "/current-affairs", labelBn: "সাম্প্রতিক ঘটনা", label: "Current Affairs", icon: Newspaper },
  { to: "/daily-tasks", labelBn: "আজকের টাস্ক", label: "Daily Tasks", icon: ClipboardList },
  { to: "/question-hub", labelBn: "প্রশ্ন ব্যাংক ও মক টেস্ট", label: "Question Hub", icon: BookOpen },
  { to: "/wbcs-mock-test", labelBn: "ডব্লিউবিসিএস মক", label: "WBCS Mock", icon: GraduationCap },
  { to: "/wbp-police-mock-test", labelBn: "পুলিশ মক টেস্ট", label: "WBP Mock", icon: Shield },
  { to: "/study-plan", labelBn: "স্টাডি প্ল্যান", label: "Study Plan", icon: LayoutGrid },
];

export function requestPostLoginBriefing() {
  try {
    sessionStorage.setItem(HOME_BRIEFING_FORCE_KEY, "1");
  } catch {
    /* ignore */
  }
}

export default function PostLoginBriefingModal() {
  const [open, setOpen] = useState(false);
  const [reelNews, setReelNews] = useState<NewsItem[]>([]);
  const [reelIdx, setReelIdx] = useState(0);
  const [taskState, setTaskState] = useState<DailyTasksState | null>(() => getDailyTasks());
  const navigate = useNavigate();
  const touchY = useRef<number | null>(null);

  useEffect(() => {
    let attempts = 0;
    const maxAttempts = 50;
    let cancelled = false;
    let timeoutId: ReturnType<typeof setTimeout> | undefined;

    const tryOpen = () => {
      if (cancelled || !shouldOpenBriefing()) return;
      if (isAnotherDialogOpen()) {
        attempts += 1;
        if (attempts < maxAttempts) {
          timeoutId = setTimeout(tryOpen, 400);
        }
        return;
      }
      setOpen(true);
      fetchCurrentAffairs().then((data) => {
        if (!cancelled) setReelNews(pickTodaysReelNews(data.news, 6));
      });
      if (!cancelled) setTaskState(getDailyTasks());
    };

    timeoutId = setTimeout(tryOpen, 600);
    return () => {
      cancelled = true;
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  const goReel = useCallback(
    (dir: -1 | 1) => {
      setReelIdx((i) => {
        const n = reelNews.length;
        if (n === 0) return 0;
        return Math.max(0, Math.min(n - 1, i + dir));
      });
    },
    [reelNews.length],
  );

  const onTouchStart = (e: React.TouchEvent) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchY.current == null) return;
    const dy = e.changedTouches[0].clientY - touchY.current;
    touchY.current = null;
    if (dy < -48) goReel(1);
    else if (dy > 48) goReel(-1);
  };

  const handleClose = () => {
    dismissForToday();
    setOpen(false);
  };

  const handleGoTasks = () => {
    dismissForToday();
    setOpen(false);
    navigate("/daily-tasks");
  };

  const currentItem = reelNews[reelIdx];
  const display = currentItem ? getNewsBn(currentItem) : null;

  const completed = taskState ? taskState.tasks.filter((t) => t.completed).length : 0;
  const total = taskState?.tasks.length ?? 0;
  const progressPct = total ? Math.round((completed / total) * 100) : 0;
  const pendingTasks = taskState?.tasks.filter((t) => !t.completed) ?? [];
  const session = getSession();

  return (
    <Dialog open={open} onOpenChange={(v) => !v && handleClose()}>
      <DialogContent
        className={cn(
          "max-w-lg sm:max-w-xl w-[96vw] max-h-[90vh] overflow-y-auto p-0 gap-0",
          "border-border/60 bg-gradient-to-b from-background via-background to-primary/5",
        )}
        aria-describedby="briefing-desc"
      >
        <div className="p-5 sm:p-6 space-y-5">
          <DialogHeader className="space-y-2 text-left">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant="secondary" className="gap-1 font-normal">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                আজকের বিফ্রিং
              </Badge>
              <Badge variant="outline" className="text-xs border-primary/40">
                বাংলায় সারসংক্ষেপ
              </Badge>
            </div>
            <DialogTitle className="text-xl sm:text-2xl font-bold leading-snug">
              স্বাগতম{session?.user?.name ? `, ${session.user.name}` : ""}!
            </DialogTitle>
            <DialogDescription id="briefing-desc" className="text-sm text-muted-foreground">
              নিচে আজকের গুরুত্বপূর্ণ কারেন্ট অ্যাফেয়ার্স (রিল স্টাইল), দৈনিক টাস্ক রিমাইন্ডার ও দ্রুত লিংক —
              এক জায়গায়।
            </DialogDescription>
          </DialogHeader>

          {/* ── Reels-style current affairs (Bengali) ───────────────────── */}
          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <Newspaper className="w-3.5 h-3.5" />
              আজকের কারেন্ট অ্যাফেয়ার্স · স্বাইপ করুন
            </p>
            <div
              className="relative rounded-2xl border border-primary/20 bg-card/80 shadow-lg overflow-hidden min-h-[280px] touch-pan-y"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {display && currentItem ? (
                <div className="p-5 sm:p-6 flex flex-col justify-between min-h-[280px]">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className={cn(
                          "text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border",
                          currentItem.importance === "high"
                            ? "bg-red-500/10 text-red-600 border-red-500/30"
                            : currentItem.importance === "medium"
                              ? "bg-amber-500/10 text-amber-700 border-amber-500/30"
                              : "bg-emerald-500/10 text-emerald-700 border-emerald-500/30",
                        )}
                      >
                        {currentItem.importance === "high" ? "জরুরি" : currentItem.importance === "medium" ? "মাঝারি" : "সাধারণ"}
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        {new Date(currentItem.date).toLocaleDateString("bn-BD", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold leading-snug text-foreground">
                      {display.headline}
                    </h3>
                    <p className="text-sm leading-relaxed text-muted-foreground">
                      {display.summary}
                    </p>
                  </div>
                  <p className="text-[11px] text-muted-foreground pt-4 border-t border-border/40 opacity-80">
                    {reelIdx + 1} / {reelNews.length} — উপরে/নিচে বাটন বা স্ক্রল সোয়াইপ
                  </p>
                </div>
              ) : (
                <div className="p-8 flex items-center justify-center text-muted-foreground text-sm">
                  খবর লোড হচ্ছে…
                </div>
              )}

              {reelNews.length > 1 && (
                <>
                  <button
                    type="button"
                    aria-label="পূর্ববর্তী"
                    className="absolute left-1/2 top-2 -translate-x-1/2 p-1.5 rounded-full bg-background/90 border shadow-sm hover:bg-muted"
                    onClick={() => goReel(-1)}
                  >
                    <ChevronUp className="w-5 h-5" />
                  </button>
                  <button
                    type="button"
                    aria-label="পরবর্তী"
                    className="absolute left-1/2 bottom-2 -translate-x-1/2 p-1.5 rounded-full bg-background/90 border shadow-sm hover:bg-muted"
                    onClick={() => goReel(1)}
                  >
                    <ChevronDown className="w-5 h-5" />
                  </button>
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col gap-1.5">
                    {reelNews.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        aria-label={`কার্ড ${i + 1}`}
                        className={cn(
                          "w-2 h-2 rounded-full transition-all",
                          i === reelIdx ? "bg-primary scale-125" : "bg-muted-foreground/30",
                        )}
                        onClick={() => setReelIdx(i)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </section>

          {/* ── Today's tasks ───────────────────────────────────────────── */}
          <section className="rounded-xl border border-border/60 bg-muted/30 p-4 space-y-3">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-orange-500" />
              <h3 className="font-semibold text-sm">আজকের টাস্ক রিমাইন্ডার</h3>
            </div>
            {!taskState ? (
              <p className="text-sm text-muted-foreground">
                পরীক্ষার টার্গেট সেট করলে দৈনিক টাস্ক ও XP পাবেন।{" "}
                <Link to="/profile" className="text-primary font-medium underline underline-offset-2" onClick={handleClose}>
                  প্রোফাইলে যান
                </Link>
              </p>
            ) : pendingTasks.length === 0 ? (
              <p className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">
                দারুন! আজকের সব টাস্ক সম্পন্ন হয়েছে।
              </p>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground">অগ্রগতি</span>
                    <span className="font-semibold">
                      {completed}/{total}
                    </span>
                  </div>
                  <Progress value={progressPct} className="h-2" />
                </div>
                <ul className="space-y-2 max-h-28 overflow-y-auto pr-1">
                  {pendingTasks.slice(0, 5).map((t) => (
                    <li
                      key={t.id}
                      className="flex justify-between gap-2 text-xs rounded-lg bg-background/80 border border-border/50 px-2 py-1.5"
                    >
                      <span className="truncate">{t.label}</span>
                      <span className="text-primary font-semibold shrink-0">+{t.points} XP</span>
                    </li>
                  ))}
                </ul>
                <Button size="sm" className="w-full gap-1" onClick={handleGoTasks}>
                  টাস্ক সম্পূর্ণ করুন
                  <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </>
            )}
          </section>

          {/* ── Quick links ─────────────────────────────────────────────── */}
          <section className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-1.5">
              <LayoutGrid className="w-3.5 h-3.5" />
              দ্রুত লিংক
            </p>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_LINKS.map(({ to, labelBn, label, icon: Icon }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={handleClose}
                  className={cn(
                    "flex items-start gap-2 rounded-xl border border-border/60 bg-card/60 p-3",
                    "hover:border-primary/40 hover:bg-primary/5 transition-colors text-left",
                  )}
                >
                  <Icon className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="min-w-0">
                    <span className="block text-sm font-medium leading-tight">{labelBn}</span>
                    <span className="block text-[10px] text-muted-foreground">{label}</span>
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <DialogFooter className="flex-col sm:flex-row gap-2 pt-1">
            <Button variant="outline" className="w-full sm:w-auto" onClick={handleClose}>
              বন্ধ করুন (আজ আর দেখাব না)
            </Button>
          </DialogFooter>
        </div>
      </DialogContent>
    </Dialog>
  );
}
