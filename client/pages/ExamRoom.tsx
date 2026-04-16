import { useState, useEffect, useCallback } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { usePageSEO } from "@/lib/page-seo";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { getSession } from "@/lib/auth-api";
import {
  ArrowLeft,
  BookOpen,
  ChevronRight,
  ChevronDown,
  Lock,
  Unlock,
  Play,
  CheckCircle2,
  Clock,
  Trophy,
  Target,
  Loader2,
  AlertCircle,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface UserStats {
  attempted: number;
  score: number | null;
  accuracy: number | null;
  timeTaken: number | null;
}

interface MockTest {
  testId: string;
  chapterName: string;
  difficulty: "Easy" | "Medium" | "Hard";
  totalQuestions: number;
  timeLimit: number;
  marksPerQuestion: number;
  negativeMarking: number;
  status: "locked" | "unlocked";
  userStats: UserStats | null;
}

interface Chapter {
  chapterId: number;
  chapterName: string;
  chapterNameBn: string;
  sortOrder: number;
  tests: MockTest[];
}

interface Subject {
  subjectId: number;
  subjectName: string;
  subjectNameBn: string;
  sortOrder: number;
  chapters: Chapter[];
}

interface Exam {
  id: number;
  name: string;
  name_bn: string;
  slug: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const DIFFICULTY_STYLES: Record<string, string> = {
  Easy:   "bg-emerald-50 text-emerald-700 border-emerald-200",
  Medium: "bg-amber-50  text-amber-700   border-amber-200",
  Hard:   "bg-rose-50   text-rose-700    border-rose-200",
};

const DIFFICULTY_RING: Record<string, string> = {
  Easy:   "ring-emerald-400",
  Medium: "ring-amber-400",
  Hard:   "ring-rose-400",
};

const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8000";

// ─── API helpers ──────────────────────────────────────────────────────────────

async function fetchExams(): Promise<Exam[]> {
  const r = await fetch(`${API_BASE}/exam-room/exams`);
  const d = await r.json();
  return d.success ? d.data : [];
}

async function fetchExamRoom(slug: string, token?: string): Promise<{ exam: Exam; subjects: Subject[] }> {
  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const r = await fetch(`${API_BASE}/api/exam-room/${slug}`, { headers });
  if (!r.ok) throw new Error("Exam not found");
  const d = await r.json();
  if (!d.success) throw new Error(d.error ?? "Failed to load exam room");
  return { exam: d.exam, subjects: d.subjects };
}

function fmtTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return `${m}m ${s.toString().padStart(2, "0")}s`;
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function TestCard({ test, onStart }: { test: MockTest; onStart: (t: MockTest) => void }) {
  const isLocked    = test.status === "locked";
  const attempted   = !!test.userStats?.accuracy;
  const accuracy    = test.userStats?.accuracy ?? 0;
  const passed      = accuracy >= 60;

  return (
    <div
      className={`relative rounded-xl border p-4 transition-all duration-200 ${
        isLocked
          ? "bg-gray-50 border-gray-200 opacity-70"
          : attempted
          ? passed
            ? "bg-emerald-50/60 border-emerald-200 hover:shadow-md"
            : "bg-rose-50/60 border-rose-200 hover:shadow-md"
          : "bg-white border-gray-200 hover:shadow-md hover:border-violet-300"
      }`}
    >
      {/* Difficulty badge */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${DIFFICULTY_STYLES[test.difficulty]}`}>
          {test.difficulty}
        </span>
        {isLocked ? (
          <Lock className="w-4 h-4 text-gray-400" />
        ) : attempted ? (
          passed
            ? <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            : <AlertCircle className="w-4 h-4 text-rose-500" />
        ) : (
          <Unlock className="w-4 h-4 text-violet-400" />
        )}
      </div>

      {/* Stats row */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
        <span className="flex items-center gap-1"><Target className="w-3 h-3" /> {test.totalQuestions} Qs</span>
        <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {test.timeLimit} min</span>
        <span className="flex items-center gap-1"><Star className="w-3 h-3" /> +{test.marksPerQuestion} / -{test.negativeMarking}</span>
      </div>

      {/* Previous result */}
      {attempted && (
        <div className="mb-3 space-y-1">
          <div className="flex justify-between text-[11px] font-medium">
            <span className="text-gray-500">Last accuracy</span>
            <span className={passed ? "text-emerald-600" : "text-rose-600"}>{accuracy.toFixed(1)}%</span>
          </div>
          <Progress value={accuracy} className="h-1.5" />
          {test.userStats?.timeTaken && (
            <p className="text-[11px] text-gray-400">Time: {fmtTime(test.userStats.timeTaken)}</p>
          )}
        </div>
      )}

      {/* Action */}
      {isLocked ? (
        <p className="text-[11px] text-gray-400 text-center">
          Score ≥ 60% in {test.difficulty === "Medium" ? "Easy" : "Medium"} to unlock
        </p>
      ) : (
        <Button
          size="sm"
          className="w-full text-xs"
          variant={attempted ? "outline" : "default"}
          onClick={() => onStart(test)}
        >
          <Play className="w-3 h-3 mr-1" />
          {attempted ? "Retake Test" : "Start Test"}
        </Button>
      )}
    </div>
  );
}

function ChapterRow({
  chapter,
  onStart,
}: {
  chapter: Chapter;
  onStart: (t: MockTest) => void;
}) {
  const [open, setOpen] = useState(false);
  const attempted = chapter.tests.filter(t => t.userStats?.accuracy != null).length;
  const total     = chapter.tests.length;

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-4 py-3 bg-gray-50/80 hover:bg-gray-100 transition-colors text-left"
        onClick={() => setOpen(v => !v)}
      >
        <div className="flex items-center gap-3">
          <BookOpen className="w-4 h-4 text-violet-500 shrink-0" />
          <div>
            <p className="text-sm font-semibold text-gray-800">{chapter.chapterName}</p>
            {chapter.chapterNameBn && (
              <p className="text-[11px] text-gray-400">{chapter.chapterNameBn}</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-gray-500 hidden sm:block">
            {attempted}/{total} attempted
          </span>
          {ChevronDown && (
            <ChevronDown
              className={`w-4 h-4 text-gray-400 transition-transform ${open ? "rotate-180" : ""}`}
            />
          )}
        </div>
      </button>

      {open && (
        <div className="p-3 grid grid-cols-1 sm:grid-cols-3 gap-3 bg-white">
          {chapter.tests.map(test => (
            <TestCard key={test.testId} test={test} onStart={onStart} />
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Exam Selector ────────────────────────────────────────────────────────────

function ExamGrid({
  exams,
  onSelect,
}: {
  exams: Exam[];
  onSelect: (slug: string) => void;
}) {
  const EXAM_ICONS: Record<string, string> = {
    "wbcs":                  "🏛️",
    "wbpsc":                 "📋",
    "wb-police-si":          "👮",
    "wb-police-constable":   "🚔",
    "ssc-cgl":               "📊",
    "ssc-chsl":              "📝",
    "ssc-mts":               "🔧",
    "ssc-gd":                "🛡️",
    "banking-ibps-sbi":      "🏦",
    "railway-group-d":       "🚂",
    "railway-ntpc":          "🚆",
    "wbpsc-food-si":         "🌾",
    "wbpsc-misc-services":   "🗂️",
    "lic-aao-ado":           "💼",
    "post-office-gds":       "📮",
    "nda-cds":               "🎖️",
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      {exams.map(exam => (
        <button
          key={exam.id}
          onClick={() => onSelect(exam.slug)}
          className="flex flex-col items-center gap-2 p-5 rounded-2xl border-2 border-gray-100 bg-white hover:border-violet-400 hover:shadow-lg transition-all duration-200 group"
        >
          <span className="text-3xl">{EXAM_ICONS[exam.slug] ?? "📚"}</span>
          <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-violet-700 leading-tight">
            {exam.name}
          </span>
          {exam.name_bn && (
            <span className="text-[11px] text-gray-400">{exam.name_bn}</span>
          )}
        </button>
      ))}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ExamRoom() {
  usePageSEO("/exam-room");
  const navigate                            = useNavigate();
  const { toast }                           = useToast();
  const session                             = getSession();
  const token                               = session?.token;

  const [exams, setExams]                   = useState<Exam[]>([]);
  const [selectedSlug, setSelectedSlug]     = useState<string | null>(null);
  const [examData, setExamData]             = useState<{ exam: Exam; subjects: Subject[] } | null>(null);
  const [openSubjectIds, setOpenSubjectIds] = useState<Set<number>>(new Set());
  const [loadingExams, setLoadingExams]     = useState(true);
  const [loadingRoom, setLoadingRoom]       = useState(false);
  const [error, setError]                   = useState<string | null>(null);

  // Load exam list on mount
  useEffect(() => {
    fetchExams()
      .then(setExams)
      .catch(() => setError("Failed to load exams"))
      .finally(() => setLoadingExams(false));
  }, []);

  // Load exam room when a slug is selected
  const handleSelectExam = useCallback(async (slug: string) => {
    setSelectedSlug(slug);
    setExamData(null);
    setError(null);
    setLoadingRoom(true);
    try {
      const data = await fetchExamRoom(slug, token ?? undefined);
      setExamData(data);
      // Open first subject by default
      if (data.subjects.length > 0) {
        setOpenSubjectIds(new Set([data.subjects[0].subjectId]));
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load exam room");
    } finally {
      setLoadingRoom(false);
    }
  }, [token]);

  const toggleSubject = (id: number) => {
    setOpenSubjectIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // When user starts a test: fetch questions & navigate into the existing GovtTest flow
  const handleStartTest = useCallback(async (test: MockTest) => {
    if (!token) {
      toast({ title: "Login required", description: "Please log in to take tests.", variant: "destructive" });
      navigate("/auth");
      return;
    }

    try {
      const r = await fetch(`${API_BASE}/api/exam-room/test/${test.testId}/questions`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const d = await r.json();
      if (!d.success) throw new Error(d.error ?? "Could not load questions");

      // Map to GovtQuestion shape expected by /govt-test
      const lang = localStorage.getItem("interview-ai-language") ?? "en";
      const questions = d.questions.map((q: Record<string, unknown>, idx: number) => ({
        id:           typeof q.id === "number" ? q.id : idx + 1,
        exam:         (examData?.exam.name ?? "Exam") as any,
        subject:      (test.chapterName ?? "General") as any,
        difficulty:   (q.difficulty ?? test.difficulty) as any,
        question:     lang === "bn" && q.textBn ? String(q.textBn) : String(q.text ?? ""),
        options: [
          String(q.optionA ?? ""),
          String(q.optionB ?? ""),
          String(q.optionC ?? ""),
          String(q.optionD ?? ""),
        ] as [string, string, string, string],
        correctIndex: 0, // not returned by API (stripped server-side)
        explanation:  "",
      }));

      navigate("/govt-test", {
        state: {
          config: {
            exam:       (examData?.exam.name ?? "WBCS") as any,
            customExam: examData?.exam.name,
            subject:    (test.chapterName ?? null) as any,
            difficulty: (test.difficulty ?? "Medium") as any,
            count:      (test.totalQuestions ?? questions.length ?? 25) as any,
          },
          questions,
          language:     lang === "bn" ? "bengali" : "english",
          isExamRoom:   true,
          testId:       test.testId,
          marksPerQ:    test.marksPerQuestion,
          negativeMarks: test.negativeMarking,
        },
      });
    } catch (err: unknown) {
      toast({
        title: "Could not start test",
        description: err instanceof Error ? err.message : "No questions available yet",
        variant: "destructive",
      });
    }
  }, [token, examData, navigate, toast]);

  // ── Summary stats helper ──────────────────────────────────────────────────

  const getSummary = (subjects: Subject[]) => {
    let total     = 0;
    let attempted = 0;
    let passed    = 0;
    for (const s of subjects) {
      for (const c of s.chapters) {
        for (const t of c.tests) {
          total++;
          if (t.userStats?.accuracy != null) {
            attempted++;
            if (t.userStats.accuracy >= 60) passed++;
          }
        }
      }
    }
    return { total, attempted, passed };
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 via-white to-indigo-50">
      {/* Header */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-lg border-b border-gray-100 px-4 py-3">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          {selectedSlug ? (
            <button
              onClick={() => { setSelectedSlug(null); setExamData(null); }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <Link to="/dashboard" className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-500 transition-colors">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}
          <div>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-violet-600" />
              {examData ? examData.exam.name : "Exam Room"}
            </h1>
            <p className="text-xs text-gray-500">
              {examData
                ? "Chapter-wise mock tests with progressive difficulty"
                : "Select an exam to begin chapter-wise practice"}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* Loading state */}
        {(loadingExams || loadingRoom) && (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="flex items-center gap-3 p-4 bg-rose-50 border border-rose-200 rounded-xl text-rose-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Exam selector */}
        {!loadingExams && !selectedSlug && !error && (
          <section className="space-y-4">
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-violet-600" />
              <h2 className="text-base font-semibold text-gray-800">Choose an Exam</h2>
            </div>
            <ExamGrid exams={exams} onSelect={handleSelectExam} />
          </section>
        )}

        {/* Exam room content */}
        {!loadingRoom && examData && (
          <>
            {/* Summary bar */}
            {(() => {
              const { total, attempted, passed } = getSummary(examData.subjects);
              const pct = total > 0 ? Math.round((attempted / total) * 100) : 0;
              return (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                    <p className="text-2xl font-bold text-violet-700">{total}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Total Tests</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                    <p className="text-2xl font-bold text-amber-600">{attempted}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Attempted</p>
                  </div>
                  <div className="bg-white rounded-xl border border-gray-100 p-3 text-center">
                    <p className="text-2xl font-bold text-emerald-600">{passed}</p>
                    <p className="text-xs text-gray-500 mt-0.5">Passed (≥60%)</p>
                  </div>
                </div>
              );
            })()}

            {/* Subjects + chapters */}
            {examData.subjects.map(subject => (
              <section key={subject.subjectId} className="space-y-2">
                {/* Subject header */}
                <button
                  className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 transition-all"
                  onClick={() => toggleSubject(subject.subjectId)}
                >
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4" />
                    <span className="font-semibold text-sm">{subject.subjectName}</span>
                    {subject.subjectNameBn && (
                      <span className="text-violet-200 text-xs">({subject.subjectNameBn})</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-violet-200">
                      {subject.chapters.length} chapters
                    </span>
                    <ChevronRight
                      className={`w-4 h-4 transition-transform ${
                        openSubjectIds.has(subject.subjectId) ? "rotate-90" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Chapters */}
                {openSubjectIds.has(subject.subjectId) && (
                  <div className="pl-2 space-y-2">
                    {subject.chapters.map(chapter => (
                      <ChapterRow
                        key={chapter.chapterId}
                        chapter={chapter}
                        onStart={handleStartTest}
                      />
                    ))}
                  </div>
                )}
              </section>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
