import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import ProfileButton from "@/components/ProfileButton";
import {
  BookMarked, ChevronDown, ChevronRight, Target,
  BookOpen, CheckCircle2, Clock, Play, Filter,
  Languages, Sparkles, AlertCircle, Trophy, Flame,
  TrendingUp, Zap, GanttChart, Home, BarChart3,
  Star, Award, Shield, Brain, ArrowRight, RefreshCw,
} from "lucide-react";
import {
  getStudyExamPreference,
  getExamSyllabusWithProgress,
  saveChapterProgress,
} from "@/lib/exam-syllabus-data";
import { STUDY_EXAM_LABELS } from "@shared/study-types";
import type { StudyExamType, SyllabusSubject, Chapter, ChapterStatus } from "@shared/study-types";
import AIStudyGuide from "@/components/AIStudyGuide";

const STATUS_CONFIG: Record<ChapterStatus, { label: string; color: string; bg: string; dot: string }> = {
  not_started: { label: "Pending",     color: "text-muted-foreground",                 bg: "bg-muted/60",     dot: "bg-muted-foreground/40" },
  in_progress: { label: "In Progress", color: "text-amber-600 dark:text-amber-400",    bg: "bg-amber-500/10", dot: "bg-amber-500" },
  done:        { label: "Completed",   color: "text-green-600 dark:text-green-400",    bg: "bg-green-500/10", dot: "bg-green-500" },
};

type FilterType = "all" | "not_started" | "in_progress" | "done";

const MOTIVATIONAL_QUOTES = [
  "Every chapter you complete brings you one step closer to your dream. 🎯",
  "Consistency beats intensity. Study a little every day. 📚",
  "You are not behind — you are exactly where you need to be. Keep going. 💪",
  "The secret of getting ahead is getting started. Start your next chapter now. 🚀",
  "Small progress is still progress. Celebrate every chapter you finish. 🏆",
];

const STUDY_TIPS = [
  { icon: Brain,    tip: "Use active recall: close your notes and write everything you remember." },
  { icon: Clock,    tip: "Study in 25-minute Pomodoro blocks with 5-minute breaks for maximum focus." },
  { icon: RefreshCw,tip: "Revise completed chapters on Day 1, Day 7, and Day 21 using spaced repetition." },
  { icon: Target,   tip: "Set a daily goal of 2 chapters. Tracking streaks builds disciplined habits." },
  { icon: Zap,      tip: "Solve 10 MCQs right after every chapter to lock in your understanding." },
];

