import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Eye, Timer, Download, ChevronLeft, ChevronRight,
  CheckCircle2, XCircle, ArrowLeft, Brain, Target,
  Flag, Star, TrendingUp, RotateCcw, BookOpen, Award,
  ListChecks, ChevronDown, ChevronUp, AlertTriangle,
  Zap, PenLine, Shield, Clock,
} from "lucide-react";
import jsPDF from "jspdf";
import {
  fetchMockTestPaper,
  type MockPaperMeta,
  type MockQuestion,
} from "@/lib/mock-test-paper";

// ══════════════════════════════════════════════════════════════════════════════
// PYTHON BACKEND API CONFIGURATION
//
// This page exclusively calls your SEPARATE Python backend server.
// Configure the base URL in your .env file:
//   VITE_MOCK_API_URL=http://localhost:8000
//
// ── ENDPOINT ────────────────────────────────────────────────────────────────
//   GET {VITE_MOCK_API_URL}/api/mock/daily-paper?exam={examType}
//
// ── EXPECTED JSON RESPONSE ───────────────────────────────────────────────────
// {
//   "exam": "WBCS",
//   "paper_title": "WBCS Daily Mock Test - March 18, 2026",
//   "total_questions": 60,
//   "duration_minutes": 60,
//   "generated_at": "2026-03-18T10:30:00Z",
//   "questions": [
//     {
//       "id": 1,
//       "subject": "History",
//       "topic": "Indian National Movement",
//       "difficulty": "Easy",            // "Easy" | "Medium" | "Hard"
//       "question": "When was Quit India Movement launched?",
//       "options": ["1940", "1941", "1942", "1943"],
//       "correct_index": 2,              // 0-based index into options
//       "correct_option": "1942",
//       "explanation": "The Quit India Movement was launched on August 8, 1942.",
//       "tags": ["Freedom Struggle", "Gandhi"]
//     }
//   ]
// }
// ══════════════════════════════════════════════════════════════════════════════

const EXAM_DURATION_SECONDS = 60 * 60; // 60 minutes

// ── Types ───────────────────────────────────────────────────────────────────

type Mode = "choice" | "loading" | "viewing" | "attempting" | "submitted";

// ── Constants ────────────────────────────────────────────────────────────────

const SUBJECT_PALETTE: Record<string, { gradient: string; light: string; badge: string; dot: string }> = {
  History:           { gradient: "from-amber-500 to-orange-500",    light: "bg-amber-50 border-amber-200",    badge: "bg-amber-100 text-amber-700 border-amber-300",    dot: "bg-amber-500" },
  Geography:         { gradient: "from-emerald-500 to-teal-500",    light: "bg-emerald-50 border-emerald-200", badge: "bg-emerald-100 text-emerald-700 border-emerald-300", dot: "bg-emerald-500" },
  Polity:            { gradient: "from-blue-500 to-indigo-500",      light: "bg-blue-50 border-blue-200",      badge: "bg-blue-100 text-blue-700 border-blue-300",      dot: "bg-blue-500" },
  Reasoning:         { gradient: "from-purple-500 to-violet-500",    light: "bg-purple-50 border-purple-200",   badge: "bg-purple-100 text-purple-700 border-purple-300",   dot: "bg-purple-500" },
  Math:              { gradient: "from-rose-500 to-pink-500",        light: "bg-rose-50 border-rose-200",       badge: "bg-rose-100 text-rose-700 border-rose-300",       dot: "bg-rose-500" },
  "Current Affairs": { gradient: "from-cyan-500 to-sky-500",        light: "bg-cyan-50 border-cyan-200",       badge: "bg-cyan-100 text-cyan-700 border-cyan-300",       dot: "bg-cyan-500" },
  Science:           { gradient: "from-teal-500 to-green-500",       light: "bg-teal-50 border-teal-200",       badge: "bg-teal-100 text-teal-700 border-teal-300",       dot: "bg-teal-500" },
  Economics:         { gradient: "from-orange-500 to-amber-500",     light: "bg-orange-50 border-orange-200",   badge: "bg-orange-100 text-orange-700 border-orange-300",   dot: "bg-orange-500" },
};
const DEFAULT_PALETTE = { gradient: "from-slate-500 to-slate-600", light: "bg-slate-50 border-slate-200", badge: "bg-slate-100 text-slate-700 border-slate-300", dot: "bg-slate-500" };

const DIFF_CONFIG = {
  Easy:   { label: "Easy",   cls: "bg-green-100 text-green-700 border-green-300" },
  Medium: { label: "Med",    cls: "bg-amber-100 text-amber-700 border-amber-300" },
  Hard:   { label: "Hard",   cls: "bg-red-100 text-red-700 border-red-300" },
};

const OPTION_LABELS = ["A", "B", "C", "D"];

