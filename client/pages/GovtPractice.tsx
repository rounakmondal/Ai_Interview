import { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import {
  BookOpen, ArrowLeft, Zap, Clock, Target, BarChart3,
  Trophy, Shield, Train, Landmark, Building2, Globe2,
  CheckCircle2, ChevronRight, Flame, Star, Users, TrendingUp,
  Loader2, Sparkles, Award, Brain, ChevronDown, LayoutList,
} from "lucide-react";
import {
  ExamType, Subject, Difficulty, TestConfig, GovtQuestion,
  EXAM_LABELS, SUBJECT_LABELS,
} from "@/lib/govt-practice-data";
import { startGovtPracticeSession } from "@/lib/govt-practice-store";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

// ─── Types ────────────────────────────────────────────────────────────────────
const EXAM_OPTIONS: ExamType[] = ["WBCS", "SSC", "Railway", "Banking", "Police"];
const SUBJECT_OPTIONS: Subject[] = ["History", "Geography", "Polity", "Reasoning", "Math", "Current Affairs"];
const DIFFICULTY_OPTIONS: Difficulty[] = ["Easy", "Medium", "Hard"];
const COUNT_OPTIONS = [10, 25, 50, 100] as const;

// Full paper question counts based on exam and difficulty
const FULL_PAPER_COUNTS: Record<ExamType, Record<Difficulty, 10 | 25 | 50 | 100>> = {
  WBCS: { Easy: 100, Medium: 200, Hard: 250 },
  SSC: { Easy: 80, Medium: 100, Hard: 120 },
  Railway: { Easy: 100, Medium: 150, Hard: 180 },
  Banking: { Easy: 100, Medium: 120, Hard: 150 },
  Police: { Easy: 100, Medium: 120, Hard: 150 },
};

// Extra exams not in the main grid
const EXTRA_EXAMS = [
  "UPSC", "JTET", "WBTET", "IBPS Clerk", "SBI PO", "SBI Clerk",
  "RRB Group D", "RRB JE", "WBP Lady Constable", "WBP Constable",
  "WBPSC Clerkship", "WBCS (Mains)", "NDA", "CDS", "CAPF",
];
// ─── Exam config ──────────────────────────────────────────────────────────────
const EXAM_META: Record<ExamType, { icon: React.ReactNode; color: string; glow: string; bg: string; badge: string; candidates: string }> = {
  WBCS: { icon: <Landmark className="w-5 h-5" />, color: "from-violet-500 to-purple-600", glow: "shadow-orange-500/30", bg: "bg-orange-500/10", badge: "border-orange-500/30 text-orange-600 dark:text-orange-400", candidates: "1.2L+" },
  SSC: { icon: <Shield className="w-5 h-5" />, color: "from-orange-500 to-red-500", glow: "shadow-orange-500/30", bg: "bg-blue-500/10", badge: "border-blue-500/30 text-blue-600 dark:text-blue-400", candidates: "3.5L+" },
  Railway: { icon: <Train className="w-5 h-5" />, color: "from-emerald-500 to-teal-600", glow: "shadow-emerald-500/30", bg: "bg-emerald-500/10", badge: "border-emerald-500/30 text-emerald-600 dark:text-emerald-400", candidates: "2.8L+" },
  Banking: { icon: <Building2 className="w-5 h-5" />, color: "from-amber-500 to-orange-600", glow: "shadow-amber-500/30", bg: "bg-amber-500/10", badge: "border-amber-500/30 text-amber-600 dark:text-amber-400", candidates: "1.8L+" },
  Police: { icon: <Shield className="w-5 h-5" />, color: "from-rose-500 to-pink-600", glow: "shadow-rose-500/30", bg: "bg-rose-500/10", badge: "border-rose-500/30 text-rose-600 dark:text-rose-400", candidates: "90K+" },
};

const SUBJECT_META: Record<Subject, { icon: React.ReactNode; color: string }> = {
  History: { icon: <BookOpen className="w-4 h-4" />, color: "text-amber-500" },
  Geography: { icon: <Globe2 className="w-4 h-4" />, color: "text-emerald-500" },
  Polity: { icon: <Landmark className="w-4 h-4" />, color: "text-blue-500" },
  Reasoning: { icon: <Brain className="w-4 h-4" />, color: "text-orange-500" },
  Math: { icon: <BarChart3 className="w-4 h-4" />, color: "text-rose-500" },
  "Current Affairs": { icon: <Zap className="w-4 h-4" />, color: "text-orange-500" },
};

const DIFFICULTY_META: Record<Difficulty, { label: string; desc: string; color: string; ring: string; bg: string }> = {
  Easy: { label: "Easy", desc: "Build confidence", color: "text-emerald-600 dark:text-emerald-400", ring: "ring-emerald-500/40", bg: "bg-emerald-500/10 border-emerald-500/30" },
  Medium: { label: "Medium", desc: "Exam-level", color: "text-amber-600 dark:text-amber-400", ring: "ring-amber-500/40", bg: "bg-amber-500/10 border-amber-500/30" },
  Hard: { label: "Hard", desc: "Challenge yourself", color: "text-rose-600 dark:text-rose-400", ring: "ring-rose-500/40", bg: "bg-rose-500/10 border-rose-500/30" },
};

const QUICK_STATS = [
  { icon: <Users className="w-4 h-4" />, label: "Active Aspirants", value: "50,000+", color: "text-blue-500" },
  { icon: <BookOpen className="w-4 h-4" />, label: "Questions Practiced", value: "2M+", color: "text-emerald-500" },
  { icon: <Trophy className="w-4 h-4" />, label: "Avg Score Gain", value: "+23%", color: "text-amber-500" },
  { icon: <Star className="w-4 h-4" />, label: "Platform Rating", value: "4.9/5", color: "text-orange-500" },
];

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

interface GovtPracticeState {
  exam?: ExamType;
  subject?: Subject;
  dailyTaskId?: string;
}

export default function GovtPractice() {
  const navigate = useNavigate();
  const location = useLocation();
  const incoming = location.state as GovtPracticeState | null;
  const [exam, setExam] = useState<ExamType>(incoming?.exam ?? "WBCS");
  const [customExam, setCustomExam] = useState("");
  const [showExtraExams, setShowExtraExams] = useState(false);
  const [subject, setSubject] = useState<Subject | null>(incoming?.subject ?? "History");
  const [fullPaper, setFullPaper] = useState(false);
  const [difficulty, setDifficulty] = useState<Difficulty>("Medium");
  const [count, setCount] = useState<10 | 25 | 50 | 100>(25);
  const [language, setLanguage] = useState<"english" | "bengali">("english");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingQuestions, setLoadingQuestions] = useState<GovtQuestion[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const hasNavigated = useRef(false);

  const meta = EXAM_META[exam];
  const estimatedMins = Math.round(count * 1.2);

  // Set SEO meta tags
  useEffect(() => {
    document.title =
      "Government Exam Practice - WBCS, SSC, Police, Banking + Corporate Jobs | MedhaHub";
    const updateMeta = (name: string, content: string) => {
      let el = document.querySelector(`meta[name="${name}"]`) as HTMLMetaElement;
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute("name", name);
        document.head.appendChild(el);
      }
      el.content = content;
    };
    updateMeta(
      "description",
      "Practice government exams (WBCS, SSC, Police, Banking, Railway) + corporate job interviews (TCS, Infosys). Dual track preparation with 1000+ questions, mock tests & instant feedback."
    );
    updateMeta(
      "keywords",
      "government exam practice, WBCS mock test, SSC practice, police recruitment exam, government exam preparation West Bengal, corporate jobs, tech interview, WBCS tech interview mock test, SSC Infosys interview preparation, West Bengal police exam TCS recruitment, government corporate dual preparation"
    );
  }, []);

  // Auto-set question count when fullPaper is toggled
  useEffect(() => {
    if (fullPaper) {
      const fullPaperCount = FULL_PAPER_COUNTS[exam]?.[difficulty] || 100;
      setCount(fullPaperCount as 10 | 25 | 50 | 100);
    }
  }, [fullPaper, exam, difficulty]);

  const handleGenerate = () => {
    setLoading(true);
    setError(null);
    setLoadingQuestions([]);
    setIsStreaming(true);
    hasNavigated.current = false;

    const config: TestConfig = {
      exam,
      customExam: customExam.trim() || undefined,
      subject: fullPaper ? null : subject,
      difficulty,
      count,
      language,
      fullPaper,
    };

    const navigateToTest = (items: GovtQuestion[]) => {
      if (hasNavigated.current || items.length === 0) return;
      hasNavigated.current = true;
      setLoading(false);
      navigate("/govt-test", {
        state: {
          config,
          questions: items,
          language,
          dailyTaskId: incoming?.dailyTaskId,
        },
      });
    };

    startGovtPracticeSession(config, language, incoming?.dailyTaskId, (session) => {
      setLoadingQuestions(session.questions);
      if (session.questions.length > 0 && !hasNavigated.current) {
        navigateToTest(session.questions);
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Ambient background ────────────────────────────────────────── */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-20"
          style={{ background: "radial-gradient(ellipse, rgba(245,158,11,0.15) 0%, transparent 70%)", filter: "blur(60px)" }} />
        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] opacity-10"
          style={{ background: "radial-gradient(ellipse, rgba(99,102,241,0.2) 0%, transparent 70%)", filter: "blur(80px)" }} />
      </div>

      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="border-b border-border/40 sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-sm font-medium">Home</span>
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/40" />
          <span className="text-sm font-semibold text-foreground">Exam Room</span>

          <div className="ml-auto flex items-center gap-2">
            <button
              onClick={() => navigate('/virtual-exam')}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              <Target className="w-4 h-4" />
              <span className="hidden sm:inline">Full Length Test</span>
              <span className="sm:hidden">Test</span>
            </button>
            <ProfileButton />
            <Link to="/prev-year-questions">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/40 text-muted-foreground hover:text-foreground hover:border-border text-xs font-medium transition-all">
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Previous Year</span>
              </motion.button>
            </Link>
            <Link to="/current-affairs">
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400 hover:bg-amber-500/20 text-xs font-medium transition-all">
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Current Affairs</span>
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
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 text-sm font-semibold mb-4">
            <Flame className="w-3.5 h-3.5" />
            WB Government Exam Preparation
          </motion.div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-3">
            Practice. Improve.{" "}
            <span className="bg-gradient-to-r from-amber-500 via-orange-500 to-rose-500 bg-clip-text text-transparent">
              Crack the Exam.
            </span>
          </h1>
          <p className="text-muted-foreground max-w-lg mx-auto text-base leading-relaxed">
            AI-generated mock tests for WBCS, SSC, Railway, Banking & Police — with Bengali explanations and smart analytics.
          </p>
        </motion.div>

        {/* ── Quick stats bar ───────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5, ease: smoothEase }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          {QUICK_STATS.map((s, i) => (
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

        {/* ── Config Card ────────────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6, ease: smoothEase }}
          className="bg-card border border-border/50 rounded-2xl overflow-hidden shadow-lg shadow-black/5">

          {/* Card header strip */}
          <div className={`h-1 w-full bg-gradient-to-r ${meta.color}`} />

          <div className="p-6 sm:p-8 space-y-8">

            {/* ── STEP 1: Exam ────────────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground">1</div>
                <p className="text-sm font-semibold text-foreground">Choose Your Exam</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {EXAM_OPTIONS.map((e) => {
                  const m = EXAM_META[e];
                  const selected = exam === e && !customExam;
                  return (
                    <motion.button key={e} onClick={() => { setExam(e); setCustomExam(""); }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex flex-col items-center gap-2 px-3 py-4 rounded-xl border text-center transition-all duration-200 ${selected
                          ? `bg-gradient-to-br ${m.color} text-white border-transparent shadow-lg ${m.glow}`
                          : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/40 hover:text-foreground"
                        }`}>
                      {selected && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                          className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-white/20 flex items-center justify-center">
                          <CheckCircle2 className="w-2.5 h-2.5 text-white" />
                        </motion.div>
                      )}
                      <span className={selected ? "text-white" : ""}>{m.icon}</span>
                      <div>
                        <p className="text-xs font-bold leading-none">{e}</p>
                        <p className={`text-[10px] mt-0.5 leading-tight ${selected ? "text-white/70" : "text-muted-foreground/60"}`}>
                          {m.candidates}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* More Exams dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowExtraExams(!showExtraExams)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-sm font-medium transition-all ${customExam
                    ? "border-primary bg-primary/10 text-foreground"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground"}`}
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showExtraExams ? "rotate-180" : ""}`} />
                  {customExam ? customExam : "More Exams…"}
                </button>
                <AnimatePresence>
                  {showExtraExams && (
                    <motion.div
                      initial={{ opacity: 0, y: 6, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 6, scale: 0.97 }}
                      transition={{ duration: 0.15 }}
                      className="absolute top-full left-0 mt-1.5 z-30 w-64 bg-card border border-border rounded-2xl shadow-xl overflow-hidden"
                    >
                      <div className="p-2 max-h-56 overflow-y-auto space-y-0.5">
                        {EXTRA_EXAMS.map((ex) => (
                          <button
                            key={ex}
                            onClick={() => { setCustomExam(ex); setShowExtraExams(false); }}
                            className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${customExam === ex
                              ? "bg-primary/10 text-foreground"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
                          >
                            {ex}
                          </button>
                        ))}
                        {/* Custom free-text */}
                        <div className="px-3 py-2 border-t border-border/40 mt-1">
                          <p className="text-[10px] text-muted-foreground mb-1.5 font-semibold uppercase tracking-wide">Type Custom Exam</p>
                          <input
                            type="text"
                            value={customExam}
                            onChange={(e) => setCustomExam(e.target.value)}
                            placeholder="e.g. JTET 2026"
                            className="w-full text-sm bg-muted/40 border border-border rounded-lg px-3 py-1.5 outline-none focus:border-primary text-foreground placeholder:text-muted-foreground/50"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <AnimatePresence mode="wait">
                <motion.p key={customExam || exam} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }} transition={{ duration: 0.2 }}
                  className={`text-xs font-medium border rounded-lg px-3 py-1.5 inline-flex items-center gap-1.5 ${meta.badge}`}>
                  <Award className="w-3 h-3" />
                  {customExam ? customExam : EXAM_LABELS[exam]}
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="h-px bg-border/40" />

            {/* ── STEP 2: Subject ──────────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground">2</div>
                  <p className="text-sm font-semibold text-foreground">Select Subject</p>
                </div>
                {/* Full Paper toggle */}
                <button
                  onClick={() => setFullPaper(!fullPaper)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all ${fullPaper
                    ? "border-orange-500/50 bg-orange-500/10 text-orange-600 dark:text-orange-400"
                    : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:text-foreground"}`}
                >
                  <LayoutList className="w-3.5 h-3.5" />
                  Full Paper {fullPaper ? "✓" : "(All Subjects)"}
                </button>
              </div>

              <AnimatePresence mode="wait">
                {fullPaper ? (
                  <motion.div
                    key="full-paper-mode"
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl border border-orange-500/30 bg-orange-500/10"
                  >
                    <LayoutList className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Full Paper Mode</p>
                      <p className="text-xs text-muted-foreground">Questions from all subjects mixed — just like the real exam</p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="subject-grid"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="grid grid-cols-2 sm:grid-cols-3 gap-2.5"
                  >
                    {SUBJECT_OPTIONS.map((s) => {
                      const sm = SUBJECT_META[s];
                      const selected = subject === s;
                      return (
                        <motion.button key={s} onClick={() => setSubject(s)} whileTap={{ scale: 0.97 }}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm font-medium transition-all duration-200 ${selected
                              ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20"
                              : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/30 hover:text-foreground"
                            }`}>
                          <span className={selected ? sm.color : "text-muted-foreground/50"}>{sm.icon}</span>
                          <span className="text-xs font-semibold leading-tight text-left">{SUBJECT_LABELS[s]}</span>
                        </motion.button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="h-px bg-border/40" />

            {/* ── STEP 3: Difficulty & Count ───────────────────────────────── */}
            <div className="grid sm:grid-cols-2 gap-6">
              {/* Difficulty */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground">3</div>
                  <p className="text-sm font-semibold text-foreground">Difficulty</p>
                </div>
                <div className="flex gap-2.5">
                  {DIFFICULTY_OPTIONS.map((d) => {
                    const dm = DIFFICULTY_META[d];
                    const selected = difficulty === d;
                    return (
                      <motion.button key={d} onClick={() => setDifficulty(d)} whileTap={{ scale: 0.96 }}
                        className={`flex-1 flex flex-col items-center py-3 px-2 rounded-xl border text-center transition-all ${selected
                            ? `${dm.bg} ring-2 ${dm.ring}`
                            : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/30"
                          }`}>
                        <span className={`text-xs font-bold ${selected ? dm.color : "text-muted-foreground"}`}>{dm.label}</span>
                        <span className={`text-[10px] mt-0.5 ${selected ? dm.color + "/70" : "text-muted-foreground/50"}`}>{dm.desc}</span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Count */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-6 h-6 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground">4</div>
                  <p className="text-sm font-semibold text-foreground">Questions</p>
                  {fullPaper && <span className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/30">Auto-selected</span>}
                </div>
                {!fullPaper ? (
                  <div className="grid grid-cols-4 gap-2">
                    {COUNT_OPTIONS.map((n) => (
                      <motion.button key={n} onClick={() => setCount(n)} whileTap={{ scale: 0.95 }}
                        className={`py-3 rounded-xl border text-sm font-bold transition-all ${count === n
                            ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20"
                            : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border hover:bg-muted/30"
                          }`}>
                        {n}
                      </motion.button>
                    ))}
                  </div>
                ) : (
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="py-3 px-4 rounded-xl border border-primary/30 bg-primary/5 text-center">
                    <p className="text-lg font-bold text-foreground">{count}</p>
                    <p className="text-xs text-muted-foreground mt-1">{EXAM_LABELS[exam]} Full Paper</p>
                  </motion.div>
                )}
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  ~{estimatedMins} minutes to complete
                </p>
              </div>
            </div>

            <div className="h-px bg-border/40" />

            {/* ── STEP 5: Language ─────────────────────────────────────────── */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-6 h-6 rounded-full bg-foreground/5 border border-border/60 flex items-center justify-center text-xs font-bold text-muted-foreground">5</div>
                <p className="text-sm font-semibold text-foreground">Explanation Language</p>
                <span className="text-xs text-muted-foreground">(for answer explanations)</span>
              </div>
              <div className="flex gap-3 max-w-xs">
                {(["english", "bengali"] as const).map((l) => (
                  <motion.button key={l} onClick={() => setLanguage(l)} whileTap={{ scale: 0.97 }}
                    className={`flex-1 py-3 rounded-xl border text-sm font-semibold transition-all ${language === l
                        ? "border-primary bg-primary/10 text-foreground ring-2 ring-primary/20"
                        : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border"
                      }`}>
                    {l === "english" ? "🇬🇧 English" : "🇮🇳 বাংলা"}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* ── Summary strip ────────────────────────────────────────────── */}
            <div className="bg-muted/30 border border-border/40 rounded-xl p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Test Summary</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: exam, icon: <Target className="w-3 h-3" /> },
                  { label: fullPaper ? "Full Paper" : (subject ?? "All Subjects"), icon: fullPaper ? <LayoutList className="w-3 h-3" /> : subject ? SUBJECT_META[subject].icon : <LayoutList className="w-3 h-3" /> },
                  { label: difficulty, icon: <TrendingUp className="w-3 h-3" /> },
                  { label: `${count} Questions`, icon: <BookOpen className="w-3 h-3" /> },
                  { label: `~${estimatedMins} min`, icon: <Clock className="w-3 h-3" /> },
                  { label: language === "english" ? "English" : "বাংলা", icon: <Globe2 className="w-3 h-3" /> },
                ].map((b) => (
                  <span key={b.label}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-card border border-border/60 text-xs font-semibold text-foreground">
                    {b.icon}{b.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-sm text-rose-600 dark:text-rose-400 text-center bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 rounded-xl py-2.5 px-4">
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

<<<<<<< HEAD
            {/* ── Generate Button ──────────────────────────────────────────── */}
            <motion.button
              onClick={handleGenerate}
              disabled={loading}
              whileHover={loading ? {} : { scale: 1.01 }}
              whileTap={loading ? {} : { scale: 0.98 }}
              className={`relative w-full h-14 rounded-xl font-bold text-base text-white overflow-hidden flex items-center justify-center gap-2.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg ${meta.glow}`}>
              <div className={`absolute inset-0 bg-gradient-to-r ${meta.color}`} />
              <div className={`absolute inset-0 bg-gradient-to-r ${meta.color} opacity-0 hover:opacity-80 transition-opacity`}
                style={{ filter: "brightness(1.1)" }} />
              <span className="relative flex items-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Loading questions from API…
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Start Mock Test 
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </span>
            </motion.button>
=======
            {/* ── Generate Button / Progressive Loading ────────────────────── */}
            {isStreaming ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full bg-card border border-border rounded-xl p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                    <span className="text-sm font-medium">
                      Preparing questions in the background…
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {loadingQuestions.length} / {count} loaded
                  </span>
                </div>

                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(loadingQuestions.length / count) * 100}%` }}
                  />
                </div>
              </motion.div>
            ) : (
              <motion.button
                onClick={handleGenerate}
                disabled={loading}
                whileHover={loading ? {} : { scale: 1.01 }}
                whileTap={loading ? {} : { scale: 0.98 }}
                className={`relative w-full h-14 rounded-xl font-bold text-base text-white overflow-hidden flex items-center justify-center gap-2.5 transition-all disabled:opacity-70 disabled:cursor-not-allowed shadow-lg ${meta.glow}`}>
                <div className={`absolute inset-0 bg-gradient-to-r ${meta.color}`} />
                <div className={`absolute inset-0 bg-gradient-to-r ${meta.color} opacity-0 hover:opacity-80 transition-opacity`}
                  style={{ filter: "brightness(1.1)" }} />
                <span className="relative flex items-center gap-2">
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Loading questions from API…
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      Start Mock Test — {count} Questions
                      <ChevronRight className="w-4 h-4" />
                    </>
                  )}
                </span>
              </motion.button>
            )}
>>>>>>> 93a7dc92fe6f913253f4c85559f26dcf6361878c

            <p className="text-center text-xs text-muted-foreground">
              Mock test make you perfect
            </p>
          </div>
        </motion.div>

        {/* ── Quick Access Grid ─────────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5, ease: smoothEase }}
          className="mt-6 grid grid-cols-3 gap-3">
          {[
            { label: "Previous Year Papers", sub: "2018 – 2024", icon: BookOpen, to: "/prev-year-questions", color: "from-orange-500/10 to-red-500/10 border-blue-500/20 hover:border-blue-500/40", icon_color: "text-blue-500" },
            { label: "Current Affairs", sub: "Daily Updates", icon: Zap, to: "/current-affairs", color: "from-amber-500/10 to-orange-500/10 border-amber-500/20 hover:border-amber-500/40", icon_color: "text-amber-500" },
            { label: "Leaderboard", sub: "Top Aspirants", icon: Trophy, to: "/leaderboard", color: "from-orange-500/10 to-purple-500/10 border-orange-500/20 hover:border-orange-500/40", icon_color: "text-orange-500" },
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

        {/* ── Motivational bottom strip ─────────────────────────────────── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.5 }}
          className="mt-6 rounded-2xl border border-border/40 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-900/60 dark:to-slate-900/60 p-5 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0">
            <Flame className="w-5 h-5 text-amber-400" />
          </div>
          <div className="text-center sm:text-left">
            <p className="text-sm font-bold text-white">You're building your future today 🚀</p>
            <p className="text-xs text-slate-400 mt-0.5">Consistent daily practice is the #1 predictor of success in government exams. Even 30 min a day makes a huge difference.</p>
          </div>
          <Link to="/leaderboard" className="flex-shrink-0 ml-auto hidden sm:block">
            <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-500/30 text-amber-400 text-xs font-semibold hover:bg-amber-500/30 transition-colors">
              View Rankings
            </motion.button>
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