export default function SyllabusTracker() {
  const navigate = useNavigate();
  const studyExam = getStudyExamPreference();

  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<FilterType>("all");
  const [lang, setLang] = useState<"en" | "bn">("en");
  const [guideChapterId, setGuideChapterId] = useState<string | null>(null);
  const [quoteIdx] = useState(() => Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length));
  const [tipIdx] = useState(() => Math.floor(Math.random() * STUDY_TIPS.length));
  const [syllabus, setSyllabus] = useState(() =>
    studyExam ? getExamSyllabusWithProgress(studyExam) : null
  );

  useEffect(() => {
    if (!studyExam) navigate("/profile", { replace: true });
  }, [studyExam, navigate]);

  if (!studyExam || !syllabus) return null;

  // ── Stats ──────────────────────────────────────────────────────────────
  let totalChapters = 0, doneChapters = 0, inProgressCount = 0, notStartedCount = 0;
  for (const s of syllabus.subjects) {
    for (const c of s.chapters) {
      totalChapters++;
      if (c.status === "done") doneChapters++;
      else if (c.status === "in_progress") inProgressCount++;
      else notStartedCount++;
    }
  }
  const overallPct = totalChapters > 0 ? Math.round((doneChapters / totalChapters) * 100) : 0;
  const attemptedPct = totalChapters > 0 ? Math.round(((doneChapters + inProgressCount) / totalChapters) * 100) : 0;

  const daysToExam = (() => {
    try {
      const raw = localStorage.getItem("upcoming_exam");
      if (!raw) return null;
      const { date } = JSON.parse(raw);
      const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return diff > 0 ? diff : null;
    } catch { return null; }
  })();

  const toggleSubject = (id: string) =>
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));

  const getSubjectProgress = (subject: SyllabusSubject) => {
    const done = subject.chapters.filter((c) => c.status === "done").length;
    return subject.chapters.length > 0 ? Math.round((done / subject.chapters.length) * 100) : 0;
  };

  const filterChapters = (chapters: Chapter[]): Chapter[] =>
    filter === "all" ? chapters : chapters.filter((c) => c.status === filter);

  const markChapterDone = (chapterId: string) => {
    saveChapterProgress(chapterId, { status: "done", progress: 100 });
    setSyllabus(getExamSyllabusWithProgress(studyExam));
  };

  const filterCounts = {
    all: totalChapters, not_started: notStartedCount,
    in_progress: inProgressCount, done: doneChapters,
  };

  const getProgressColor = (pct: number) =>
    pct >= 70 ? "text-green-600 dark:text-green-400" : pct >= 40 ? "text-amber-600 dark:text-amber-400" : "text-primary";

  const TipIcon = STUDY_TIPS[tipIdx].icon;

  return (
    <div className="min-h-screen bg-background">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <img src="/photo_6183770845247900874_y.jpg" alt="InterviewSathi" className="w-7 h-7 rounded-lg object-cover" />
            <span className="font-bold text-sm hidden sm:block">InterviewSathi</span>
          </Link>
          <span className="text-border hidden sm:block">|</span>
          <nav className="hidden md:flex items-center gap-1">
            <Link to="/dashboard" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <Home className="w-3.5 h-3.5" />Dashboard
            </Link>
            <Link to="/study-plan" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <GanttChart className="w-3.5 h-3.5" />Study Plan
            </Link>
            <Link to="/syllabus" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary bg-primary/10">
              <BookMarked className="w-3.5 h-3.5" />Syllabus
            </Link>
            <Link to="/govt-practice" className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors">
              <BarChart3 className="w-3.5 h-3.5" />Practice
            </Link>
          </nav>
          <Badge variant="secondary" className="hidden sm:flex text-xs gap-1 flex-shrink-0">
            <Target className="w-3 h-3" />{STUDY_EXAM_LABELS[studyExam]}
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            {daysToExam && (
              <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">{daysToExam}d left</span>
              </div>
            )}
            <ProfileButton />
          </div>
        </div>
      </header>

      {/* ── Hero Banner ─────────────────────────────────────────────────── */}
      <div className="bg-gradient-to-r from-primary/5 via-violet-500/5 to-background border-b border-border/30">
        <div className="container px-4 py-6 max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <BookMarked className="w-5 h-5 text-primary" />
                <h1 className="text-xl font-bold">Syllabus Tracker</h1>
                <Badge className="text-[10px] px-1.5 bg-primary/10 text-primary border-primary/20">
                  {STUDY_EXAM_LABELS[studyExam]}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">Track every chapter · Build momentum · Ace your exam</p>
              <p className="text-xs text-muted-foreground/70 italic hidden sm:block">
                "{MOTIVATIONAL_QUOTES[quoteIdx]}"
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative w-20 h-20 flex-shrink-0">
                <svg className="w-20 h-20 -rotate-90" viewBox="0 0 80 80">
                  <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="6" className="text-muted/30" />
                  <circle cx="40" cy="40" r="32" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 32}`}
                    strokeDashoffset={`${2 * Math.PI * 32 * (1 - overallPct / 100)}`}
                    className={overallPct >= 70 ? "text-green-500" : overallPct >= 40 ? "text-amber-500" : "text-primary"}
                    style={{ transition: "stroke-dashoffset 0.6s ease" }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={`text-lg font-bold leading-none ${getProgressColor(overallPct)}`}>{overallPct}%</span>
                  <span className="text-[9px] text-muted-foreground">done</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500" /><span className="text-xs text-muted-foreground">{doneChapters} Completed</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-amber-500" /><span className="text-xs text-muted-foreground">{inProgressCount} In Progress</span></div>
                <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-muted-foreground/30" /><span className="text-xs text-muted-foreground">{notStartedCount} Pending</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="container px-4 py-6 max-w-5xl mx-auto space-y-5">

        {/* ── KPI Cards ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: CheckCircle2, value: doneChapters,   label: "Chapters Done",  color: "text-green-600",  bg: "bg-green-500/5" },
            { icon: Clock,        value: inProgressCount, label: "In Progress",   color: "text-amber-600",  bg: "bg-amber-500/5" },
            { icon: BookOpen,     value: totalChapters,   label: "Total Chapters", color: "text-foreground", bg: "bg-primary/5" },
            { icon: TrendingUp,   value: `${attemptedPct}%`, label: "Attempted", color: "text-violet-600",  bg: "bg-violet-500/5" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <Card key={item.label} className={`p-4 border-border/40 ${item.bg}`}>
                <Icon className={`w-5 h-5 mb-2 ${item.color}`} />
                <p className={`text-2xl font-bold ${item.color}`}>{item.value}</p>
                <p className="text-xs text-muted-foreground">{item.label}</p>
              </Card>
            );
          })}
        </div>

        {/* ── Achievement Banner ─────────────────────────────────────────── */}
        {overallPct >= 25 && (
          <Card className={`p-3.5 border-border/40 flex items-center gap-3 ${
            overallPct >= 75 ? "bg-green-500/5 border-green-500/20" :
            overallPct >= 50 ? "bg-violet-500/5 border-violet-500/20" : "bg-amber-500/5 border-amber-500/20"
          }`}>
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
              overallPct >= 75 ? "bg-green-500/15" : overallPct >= 50 ? "bg-violet-500/15" : "bg-amber-500/15"
            }`}>
              {overallPct >= 75 ? <Trophy className="w-5 h-5 text-green-500" /> :
               overallPct >= 50 ? <Award className="w-5 h-5 text-violet-500" /> :
               <Flame className="w-5 h-5 text-amber-500" />}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm">
                {overallPct >= 75 ? "Outstanding! You're almost there!" :
                 overallPct >= 50 ? "Great progress! More than halfway done!" : "Good start! Keep the momentum going!"}
              </p>
              <p className="text-xs text-muted-foreground">
                {totalChapters - doneChapters} chapters remaining ·{" "}
                {daysToExam ? `${daysToExam} days to exam` : "Set your exam date for a personalized plan"}
              </p>
            </div>
            <Link to="/study-plan">
              <Button variant="outline" size="sm" className="hidden sm:flex text-xs gap-1.5 flex-shrink-0">
                View Plan <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </Card>
        )}

        {/* ── Study Tip ──────────────────────────────────────────────────── */}
        <Card className="p-3.5 border-border/40 bg-gradient-to-r from-primary/3 to-background flex items-start gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
            <TipIcon className="w-4 h-4 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-semibold text-primary mb-0.5">Today's Study Tip</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{STUDY_TIPS[tipIdx].tip}</p>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground/60 flex-shrink-0">
            <Shield className="w-3 h-3" /> Verified
          </div>
        </Card>

        {/* ── Controls ───────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex gap-1 bg-muted/50 rounded-xl p-1 flex-wrap">
            {(["all", "not_started", "in_progress", "done"] as FilterType[]).map((f) => (
              <button key={f} onClick={() => setFilter(f)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === f ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? <Filter className="w-3 h-3" /> :
                 f === "done" ? <CheckCircle2 className="w-3 h-3" /> :
                 f === "in_progress" ? <Clock className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                {f === "all" ? "All" : f === "not_started" ? "Pending" : f === "in_progress" ? "In Progress" : "Done"}
                <span className="bg-muted rounded-full px-1.5 py-0.5 text-[10px] leading-none">{filterCounts[f]}</span>
              </button>
            ))}
          </div>
          <button onClick={() => setLang(lang === "en" ? "bn" : "en")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted/50 transition-colors"
          >
            <Languages className="w-3.5 h-3.5" />
            {lang === "en" ? "Switch to বাংলা" : "Switch to English"}
          </button>
          <button
            onClick={() => {
              const anyExpanded = Object.values(expanded).some(Boolean);
              setExpanded(anyExpanded ? {} : syllabus.subjects.reduce((acc, s) => ({ ...acc, [s.id]: true }), {}));
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted/50 transition-colors ml-auto"
          >
            {Object.values(expanded).some(Boolean) ? <><ChevronDown className="w-3.5 h-3.5" />Collapse all</> : <><ChevronRight className="w-3.5 h-3.5" />Expand all</>}
          </button>
        </div>

        {/* ── Subjects ───────────────────────────────────────────────────── */}
        <div className="space-y-3">
          {syllabus.subjects.map((subject, sIdx) => {
            const filtered = filterChapters(subject.chapters);
            if (filtered.length === 0 && filter !== "all") return null;
            const isExpanded = !!expanded[subject.id];
            const subPct = getSubjectProgress(subject);
            const subjectDone = subject.chapters.filter((c) => c.status === "done").length;
            const grads = ["from-blue-500/8 to-cyan-500/3","from-violet-500/8 to-purple-500/3","from-green-500/8 to-emerald-500/3","from-amber-500/8 to-yellow-500/3","from-red-500/8 to-rose-500/3","from-teal-500/8 to-cyan-500/3"];
            return (
              <Card key={subject.id} className="border-border/40 overflow-hidden shadow-sm">
                <button onClick={() => toggleSubject(subject.id)}
                  className={`w-full flex items-center gap-3 p-4 sm:p-5 hover:bg-muted/20 transition-colors bg-gradient-to-r ${grads[sIdx % grads.length]}`}
                >
                  <span className="text-2xl flex-shrink-0 select-none">{subject.icon}</span>
                  <div className="flex-1 text-left min-w-0 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-bold text-sm">{lang === "en" ? subject.name : subject.nameBn}</p>
                      <Badge variant="secondary" className="text-[10px] px-1.5">{subjectDone}/{subject.chapters.length}</Badge>
                      {subPct === 100 && <Badge className="text-[10px] px-1.5 bg-green-500/10 text-green-600 border-green-500/20"><CheckCircle2 className="w-2.5 h-2.5 mr-1" />Complete</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={subPct} className="h-1.5 flex-1" />
                      <span className={`text-xs font-bold tabular-nums ${getProgressColor(subPct)}`}>{subPct}%</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0" /> : <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                </button>

                {isExpanded && (
                  <div className="divide-y divide-border/20">
                    {filtered.length === 0 ? (
                      <p className="text-sm text-muted-foreground py-4 text-center">No chapters match this filter.</p>
                    ) : filtered.map((chapter) => {
                      const cfg = STATUS_CONFIG[chapter.status];
                      return (
                        <div key={chapter.id} className="flex items-center gap-3 px-4 sm:px-5 py-3 hover:bg-muted/20 transition-colors">
                          <div className="relative flex-shrink-0">
                            <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center`}>
                              {chapter.status === "done" ? <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                               chapter.status === "in_progress" ? <Clock className="w-4 h-4 text-amber-500" /> :
                               <BookOpen className="w-4 h-4 text-muted-foreground/60" />}
                            </div>
                            <span className={`absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${cfg.dot}`} />
                          </div>
                          <div className="flex-1 min-w-0 space-y-1">
                            <p className="text-sm font-medium leading-snug">{lang === "en" ? chapter.name : chapter.nameBn}</p>
                            <div className="flex items-center gap-2">
                              <Progress value={chapter.progress} className="h-1 flex-1 max-w-[160px]" />
                              <span className="text-[11px] text-muted-foreground tabular-nums">{chapter.progress}%</span>
                              <Badge variant="outline" className={`text-[10px] h-4 px-1.5 ${cfg.color}`}>{cfg.label}</Badge>
                            </div>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            {chapter.status !== "done" && (
                              <>
                                <Link to={`/chapter-test/${chapter.id}`}>
                                  <Button size="sm" variant="outline" className="h-7 px-2.5 text-xs gap-1 border-primary/30 text-primary hover:bg-primary/5">
                                    <Play className="w-3 h-3" /><span className="hidden sm:inline">Test</span>
                                  </Button>
                                </Link>
                                <Button size="sm" variant="ghost" onClick={() => markChapterDone(chapter.id)}
                                  className="h-7 px-2 text-xs text-green-600 hover:bg-green-500/10" title="Mark as done">
                                  <CheckCircle2 className="w-3 h-3" />
                                </Button>
                              </>
                            )}
                            <Button size="sm" variant="ghost" className="h-7 px-2.5 text-xs gap-1 text-violet-600 hover:bg-violet-500/10"
                              onClick={() => setGuideChapterId(chapter.id)}>
                              <Sparkles className="w-3 h-3" /><span className="hidden sm:inline">AI</span>
                            </Button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
        </div>

        {/* ── Bottom CTA ─────────────────────────────────────────────────── */}
        <Card className="p-5 border-border/40 bg-gradient-to-r from-primary/5 to-violet-500/5">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-violet-600 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-bold text-sm">Ready to test your knowledge?</p>
                <p className="text-xs text-muted-foreground">Take chapter-wise tests to mark chapters done and find weak areas.</p>
              </div>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <Link to="/study-plan"><Button variant="outline" size="sm" className="gap-1.5 text-xs"><GanttChart className="w-3.5 h-3.5" />Study Plan</Button></Link>
              <Link to="/daily-quiz"><Button size="sm" className="gap-1.5 text-xs bg-gradient-to-r from-primary to-violet-600 border-0"><Zap className="w-3.5 h-3.5" />Daily Quiz</Button></Link>
            </div>
          </div>
        </Card>

        {/* ── Trust Indicators ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pb-4">
          {[
            { icon: Shield, label: "Exam-Verified", sub: "Official syllabus" },
            { icon: Brain,  label: "AI-Powered",    sub: "Smart study guide" },
            { icon: Trophy, label: "1L+ Students",  sub: "Trust us daily" },
            { icon: Star,   label: "4.9★ Rated",    sub: "Top-rated app" },
          ].map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex flex-col items-center gap-1 py-3">
                <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center">
                  <Icon className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs font-semibold">{item.label}</p>
                <p className="text-[10px] text-muted-foreground">{item.sub}</p>
              </div>
            );
          })}
        </div>
      </main>

      {guideChapterId && (
        <AIStudyGuide chapterId={guideChapterId} onClose={() => setGuideChapterId(null)} />
      )}
    </div>
  );
}