function hasUnicodeText(text: string): boolean {
  return /[^\u0000-\u00ff]/.test(text);
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatTime(secs: number) {
  const h = Math.floor(secs / 3600);
  const m = Math.floor((secs % 3600) / 60).toString().padStart(2, "0");
  const s = (secs % 60).toString().padStart(2, "0");
  return h > 0 ? `${h}:${m}:${s}` : `${m}:${s}`;
}

function subjectPalette(s: string) {
  return SUBJECT_PALETTE[s] ?? DEFAULT_PALETTE;
}

// ── Component ────────────────────────────────────────────────────────────────

export default function MockTestPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examType = searchParams.get("exam") ?? "WBCS";

  const [mode, setMode] = useState<Mode>("choice");
  const [pendingMode, setPendingMode] = useState<"viewing" | "attempting">("viewing");
  const [questions, setQuestions] = useState<MockQuestion[]>([]);
  const [meta, setMeta] = useState<MockPaperMeta | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(0);

  // View Paper state
  const [subjectFilter, setSubjectFilter] = useState("All");
  const [expanded, setExpanded] = useState<Set<number>>(new Set());

  // Attempt state
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [flagged, setFlagged] = useState<Set<number>>(new Set());
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_SECONDS);
  const [autoSubmitted, setAutoSubmitted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedAt = useRef(0);

  // Loading messages
  const LOADING_MSGS = [
    "Connecting to AI engine…",
    "Personalising your paper…",
    "Curating questions…",
    "Checking difficulty balance…",
    "Almost ready…",
  ];
  useEffect(() => {
    if (mode !== "loading") return;
    const id = setInterval(() => setLoadingMsg((p) => Math.min(p + 1, LOADING_MSGS.length - 1)), 1200);
    return () => clearInterval(id);
  }, [mode]);

  // Timer
  useEffect(() => {
    if (mode !== "attempting") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((p) => {
        if (p <= 1) {
          clearInterval(timerRef.current!);
          setAutoSubmitted(true);
          setMode("submitted");
          return 0;
        }
        return p - 1;
      });
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current!); };
  }, [mode]);

  const fetchPaper = useCallback(async (next: "viewing" | "attempting") => {
    setPendingMode(next);
    setMode("loading");
    setError(null);
    setLoadingMsg(0);
    try {
      const data = await fetchMockTestPaper(examType);
      setQuestions(data.questions);
      setMeta({
        exam: data.meta.exam,
        paper_title: data.meta.paper_title,
        total_questions: data.meta.total_questions,
        duration_minutes: data.meta.duration_minutes,
        generated_at: data.meta.generated_at,
      });

      if (next === "viewing") {
        setSubjectFilter("All");
        setExpanded(new Set());
        setMode("viewing");
      } else {
        setCurrentIdx(0);
        setAnswers({});
        setFlagged(new Set());
        setTimeLeft(EXAM_DURATION_SECONDS);
        setAutoSubmitted(false);
        startedAt.current = Date.now();
        setMode("attempting");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
      setMode("choice");
    }
  }, [examType]);

  const handleSubmit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current!);
    setShowSubmitConfirm(false);
    setMode("submitted");
  }, []);

  const calcResult = useCallback(() => {
    let correct = 0, wrong = 0, skipped = 0;
    const bySubject: Record<string, { correct: number; total: number }> = {};
    for (const q of questions) {
      if (!bySubject[q.subject]) bySubject[q.subject] = { correct: 0, total: 0 };
      bySubject[q.subject].total++;
      const ans = answers[q.id];
      if (ans === undefined || ans === null) {
        skipped++;
      } else if (ans === q.correct_index) {
        correct++;
        bySubject[q.subject].correct++;
      } else {
        wrong++;
      }
    }
    const timeTaken = EXAM_DURATION_SECONDS - timeLeft;
    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    return { correct, wrong, skipped, bySubject, timeTaken, score };
  }, [questions, answers, timeLeft]);

  const downloadPDF = useCallback(() => {
    const visible = subjectFilter === "All" ? questions : questions.filter((q) => q.subject === subjectFilter);
    const containsUnicode =
      hasUnicodeText(meta?.paper_title ?? "") ||
      visible.some(
        (q) =>
          hasUnicodeText(q.question) ||
          q.options.some((opt) => hasUnicodeText(opt)) ||
          hasUnicodeText(q.explanation),
      );

    // jsPDF default fonts cannot render Bengali/Unicode text reliably.
    // Use a hidden iframe + print (no new tab; avoids popup blockers).
    // If that fails, download UTF-8 HTML — open it and use Print → Save as PDF.
    if (containsUnicode) {
      const generatedAt = meta?.generated_at
        ? new Date(meta.generated_at).toLocaleDateString("en-IN")
        : new Date().toLocaleDateString("en-IN");

      const html = `
<!doctype html>
<html>
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(meta?.paper_title ?? `${examType} Mock Test`)}</title>
  <style>
    body { font-family: "Nirmala UI", "Segoe UI", Arial, sans-serif; margin: 24px; color: #111; }
    h1 { font-size: 20px; margin: 0 0 8px; }
    .meta { font-size: 12px; color: #555; margin-bottom: 16px; }
    .q { margin: 14px 0 18px; page-break-inside: avoid; }
    .qt { font-weight: 700; margin-bottom: 8px; }
    .opt { margin: 2px 0; }
    .exp { font-size: 12px; color: #444; margin-top: 6px; }
    @media print { body { margin: 16px; } }
  </style>
</head>
<body>
  <h1>${escapeHtml(meta?.paper_title ?? `${examType} Mock Test`)}</h1>
  <div class="meta">${escapeHtml(`${visible.length} Questions | Generated: ${generatedAt}`)}</div>
  ${visible
    .map(
      (q, i) => `
    <div class="q">
      <div class="qt">Q${i + 1}. ${escapeHtml(q.question)}</div>
      ${q.options
        .map((opt, oi) => `<div class="opt">${OPTION_LABELS[oi]}. ${escapeHtml(opt)}${oi === q.correct_index ? " (Correct)" : ""}</div>`)
        .join("")}
      <div class="exp">${escapeHtml(`Explanation: ${q.explanation}`)}</div>
    </div>`,
    )
    .join("")}
</body>
</html>`;

      const downloadHtmlFile = () => {
        const blob = new Blob([`\ufeff${html}`], { type: "text/html;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `${examType}_mock_paper_${new Date().toISOString().split("T")[0]}.html`;
        a.rel = "noopener";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      };

      const iframe = document.createElement("iframe");
      iframe.setAttribute("aria-hidden", "true");
      iframe.style.cssText =
        "position:fixed;right:0;bottom:0;width:0;height:0;border:0;opacity:0;pointer-events:none;";
      document.body.appendChild(iframe);

      const idoc = iframe.contentDocument;
      const iwin = iframe.contentWindow;
      if (!idoc || !iwin) {
        iframe.remove();
        downloadHtmlFile();
        return;
      }

      idoc.open();
      idoc.write(html);
      idoc.close();

      let cleaned = false;
      const cleanup = () => {
        if (cleaned) return;
        cleaned = true;
        window.clearTimeout(failsafeId);
        try {
          iwin.removeEventListener("afterprint", onAfterPrint);
        } catch {
          /* ignore */
        }
        iframe.remove();
      };
      const onAfterPrint = () => cleanup();
      iwin.addEventListener("afterprint", onAfterPrint);
      const failsafeId = window.setTimeout(cleanup, 120_000);

      window.setTimeout(() => {
        try {
          iwin.focus();
          iwin.print();
        } catch {
          cleanup();
          downloadHtmlFile();
        }
      }, 200);
      return;
    }

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
    const pageH = doc.internal.pageSize.height;
    const pageW = doc.internal.pageSize.width;
    const margin = 15;
    const maxW = pageW - margin * 2;
    let y = 20;

    const addText = (
      text: string,
      fontSize = 11,
      bold = false,
      rgb: [number, number, number] = [30, 30, 30],
    ) => {
      if (y > pageH - 18) { doc.addPage(); y = 18; }
      doc.setFontSize(fontSize);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.setTextColor(...rgb);
      const lines = doc.splitTextToSize(text, maxW) as string[];
      doc.text(lines, margin, y);
      y += lines.length * (fontSize * 0.42) + 1.5;
    };

    // Title block
    doc.setFillColor(30, 41, 59);
    doc.rect(0, 0, pageW, 38, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(meta?.paper_title ?? `${examType} Mock Test`, margin, 16);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 190, 210);
    doc.text(
      `${questions.length} Questions  |  ${meta?.duration_minutes ?? 60} Minutes  |  Generated: ${meta?.generated_at ? new Date(meta.generated_at).toLocaleDateString("en-IN") : new Date().toLocaleDateString("en-IN")}`,
      margin,
      26,
    );
    doc.text("Answer Key Included — For Study Purpose Only", margin, 33);
    y = 46;

    visible.forEach((q, i) => {
      if (y > pageH - 55) { doc.addPage(); y = 18; }

      // Question header
      addText(`Q${i + 1}.  ${q.question}`, 11, true, [15, 23, 42]);
      q.options.forEach((opt, oi) => {
        const mark = oi === q.correct_index ? "  ✓" : "";
        addText(
          `    ${OPTION_LABELS[oi]}. ${opt}${mark}`,
          10,
          oi === q.correct_index,
          oi === q.correct_index ? [5, 120, 60] : [55, 65, 81],
        );
      });
      addText(`   ↳ ${q.explanation}`, 9, false, [100, 116, 140]);
      y += 3;
    });

    const filename = `${examType}_mock_paper_${new Date().toISOString().split("T")[0]}.pdf`;
    doc.save(filename);
  }, [questions, meta, examType, subjectFilter]);

  // ── Unique subjects for filter bar ────────────────────────────────────────
  const subjects = ["All", ...Array.from(new Set(questions.map((q) => q.subject)))];

  // ── Viewing: filtered questions ───────────────────────────────────────────
  const visibleQuestions = subjectFilter === "All"
    ? questions
    : questions.filter((q) => q.subject === subjectFilter);

  // ── Attempt: current question ──────────────────────────────────────────────
  const currentQ = questions[currentIdx];
  const totalAnswered = Object.values(answers).filter((a) => a !== null && a !== undefined).length;
  const timerCritical = timeLeft <= 300;
  const timerWarning = timeLeft <= 900;

  // ═══════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════

  // ── 1. CHOICE SCREEN ──────────────────────────────────────────────────────
  if (mode === "choice") {
    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        {/* Decorative background layers */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.08),transparent)]" />
        <div className="absolute inset-0"
          style={{ backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }} />
        <div className="absolute top-40 -left-32 w-96 h-96 rounded-full bg-indigo-100/60 blur-3xl pointer-events-none" />
        <div className="absolute top-60 -right-32 w-96 h-96 rounded-full bg-orange-100/60 blur-3xl pointer-events-none" />

        {/* Header */}
        <header className="relative z-10 border-b border-slate-200 bg-white/80 backdrop-blur-sm">
          <div className="container px-4 h-14 flex items-center gap-3 max-w-6xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
            <div className="w-px h-4 bg-slate-200" />
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Daily Mock</span>
              <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300 text-[10px]">
                {examType}
              </Badge>
            </div>
          </div>
        </header>

        <main className="relative z-10 container px-4 py-12 max-w-6xl mx-auto">
          {/* Hero */}
          <div className="text-center mb-12 space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-xs text-indigo-600 mb-2">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              AI-Personalised for You · {examType} Exam
            </div>
            <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
              Today's Mock{" "}
              <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Test Paper
              </span>
            </h1>
            <p className="text-slate-500 text-lg max-w-xl mx-auto leading-relaxed">
              Questions crafted from your syllabus, adaptive to your level. Choose how you want to engage today.
            </p>
          </div>

          {error && (
            <div className="mb-8 max-w-lg mx-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Two choice cards */}
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">

            {/* ── Card 1: View Paper ─────────────────────────────────── */}
            <div
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{ boxShadow: "0 4px 40px -10px rgba(99,102,241,0.25), 0 10px 30px -10px rgba(0,0,0,0.1)" }}
              onClick={() => fetchPaper("viewing")}
            >
              {/* Gradient header band */}
              <div className="relative h-32 bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 border border-white/10" />
                <div className="absolute -right-2 -bottom-10 w-24 h-24 rounded-full bg-white/5 border border-white/10" />
                <div className="relative z-10 p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl">
                    <Eye className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-0.5">Option 01</p>
                    <h2 className="text-2xl font-black text-white">View Paper</h2>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="bg-white border border-slate-200 border-t-0 rounded-b-2xl p-6 space-y-5">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Explore the full question paper with correct answers and detailed explanations. Great for learning before attempting.
                </p>

                <div className="space-y-2.5">
                  {[
                    { icon: ListChecks, text: "Complete question paper with answer key" },
                    { icon: BookOpen, text: "Detailed explanation for every question" },
                    { icon: Target, text: "Filter questions by subject" },
                    { icon: Download, text: "Download as PDF for offline study" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-indigo-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-indigo-600" />
                      </div>
                      <span className="text-sm text-slate-600">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: "Questions", value: "~60", color: "text-indigo-600" },
                    { label: "Subjects", value: "6+", color: "text-purple-600" },
                    { label: "Format", value: "MCQ", color: "text-blue-600" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold h-11 text-sm gap-2 group-hover:shadow-lg group-hover:shadow-indigo-500/25 transition-all border-0"
                >
                  <Eye className="w-4 h-4" />
                  Explore Full Paper
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </div>

            {/* ── Card 2: Attempt Test ─────────────────────────────────── */}
            <div
              className="group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:scale-[1.02]"
              style={{ boxShadow: "0 4px 40px -10px rgba(234,88,12,0.25), 0 10px 30px -10px rgba(0,0,0,0.1)" }}
              onClick={() => fetchPaper("attempting")}
            >
              {/* Gradient header band */}
              <div className="relative h-32 bg-gradient-to-br from-orange-600 via-red-600 to-rose-700 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.12),transparent_60%)]" />
                <div className="absolute -right-8 -top-8 w-40 h-40 rounded-full bg-white/5 border border-white/10" />
                <div className="absolute -right-2 -bottom-10 w-24 h-24 rounded-full bg-white/5 border border-white/10" />
                <div className="relative z-10 p-6 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20 flex items-center justify-center shadow-xl">
                    <Timer className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <p className="text-white/60 text-xs uppercase tracking-widest font-semibold mb-0.5">Option 02</p>
                    <h2 className="text-2xl font-black text-white">Attempt Test</h2>
                  </div>
                </div>
              </div>

              {/* Card body */}
              <div className="bg-white border border-slate-200 border-t-0 rounded-b-2xl p-6 space-y-5">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Simulate real exam conditions with a 60-minute countdown timer. Test your speed, accuracy, and time management.
                </p>

                <div className="space-y-2.5">
                  {[
                    { icon: Clock, text: "Strict 60-minute countdown timer" },
                    { icon: Flag, text: "Mark questions for later review" },
                    { icon: Brain, text: "Real exam hall interface" },
                    { icon: Award, text: "Instant result with subject analysis" },
                  ].map(({ icon: Icon, text }) => (
                    <div key={text} className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Icon className="w-3.5 h-3.5 text-orange-600" />
                      </div>
                      <span className="text-sm text-slate-600">{text}</span>
                    </div>
                  ))}
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {[
                    { label: "Duration", value: "60m", color: "text-orange-600" },
                    { label: "Marking", value: "+1", color: "text-red-600" },
                    { label: "Penalty", value: "0", color: "text-rose-600" },
                  ].map((s) => (
                    <div key={s.label} className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                      <p className={`text-lg font-black ${s.color}`}>{s.value}</p>
                      <p className="text-[10px] text-slate-400 uppercase tracking-wider mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500 text-white font-semibold h-11 text-sm gap-2 group-hover:shadow-lg group-hover:shadow-orange-500/25 transition-all border-0"
                >
                  <Timer className="w-4 h-4" />
                  Start Exam Now
                  <ChevronRight className="w-4 h-4 ml-auto" />
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom info strip */}
          <div className="mt-10 max-w-4xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: Shield, label: "Exam Pattern", sub: "Strictly aligned" },
              { icon: Zap,    label: "AI Generated", sub: "Smart selection" },
              { icon: Star,   label: "Adaptive",     sub: "Based on your level" },
              { icon: TrendingUp, label: "Detailed Results", sub: "Subject-wise analysis" },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-50 border border-slate-200">
                <div className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Icon className="w-4 h-4 text-slate-500" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-700">{label}</p>
                  <p className="text-[10px] text-slate-400">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    );
  }

  // ── 2. LOADING SCREEN ─────────────────────────────────────────────────────
  if (mode === "loading") {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(99,102,241,0.06),transparent)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-50 blur-3xl pointer-events-none" />

        {/* Back button */}
        <button
          onClick={() => { setMode("choice"); }}
          className="absolute top-5 left-5 z-20 flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>

        <div className="relative text-center space-y-6 z-10">
          {/* Animated spinner ring */}
          <div className="relative w-24 h-24 mx-auto">
            <svg className="w-24 h-24 -rotate-90 animate-spin" style={{ animationDuration: "2s" }} viewBox="0 0 96 96">
              <circle cx="48" cy="48" r="40" fill="none" stroke="rgba(99,102,241,0.12)" strokeWidth="6" />
              <circle cx="48" cy="48" r="40" fill="none" stroke="url(#spinner-grad)" strokeWidth="6"
                strokeLinecap="round" strokeDasharray="251" strokeDashoffset="188" />
              <defs>
                <linearGradient id="spinner-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6366f1" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Brain className="w-9 h-9 text-indigo-500" />
            </div>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Generating Your Paper</h2>
            <p className="text-slate-400 text-sm min-h-[20px] transition-all">{LOADING_MSGS[loadingMsg]}</p>
          </div>

          {/* Dotted progress */}
          <div className="flex items-center justify-center gap-2">
            {LOADING_MSGS.map((_, i) => (
              <div key={i} className={`rounded-full transition-all duration-500 ${
                i < loadingMsg ? "w-2 h-2 bg-indigo-500" : i === loadingMsg ? "w-3 h-3 bg-indigo-400 animate-pulse" : "w-2 h-2 bg-slate-200"
              }`} />
            ))}
          </div>

          <p className="text-xs text-slate-400">Fetching paper data · {examType}</p>
        </div>
      </div>
    );
  }

  // ── 3. VIEW PAPER SCREEN ──────────────────────────────────────────────────
  if (mode === "viewing") {
    return (
      <div className="min-h-screen bg-white">
        {/* Sticky header */}
        <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-md">
          <div className="container px-4 max-w-5xl mx-auto">
            {/* Top row */}
            <div className="h-14 flex items-center gap-3">
              <button
                onClick={() => setMode("choice")}
                className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors flex-shrink-0"
              >
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="w-px h-4 bg-slate-200" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{meta?.paper_title ?? `${examType} Mock Paper`}</p>
                <p className="text-[10px] text-slate-400">{visibleQuestions.length} questions shown</p>
              </div>
              <Button
                onClick={downloadPDF}
                size="sm"
                className="flex-shrink-0 bg-indigo-600 hover:bg-indigo-500 text-white h-8 px-3 text-xs gap-1.5 border-0"
              >
                <Download className="w-3.5 h-3.5" />
                Download PDF
              </Button>
            </div>

            {/* Subject filter pills */}
            <div className="pb-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
              {subjects.map((s) => {
                const pal = subjectPalette(s);
                const isActive = subjectFilter === s;
                return (
                  <button
                    key={s}
                    onClick={() => setSubjectFilter(s)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition-all flex-shrink-0 ${
                      isActive
                        ? s === "All"
                          ? "bg-indigo-100 text-indigo-700 border-indigo-300"
                          : pal.badge
                        : "bg-slate-50 text-slate-500 border-slate-200 hover:text-slate-700"
                    }`}
                  >
                    {s !== "All" && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pal.dot}`} />}
                    {s}
                    <span className="bg-slate-200/60 rounded-full px-1.5 py-px text-[9px] leading-none">
                      {s === "All" ? questions.length : questions.filter((q) => q.subject === s).length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </header>

        {/* Questions */}
        <main className="container px-4 py-6 max-w-5xl mx-auto space-y-4">
          {visibleQuestions.map((q, i) => {
            const pal = subjectPalette(q.subject);
            const diff = DIFF_CONFIG[q.difficulty] ?? DIFF_CONFIG.Medium;
            const isExpanded = expanded.has(q.id);
            const qNo = questions.indexOf(q) + 1;

            return (
              <div
                key={q.id}
                className={`rounded-2xl border overflow-hidden transition-shadow hover:shadow-lg hover:shadow-slate-200 ${pal.light}`}
              >
                {/* Question header strip */}
                <div className={`flex items-center gap-3 px-5 py-3 bg-gradient-to-r ${pal.gradient} bg-opacity-10`}
                  style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.15) 100%)` }}>
                  <div className="w-9 h-9 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-black text-white">{qNo}</span>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap flex-1">
                    <Badge className={`text-[10px] px-2 border ${pal.badge}`}>{q.subject}</Badge>
                    <Badge className={`text-[10px] px-2 border ${diff.cls}`}>{diff.label}</Badge>
                    {q.topic && (
                      <span className="text-[10px] text-white/70 truncate hidden sm:block">{q.topic}</span>
                    )}
                  </div>
                  {q.tags?.slice(0, 2).map((tag) => (
                    <span key={tag} className="hidden md:block text-[9px] bg-white/20 border border-white/20 text-white/70 rounded-full px-2 py-0.5">{tag}</span>
                  ))}
                </div>

                {/* Question body */}
                <div className="px-5 py-4 space-y-4">
                  <p className="text-sm sm:text-[15px] font-medium text-slate-800 leading-relaxed">{q.question}</p>

                  {/* Options */}
                  <div className="grid sm:grid-cols-2 gap-2">
                    {q.options.map((opt, oi) => {
                      const isCorrect = oi === q.correct_index;
                      return (
                        <div
                          key={oi}
                          className={`flex items-start gap-3 px-4 py-3 rounded-xl border text-sm transition-all ${
                            isCorrect
                              ? "bg-green-50 border-green-300 text-green-700"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            isCorrect ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                          }`}>
                            {OPTION_LABELS[oi]}
                          </span>
                          <span className="leading-snug">{opt}</span>
                          {isCorrect && <CheckCircle2 className="w-4 h-4 text-green-600 ml-auto flex-shrink-0 mt-0.5" />}
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation toggle */}
                  <button
                    onClick={() => setExpanded((prev) => {
                      const next = new Set(prev);
                      if (next.has(q.id)) next.delete(q.id); else next.add(q.id);
                      return next;
                    })}
                    className="flex items-center gap-2 text-xs text-indigo-600 hover:text-indigo-500 transition-colors font-medium"
                  >
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    {isExpanded ? "Hide" : "Show"} Explanation
                  </button>

                  {isExpanded && (
                    <div className="flex gap-3 px-4 py-3 rounded-xl bg-blue-50 border border-blue-200">
                      <div className="w-1 rounded-full bg-blue-400 flex-shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed">{q.explanation}</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {visibleQuestions.length === 0 && (
            <div className="text-center py-20 text-slate-600">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p>No questions for selected subject.</p>
            </div>
          )}

          {/* Bottom PDF CTA */}
          <div className="sticky bottom-4 flex justify-center pt-4">
            <button
              onClick={downloadPDF}
              className="flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold shadow-xl shadow-indigo-200 backdrop-blur-sm border border-indigo-500/30 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4" />
              Download Full Paper as PDF
              <span className="bg-white/15 rounded-lg px-2 py-0.5 text-xs">{visibleQuestions.length} Qs</span>
            </button>
          </div>
        </main>
      </div>
    );
  }

  // ── 4. ATTEMPT TEST SCREEN ────────────────────────────────────────────────
  if (mode === "attempting" && currentQ) {
    const pal = subjectPalette(currentQ.subject);
    const diff = DIFF_CONFIG[currentQ.difficulty] ?? DIFF_CONFIG.Medium;
    const currentAnswer = answers[currentQ.id];
    const isFlagged = flagged.has(currentQ.id);

    return (
      <div className="min-h-screen bg-white flex flex-col">

        {/* ── Exam Header ──────────────────────────────────────────── */}
        <header className="border-b border-slate-200 bg-white/90 backdrop-blur-md sticky top-0 z-50">
          <div className="container px-4 max-w-7xl mx-auto h-16 flex items-center gap-4">
            {/* Left: Exam info */}
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button onClick={() => { if (timerRef.current) clearInterval(timerRef.current!); setMode("choice"); }} className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors flex-shrink-0">
                <ArrowLeft className="w-4 h-4" />
                Back
              </button>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-bold text-slate-900 truncate">{meta?.paper_title ?? `${examType} Mock Test`}</span>
                <span className="text-[10px] text-slate-400">{examType} Exam</span>
              </div>
              <Badge className="bg-slate-100 text-slate-600 border-slate-200 text-xs hidden sm:flex">
                Q {currentIdx + 1} / {questions.length}
              </Badge>
            </div>

            {/* Center: Timer */}
            <div className={`flex items-center gap-2.5 px-5 py-2 rounded-2xl border font-mono transition-all ${
              timerCritical
                ? "bg-red-50 border-red-300 text-red-600 animate-pulse"
                : timerWarning
                  ? "bg-amber-50 border-amber-300 text-amber-600"
                  : "bg-slate-50 border-slate-200 text-slate-900"
            }`}>
              <Clock className="w-4 h-4 flex-shrink-0" />
              <span className="text-xl font-black tabular-nums tracking-widest text-inherit">{formatTime(timeLeft)}</span>
            </div>

            {/* Right: Progress */}
            <div className="flex-1 flex items-center justify-end gap-3">
              <div className="hidden sm:flex flex-col items-end gap-1">
                <span className="text-xs text-slate-500 font-medium">{totalAnswered}/{questions.length} answered</span>
                <Progress value={(totalAnswered / questions.length) * 100} className="w-24 h-1" />
              </div>
              <button
                onClick={() => setShowSubmitConfirm(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-green-600 hover:bg-green-500 text-white text-xs font-bold transition-all border border-green-500/30 shadow-lg shadow-green-200"
              >
                <PenLine className="w-3.5 h-3.5" />
                Submit
              </button>
            </div>
          </div>
        </header>

        {/* ── Main content area ─────────────────────────────────────── */}
        <div className="flex flex-1 overflow-hidden">

          {/* ── Question Panel ──────────────────────────────────────── */}
          <main className="flex-1 overflow-y-auto bg-slate-50">
            <div className="container px-4 py-6 max-w-3xl mx-auto space-y-5">

              {/* Question card */}
              <div className={`rounded-2xl border overflow-hidden shadow-sm ${pal.light}`}>
                {/* Subject strip */}
                <div className={`px-5 py-3 bg-gradient-to-r ${pal.gradient} flex items-center gap-3`}
                  style={{ backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.2) 100%)` }}>
                  <span className="text-2xl font-black text-white/30 tabular-nums select-none">
                    {String(currentIdx + 1).padStart(2, "0")}
                  </span>
                  <div className="w-px h-6 bg-white/15" />
                  <Badge className={`text-[10px] border ${pal.badge}`}>{currentQ.subject}</Badge>
                  <Badge className={`text-[10px] border ${diff.cls}`}>{diff.label}</Badge>
                  {currentQ.topic && (
                    <span className="text-[10px] text-white/70 truncate hidden sm:block">{currentQ.topic}</span>
                  )}
                  <button
                    onClick={() => setFlagged((prev) => {
                      const next = new Set(prev);
                      if (next.has(currentQ.id)) next.delete(currentQ.id); else next.add(currentQ.id);
                      return next;
                    })}
                    className={`ml-auto flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1 rounded-lg border transition-all ${
                      isFlagged
                        ? "bg-amber-100 text-amber-700 border-amber-400"
                        : "bg-white/20 text-white/70 border-white/20 hover:text-amber-300"
                    }`}
                  >
                    <Flag className="w-3 h-3" />
                    {isFlagged ? "Flagged" : "Flag"}
                  </button>
                </div>

                {/* Question text */}
                <div className="px-6 py-5">
                  <p className="text-base sm:text-lg font-medium text-slate-800 leading-relaxed">{currentQ.question}</p>
                </div>
              </div>

              {/* Options */}
              <div className="space-y-2.5">
                {currentQ.options.map((opt, oi) => {
                  const isSelected = currentAnswer === oi;
                  return (
                    <button
                      key={oi}
                      onClick={() => setAnswers((prev) => ({ ...prev, [currentQ.id]: oi }))}
                      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl border text-left transition-all duration-150 group ${
                        isSelected
                          ? "bg-indigo-50 border-indigo-400 shadow-lg shadow-indigo-100 scale-[1.005]"
                          : "bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300"
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm flex-shrink-0 transition-all ${
                        isSelected
                          ? "bg-indigo-500 text-white shadow-lg shadow-indigo-200"
                          : "bg-slate-100 text-slate-500 group-hover:bg-slate-200 group-hover:text-slate-700"
                      }`}>
                        {OPTION_LABELS[oi]}
                      </div>
                      <span className={`text-sm sm:text-[15px] leading-relaxed transition-colors ${
                        isSelected ? "text-indigo-700 font-medium" : "text-slate-600 group-hover:text-slate-800"
                      }`}>
                        {opt}
                      </span>
                      {isSelected && <CheckCircle2 className="w-5 h-5 text-indigo-500 ml-auto flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>

              {/* Clear answer */}
              {currentAnswer !== undefined && currentAnswer !== null && (
                <button
                  onClick={() => setAnswers((prev) => { const n = { ...prev }; delete n[currentQ.id]; return n; })}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition-colors"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  Clear selection
                </button>
              )}

              {/* Navigation */}
              <div className="flex items-center justify-between pt-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentIdx((p) => Math.max(0, p - 1))}
                  disabled={currentIdx === 0}
                  className="gap-1.5 border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous
                </Button>

                {/* Mobile Q count */}
                <span className="text-xs text-slate-400 sm:hidden">{currentIdx + 1} / {questions.length}</span>

                {currentIdx < questions.length - 1 ? (
                  <Button
                    onClick={() => setCurrentIdx((p) => p + 1)}
                    className="gap-1.5 bg-indigo-600 hover:bg-indigo-500 text-white border-0"
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setShowSubmitConfirm(true)}
                    className="gap-1.5 bg-green-600 hover:bg-green-500 text-white border-0"
                  >
                    <PenLine className="w-4 h-4" />
                    Submit Test
                  </Button>
                )}
              </div>
            </div>
          </main>

          {/* ── Question Palette Sidebar ──────────────────────────── */}
          <aside className="hidden lg:flex flex-col w-72 border-l border-slate-200 bg-white overflow-y-auto">
            <div className="p-4 border-b border-slate-200">
              <h3 className="text-xs font-bold text-slate-900 mb-3">Question Palette</h3>
              {/* Legend */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-500">
                {[
                  { cls: "bg-indigo-500", label: "Answered" },
                  { cls: "bg-slate-100 border border-slate-200", label: "Not visited" },
                  { cls: "bg-amber-500", label: "Flagged" },
                  { cls: "bg-slate-300 border border-slate-300", label: "Visited" },
                ].map(({ cls, label }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-3.5 h-3.5 rounded-sm ${cls}`} />
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Number grid */}
            <div className="p-4 grid grid-cols-6 gap-1.5">
              {questions.map((q, i) => {
                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null;
                const isFlaggedQ = flagged.has(q.id);
                const isCurrent = i === currentIdx;
                const isVisited = i < currentIdx || isAnswered;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIdx(i)}
                    className={`w-full aspect-square rounded-lg text-xs font-bold transition-all relative ${
                      isCurrent
                        ? "ring-2 ring-indigo-400 ring-offset-1 ring-offset-white"
                        : ""
                    } ${
                      isFlaggedQ && isAnswered
                        ? "bg-amber-500 text-white"
                        : isFlaggedQ
                          ? "bg-amber-100 text-amber-700 border border-amber-300"
                          : isAnswered
                            ? "bg-indigo-500 text-white"
                            : isVisited
                              ? "bg-slate-200 text-slate-600 border border-slate-300"
                              : "bg-slate-100 text-slate-500 border border-slate-200"
                    }`}
                  >
                    {i + 1}
                    {isFlaggedQ && (
                      <span className="absolute top-0 right-0 w-1.5 h-1.5 rounded-full bg-amber-400 -translate-y-0.5 translate-x-0.5" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Summary */}
            <div className="p-4 mt-auto border-t border-slate-200 space-y-2">
              {[
                { label: "Answered", val: totalAnswered, color: "text-indigo-600" },
                { label: "Flagged",  val: flagged.size,  color: "text-amber-600" },
                { label: "Remaining", val: questions.length - totalAnswered, color: "text-slate-500" },
              ].map(({ label, val, color }) => (
                <div key={label} className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">{label}</span>
                  <span className={`font-bold tabular-nums ${color}`}>{val}</span>
                </div>
              ))}
            </div>
          </aside>
        </div>

        {/* ── Submit Confirmation Modal ─────────────────────────────── */}
        {showSubmitConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white border border-slate-200 shadow-2xl p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
                  <AlertTriangle className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Submit Test?</h3>
                  <p className="text-xs text-slate-400">This action cannot be undone</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center">
                {[
                  { label: "Answered", val: totalAnswered, color: "text-green-600" },
                  { label: "Skipped",  val: questions.length - totalAnswered, color: "text-red-600" },
                  { label: "Flagged",  val: flagged.size, color: "text-amber-600" },
                ].map(({ label, val, color }) => (
                  <div key={label} className="bg-slate-50 rounded-xl p-3">
                    <p className={`text-xl font-black ${color}`}>{val}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5">{label}</p>
                  </div>
                ))}
              </div>
              <p className="text-sm text-slate-600">
                {questions.length - totalAnswered > 0
                  ? `You have ${questions.length - totalAnswered} unanswered question${questions.length - totalAnswered > 1 ? "s" : ""}. Are you sure you want to submit?`
                  : "You've answered all questions. Submit now?"}
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  onClick={() => setShowSubmitConfirm(false)}
                >
                  Continue Test
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-500 border-0 text-white"
                  onClick={handleSubmit}
                >
                  <PenLine className="w-4 h-4 mr-1.5" />
                  Submit Now
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // ── 5. SUBMITTED / RESULT SCREEN ──────────────────────────────────────────
  if (mode === "submitted") {
    const result = calcResult();
    const pct = result.score;
    const circumference = 2 * Math.PI * 52;
    const strokeDash = circumference * (1 - pct / 100);

    return (
      <div className="min-h-screen bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_40%_at_50%_-10%,rgba(99,102,241,0.06),transparent)]" />

        {/* Header */}
        <header className="relative z-10 border-b border-slate-200 bg-white/80">
          <div className="container px-4 h-14 flex items-center gap-3 max-w-5xl mx-auto">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Tasks
            </button>
            <div className="ml-auto">
              <Badge className="bg-green-50 text-green-600 border-green-200 text-xs">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                Test Submitted
              </Badge>
            </div>
          </div>
        </header>

        <main className="relative z-10 container px-4 py-10 max-w-5xl mx-auto space-y-8">

          {autoSubmitted && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 text-sm">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              Time's up! Your test was automatically submitted.
            </div>
          )}

          {/* Score hero */}
          <div className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-2xl bg-slate-50 border border-slate-200 shadow-lg">

            {/* Circular score gauge */}
            <div className="relative flex-shrink-0">
              <svg width="140" height="140" viewBox="0 0 128 128" className="-rotate-90">
                <circle cx="64" cy="64" r="52" fill="none" stroke="rgba(0,0,0,0.05)" strokeWidth="10" />
                <circle cx="64" cy="64" r="52" fill="none"
                  stroke={pct >= 70 ? "#22c55e" : pct >= 40 ? "#f59e0b" : "#ef4444"}
                  strokeWidth="10" strokeLinecap="round"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDash}
                  style={{ transition: "stroke-dashoffset 1.2s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-4xl font-black tabular-nums ${pct >= 70 ? "text-green-600" : pct >= 40 ? "text-amber-600" : "text-red-600"}`}>
                  {pct}%
                </span>
                <span className="text-[10px] text-slate-400 uppercase tracking-wider">Score</span>
              </div>
            </div>

            {/* Score details */}
            <div className="flex-1 space-y-4">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-slate-900">
                  {pct >= 80 ? "Outstanding!" : pct >= 60 ? "Good Job!" : pct >= 40 ? "Keep Practising" : "Needs Improvement"}
                </h2>
                <p className="text-slate-500 text-sm mt-1">{meta?.paper_title ?? `${examType} Mock Test`}</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: "Correct",    val: result.correct,  color: "text-green-600",  bg: "bg-green-50 border-green-200" },
                  { label: "Wrong",      val: result.wrong,    color: "text-red-600",    bg: "bg-red-50 border-red-200" },
                  { label: "Skipped",    val: result.skipped,  color: "text-slate-500",  bg: "bg-slate-50 border-slate-200" },
                  { label: "Time Taken", val: formatTime(result.timeTaken), color: "text-indigo-600", bg: "bg-indigo-50 border-indigo-200" },
                ].map(({ label, val, color, bg }) => (
                  <div key={label} className={`rounded-xl border p-3 text-center ${bg}`}>
                    <p className={`text-xl font-black tabular-nums ${color}`}>{val}</p>
                    <p className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-wider">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Subject breakdown */}
          <div className="rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-200 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-500" />
              <h3 className="font-bold text-sm text-slate-900">Subject-wise Performance</h3>
            </div>
            <div className="divide-y divide-slate-100">
              {Object.entries(result.bySubject).map(([subj, stats]) => {
                const pal = subjectPalette(subj);
                const subPct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
                return (
                  <div key={subj} className="flex items-center gap-4 px-6 py-3.5">
                    <div className={`w-1.5 h-8 rounded-full ${pal.dot} flex-shrink-0`} />
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-slate-700">{subj}</span>
                        <span className={`text-sm font-bold tabular-nums ${subPct >= 70 ? "text-green-600" : subPct >= 40 ? "text-amber-600" : "text-red-600"}`}>
                          {stats.correct}/{stats.total}
                        </span>
                      </div>
                      <Progress value={subPct} className="h-1.5" />
                    </div>
                    <span className={`text-sm font-black tabular-nums w-12 text-right ${subPct >= 70 ? "text-green-600" : subPct >= 40 ? "text-amber-600" : "text-red-600"}`}>
                      {subPct}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={() => { setMode("choice"); setQuestions([]); }}
              variant="outline"
              className="flex-1 border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900 gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Back to Options
            </Button>
            <Button
              onClick={() => {
                setCurrentIdx(0);
                setShowSubmitConfirm(false);
                setMode("viewing");
              }}
              className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white border-0 gap-2"
            >
              <Eye className="w-4 h-4" />
              Review Paper & Answers
            </Button>
          </div>
        </main>
      </div>
    );
  }

  // Fallback (shouldn't reach)
  return null;
}
