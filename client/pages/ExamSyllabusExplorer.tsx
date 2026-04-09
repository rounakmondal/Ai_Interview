import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqPageSchema, itemListSchema, courseSchema } from "@/lib/seo-schemas";
import {
  ArrowLeft,
  Search,
  BookOpen,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  Clock,
  FileText,
  Users,
  Award,
  Sparkles,
  MapPin,
  Layers,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ClipboardList,
  Target,
  TrendingUp,
  BarChart3,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

interface ExamTopic {
  name: string;
  marks?: number;
  questions?: number;
  subtopics?: string[];
}

interface ExamRound {
  name: string;
  type: "written" | "physical" | "interview" | "skill" | "medical" | "document" | "online";
  duration?: string;
  totalMarks?: number;
  totalQuestions?: number;
  negativeMarking?: string;
  passingMarks?: string;
  description: string;
  topics: ExamTopic[];
}

interface CutoffCategory {
  category: string;          // e.g. "General", "OBC", "SC", "ST", "EWS"
  cutoffMarks: number;
  maxMarks?: number;
}

interface ExamCutoff {
  year: number;              // e.g. 2024, 2023
  stage: string;             // e.g. "Prelims", "Mains", "Tier 1", "Final"
  categories: CutoffCategory[];
  source?: string;           // e.g. "Official Notification"
}

interface ExamSyllabus {
  id: string;
  name: string;
  shortName: string;
  conductedBy: string;
  category: "state-govt" | "central-govt" | "bank" | "defence" | "teaching" | "railway" | "corporate";
  eligibility: string;
  ageLimit: string;
  applicationFee?: string;
  frequency: string;
  vacancies?: string;
  officialWebsite?: string;
  description: string;
  rounds: ExamRound[];
  cutoffs?: ExamCutoff[];
  tips?: string[];
  tags: string[];
}

interface ExamSyllabusApiResponse {
  success: boolean;
  query: string;
  exams: ExamSyllabus[];
}

// ── SEO ──────────────────────────────────────────────────────────────────────

function applySeo() {
  document.title = "Exam Syllabus 2026 — WBCS, SSC CGL, IBPS PO, UPSC, Railway, TET, JTET Pattern & Topics | MedhaHub";

  const desc = "Search any exam syllabus 2026 — WBCS, WB Police SI, SSC CGL, SSC CHSL, SSC MTS, IBPS PO, IBPS Clerk, SBI PO, UPSC CSE, NDA, RRB NTPC, Railway Group D, CTET, WB TET, JTET. Complete exam pattern with paper-wise topics, marks distribution, eligibility, negative marking & preparation tips. Free on MedhaHub.";

  const kw = [
    // English high-volume
    "exam syllabus 2026", "WBCS syllabus 2026", "WBCS prelims syllabus", "WBCS mains syllabus",
    "WB Police SI syllabus 2026", "WB Police constable syllabus", "SSC CGL syllabus 2026",
    "SSC CGL tier 1 syllabus", "SSC CGL tier 2 syllabus", "SSC CHSL syllabus 2026",
    "SSC MTS syllabus 2026", "IBPS PO syllabus 2026", "IBPS PO prelims syllabus",
    "IBPS PO mains syllabus", "IBPS Clerk syllabus 2026", "SBI PO syllabus 2026",
    "UPSC syllabus 2026", "UPSC CSE prelims syllabus", "UPSC mains syllabus",
    "NDA syllabus 2026", "RRB NTPC syllabus 2026", "Railway Group D syllabus",
    "CTET syllabus 2026", "CTET paper 1 syllabus", "CTET paper 2 syllabus",
    "WB TET syllabus 2026", "WB Primary TET syllabus", "JTET syllabus 2026",
    "JTET paper 1 syllabus", "Jharkhand TET syllabus",
    "govt exam syllabus", "competitive exam pattern", "exam pattern 2026",
    "exam marks distribution", "exam eligibility 2026", "exam preparation tips",
    "government job exam syllabus India", "banking exam syllabus 2026",
    // Hindi
    "परीक्षा सिलेबस 2026", "सरकारी नौकरी सिलेबस", "SSC CGL सिलेबस", "IBPS PO सिलेबस",
    "UPSC सिलेबस", "रेलवे परीक्षा सिलेबस", "JTET सिलेबस",
    // Bengali
    "পরীক্ষার সিলেবাস 2026", "সরকারি পরীক্ষার প্যাটার্ন", "WBCS সিলেবাস",
    "পুলিশ SI সিলেবাস", "SSC CGL প্যাটার্ন", "IBPS PO সিলেবাস",
  ].join(", ");

  const url = "https://medhahub.in/exam-syllabus";

  function upsert(attr: "name" | "property", key: string, content: string) {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (el) el.content = content;
    else { el = document.createElement("meta"); el.setAttribute(attr, key); el.content = content; document.head.appendChild(el); }
  }

  upsert("name", "description", desc);
  upsert("name", "keywords", kw);
  upsert("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large");
  upsert("name", "author", "MedhaHub");
  upsert("name", "language", "en-IN");

  // Open Graph
  upsert("property", "og:type", "website");
  upsert("property", "og:url", url);
  upsert("property", "og:site_name", "MedhaHub");
  upsert("property", "og:title", "Exam Syllabus 2026 — All Govt & Competitive Exams | MedhaHub");
  upsert("property", "og:description", desc);
  upsert("property", "og:locale", "en_IN");
  upsert("property", "og:locale:alternate", "bn_IN");
  upsert("property", "og:locale:alternate", "hi_IN");

  // Twitter
  upsert("name", "twitter:card", "summary_large_image");
  upsert("name", "twitter:title", "Exam Syllabus 2026 — WBCS, SSC, IBPS, UPSC, Railway Pattern | MedhaHub");
  upsert("name", "twitter:description", desc);

  // Canonical
  let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (canon) canon.href = url;
  else { canon = document.createElement("link"); canon.rel = "canonical"; canon.href = url; document.head.appendChild(canon); }

  // Hreflang
  const hreflangs = [
    { lang: "en-IN", href: url },
    { lang: "x-default", href: url },
  ];
  hreflangs.forEach(({ lang, href }) => {
    if (!document.querySelector(`link[hreflang="${lang}"]`)) {
      const link = document.createElement("link");
      link.rel = "alternate";
      link.hreflang = lang;
      link.href = href;
      document.head.appendChild(link);
    }
  });
}

// ── Popular Exams for Quick Search ───────────────────────────────────────────

const POPULAR_EXAMS = [
  { label: "WBCS", query: "WBCS" },
  { label: "WB Police SI", query: "WB Police Sub Inspector" },
  { label: "WB Police Constable", query: "WB Police Constable" },
  { label: "WBPSC Clerkship", query: "WBPSC Clerkship" },
  { label: "WB Primary TET", query: "WB Primary TET" },
  { label: "SSC CGL", query: "SSC CGL" },
  { label: "SSC CHSL", query: "SSC CHSL" },
  { label: "SSC MTS", query: "SSC MTS" },
  { label: "IBPS PO", query: "IBPS PO" },
  { label: "IBPS Clerk", query: "IBPS Clerk" },
  { label: "SBI PO", query: "SBI PO" },
  { label: "UPSC CSE", query: "UPSC Civil Services" },
  { label: "Railway Group D", query: "Railway Group D" },
  { label: "RRB NTPC", query: "RRB NTPC" },
  { label: "CTET", query: "CTET" },
  { label: "JTET", query: "JTET Jharkhand TET" },
  { label: "NDA", query: "NDA" },
];

const ROUND_TYPE_ICON: Record<string, React.ReactNode> = {
  written: <FileText className="w-4 h-4" />,
  physical: <Target className="w-4 h-4" />,
  interview: <Users className="w-4 h-4" />,
  skill: <ClipboardList className="w-4 h-4" />,
  medical: <CheckCircle2 className="w-4 h-4" />,
  document: <FileText className="w-4 h-4" />,
  online: <Layers className="w-4 h-4" />,
};

const ROUND_TYPE_COLOR: Record<string, string> = {
  written: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
  physical: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
  interview: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400",
  skill: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  medical: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400",
  document: "bg-gray-100 text-gray-700 dark:bg-gray-800/50 dark:text-gray-400",
  online: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-400",
};

const CATEGORY_LABEL: Record<string, string> = {
  "state-govt": "State Government",
  "central-govt": "Central Government",
  bank: "Banking",
  defence: "Defence",
  teaching: "Teaching",
  railway: "Railway",
  corporate: "Corporate",
};

// ── Component ────────────────────────────────────────────────────────────────

export default function ExamSyllabusExplorer() {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState<ExamSyllabus[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [expandedExam, setExpandedExam] = useState<string | null>(null);
  const [expandedRounds, setExpandedRounds] = useState<Set<string>>(new Set());

  useState(() => { applySeo(); });

  const handleSearch = async (query?: string) => {
    const q = (query ?? search).trim();
    if (!q) return;
    setSearch(q);
    setLoading(true);
    setSearched(true);
    setExpandedExam(null);
    setExpandedRounds(new Set());
    try {
      const res = await fetch(`/api/exam-syllabus?q=${encodeURIComponent(q)}`);
      if (res.ok) {
        const data: ExamSyllabusApiResponse = await res.json();
        if (data.success) {
          setResults(data.exams);
          if (data.exams.length === 1) setExpandedExam(data.exams[0].id);
          return;
        }
      }
      setResults([]);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleRound = (key: string) => {
    setExpandedRounds((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key); else next.add(key);
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/question-hub">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-primary" />
                Exam Syllabus
              </h1>
              <p className="text-xs text-muted-foreground">
                Search any exam — view complete pattern, rounds & topics
              </p>
            </div>
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Hero + Search */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary/10 via-emerald-500/10 to-amber-500/10 border border-border/40 p-6 md:p-8"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-primary" />
              <span className="text-xs font-semibold text-primary uppercase tracking-wider">
                Exam Pattern & Syllabus 2026
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold mb-2">
              Know Your Exam Inside Out
            </h2>
            <p className="text-sm text-muted-foreground max-w-2xl mb-5">
              Search any government, banking, defence, railway or teaching exam.
              View the complete exam pattern — rounds, papers, topics, marks, duration & tips.
            </p>

            {/* Search Box */}
            <div className="flex gap-2 max-w-xl">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder="Type exam name... (e.g. Sub Inspector, SSC CGL, IBPS PO, JTET)"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>
              <Button
                onClick={() => handleSearch()}
                disabled={!search.trim() || loading}
                className="px-6 rounded-xl font-semibold"
              >
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
              </Button>
            </div>

            {/* Popular Searches */}
            <div className="flex flex-wrap gap-2 mt-4">
              <span className="text-xs text-muted-foreground pt-1">Popular:</span>
              {POPULAR_EXAMS.map((e) => (
                <button
                  key={e.query}
                  onClick={() => handleSearch(e.query)}
                  className="px-3 py-1 rounded-full text-xs font-medium bg-background/80 border border-border hover:border-primary/40 hover:text-primary transition-all"
                >
                  {e.label}
                </button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
            <p className="text-sm">Searching exam syllabus...</p>
          </div>
        )}

        {/* No Results */}
        {!loading && searched && results.length === 0 && (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <AlertCircle className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium text-foreground">No exam found for "{search}"</p>
            <p className="text-sm mt-1">Try searching with keywords like "Police SI", "SSC", "Banking", "TET"</p>
          </div>
        )}

        {/* Results */}
        {!loading && results.length > 0 && (
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{results.length}</span> exam{results.length > 1 ? "s" : ""} matching "{search}"
            </p>

            {results.map((exam) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="border border-border/60 rounded-2xl bg-card overflow-hidden"
              >
                {/* Exam Header — always visible */}
                <button
                  onClick={() => setExpandedExam(expandedExam === exam.id ? null : exam.id)}
                  className="w-full text-left p-5 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        <h3 className="text-lg font-bold">{exam.name}</h3>
                      </div>
                      <p className="text-sm text-muted-foreground">{exam.description}</p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-primary/10 text-primary">
                          {CATEGORY_LABEL[exam.category] ?? exam.category}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                          {exam.rounds.length} Rounds
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                          {exam.conductedBy}
                        </span>
                      </div>
                    </div>
                    {expandedExam === exam.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-1" />
                    )}
                  </div>
                </button>

                {/* Expanded Detail */}
                <AnimatePresence>
                  {expandedExam === exam.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-6 space-y-6 border-t border-border/40 pt-5">
                        {/* Quick Info Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 p-3">
                            <Award className="w-3.5 h-3.5 mb-1 text-blue-600" />
                            <p className="font-medium text-foreground">{exam.conductedBy}</p>
                            <p className="text-muted-foreground">Conducted By</p>
                          </div>
                          <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 p-3">
                            <Users className="w-3.5 h-3.5 mb-1 text-emerald-600" />
                            <p className="font-medium text-foreground">{exam.eligibility}</p>
                            <p className="text-muted-foreground">Eligibility</p>
                          </div>
                          <div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 p-3">
                            <Clock className="w-3.5 h-3.5 mb-1 text-amber-600" />
                            <p className="font-medium text-foreground">{exam.ageLimit}</p>
                            <p className="text-muted-foreground">Age Limit</p>
                          </div>
                          <div className="rounded-lg bg-violet-50 dark:bg-violet-950/30 p-3">
                            <MapPin className="w-3.5 h-3.5 mb-1 text-violet-600" />
                            <p className="font-medium text-foreground">{exam.frequency}</p>
                            <p className="text-muted-foreground">Frequency</p>
                          </div>
                        </div>

                        {/* ── Round Flow Diagram ── */}
                        <div>
                          <h4 className="text-sm font-bold mb-4 flex items-center gap-2">
                            <Layers className="w-4 h-4 text-primary" />
                            Exam Pattern — Selection Process
                          </h4>

                          {/* Flow arrows */}
                          <div className="flex flex-wrap items-center gap-2 mb-6">
                            {exam.rounds.map((round, i) => (
                              <div key={i} className="flex items-center gap-2">
                                <span className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${ROUND_TYPE_COLOR[round.type] ?? "bg-muted text-muted-foreground"}`}>
                                  {round.name}
                                </span>
                                {i < exam.rounds.length - 1 && (
                                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                                )}
                              </div>
                            ))}
                            <span className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 ml-1">
                              ✅ Selection
                            </span>
                          </div>

                          {/* Detailed Round Cards */}
                          <div className="space-y-3">
                            {exam.rounds.map((round, i) => {
                              const roundKey = `${exam.id}-round-${i}`;
                              const isOpen = expandedRounds.has(roundKey);
                              return (
                                <div key={i} className="border border-border/50 rounded-xl overflow-hidden">
                                  <button
                                    onClick={() => toggleRound(roundKey)}
                                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-muted/30 transition-colors"
                                  >
                                    <span className={`w-8 h-8 rounded-lg flex items-center justify-center ${ROUND_TYPE_COLOR[round.type] ?? "bg-muted"}`}>
                                      {ROUND_TYPE_ICON[round.type] ?? <FileText className="w-4 h-4" />}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                      <p className="font-semibold text-sm">
                                        Round {i + 1}: {round.name}
                                      </p>
                                      <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground mt-0.5">
                                        {round.duration && <span>⏱ {round.duration}</span>}
                                        {round.totalMarks && <span>📝 {round.totalMarks} Marks</span>}
                                        {round.totalQuestions && <span>❓ {round.totalQuestions} Questions</span>}
                                        {round.negativeMarking && <span>⚠️ Negative: {round.negativeMarking}</span>}
                                      </div>
                                    </div>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${ROUND_TYPE_COLOR[round.type] ?? "bg-muted"}`}>
                                      {round.type}
                                    </span>
                                    {isOpen ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
                                  </button>

                                  <AnimatePresence>
                                    {isOpen && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="overflow-hidden"
                                      >
                                        <div className="px-4 pb-4 pt-1 space-y-3">
                                          <p className="text-sm text-muted-foreground">{round.description}</p>
                                          {round.passingMarks && (
                                            <p className="text-xs text-emerald-600 font-medium">✅ Passing/Cutoff: {round.passingMarks}</p>
                                          )}

                                          {/* Topics Table */}
                                          {round.topics.length > 0 && (
                                            <div className="rounded-lg border border-border/40 overflow-hidden">
                                              <table className="w-full text-xs">
                                                <thead>
                                                  <tr className="bg-muted/50">
                                                    <th className="text-left px-3 py-2 font-semibold">Topic / Subject</th>
                                                    {round.topics.some((t) => t.marks) && <th className="text-center px-3 py-2 font-semibold">Marks</th>}
                                                    {round.topics.some((t) => t.questions) && <th className="text-center px-3 py-2 font-semibold">Questions</th>}
                                                  </tr>
                                                </thead>
                                                <tbody>
                                                  {round.topics.map((topic, ti) => (
                                                    <tr key={ti} className="border-t border-border/30 hover:bg-muted/20">
                                                      <td className="px-3 py-2">
                                                        <span className="font-medium text-foreground">{topic.name}</span>
                                                        {topic.subtopics && topic.subtopics.length > 0 && (
                                                          <div className="flex flex-wrap gap-1 mt-1">
                                                            {topic.subtopics.map((st, si) => (
                                                              <span key={si} className="px-1.5 py-0.5 rounded bg-muted text-[10px] text-muted-foreground">
                                                                {st}
                                                              </span>
                                                            ))}
                                                          </div>
                                                        )}
                                                      </td>
                                                      {round.topics.some((t) => t.marks) && (
                                                        <td className="text-center px-3 py-2 font-medium">{topic.marks ?? "—"}</td>
                                                      )}
                                                      {round.topics.some((t) => t.questions) && (
                                                        <td className="text-center px-3 py-2 font-medium">{topic.questions ?? "—"}</td>
                                                      )}
                                                    </tr>
                                                  ))}
                                                </tbody>
                                              </table>
                                            </div>
                                          )}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Last Year Cut-off */}
                        {exam.cutoffs && exam.cutoffs.length > 0 && (
                          <div>
                            <h4 className="text-sm font-bold mb-3 flex items-center gap-2">
                              <TrendingUp className="w-4 h-4 text-primary" />
                              Previous Year Cut-off Marks
                            </h4>
                            <div className="space-y-4">
                              {exam.cutoffs.map((cutoff, ci) => (
                                <div key={ci} className="rounded-xl border border-border/50 overflow-hidden">
                                  <div className="flex items-center gap-2 px-4 py-2.5 bg-muted/40 border-b border-border/30">
                                    <BarChart3 className="w-3.5 h-3.5 text-primary" />
                                    <span className="text-xs font-semibold text-foreground">
                                      {cutoff.year} — {cutoff.stage}
                                    </span>
                                    {cutoff.source && (
                                      <span className="ml-auto text-[10px] text-muted-foreground italic">
                                        {cutoff.source}
                                      </span>
                                    )}
                                  </div>
                                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-px bg-border/30">
                                    {cutoff.categories.map((cat, ki) => (
                                      <div key={ki} className="bg-card px-3 py-2.5 text-center">
                                        <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-wide mb-1">
                                          {cat.category}
                                        </p>
                                        <p className="text-sm font-bold text-foreground">
                                          {cat.cutoffMarks}
                                          {cat.maxMarks && (
                                            <span className="text-[10px] font-normal text-muted-foreground">/{cat.maxMarks}</span>
                                          )}
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tips */}
                        {exam.tips && exam.tips.length > 0 && (
                          <div className="rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 p-4">
                            <h4 className="text-sm font-bold mb-2 flex items-center gap-2 text-amber-700 dark:text-amber-400">
                              <Sparkles className="w-4 h-4" />
                              Preparation Tips
                            </h4>
                            <ul className="space-y-1.5">
                              {exam.tips.map((tip, i) => (
                                <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1.5">
                          {exam.tags.map((tag) => (
                            <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        )}

        {/* How It Works — shown before first search */}
        {!searched && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { icon: <Search className="w-6 h-6 text-primary" />, title: "Search Your Exam", desc: "Type any exam name — WBCS, Police SI, SSC CGL, IBPS PO, JTET or any competitive exam" },
                { icon: <Layers className="w-6 h-6 text-emerald-500" />, title: "View Full Pattern", desc: "See all rounds — Paper 1, Paper 2, Physical Test, Interview — with marks and topic details" },
                { icon: <Target className="w-6 h-6 text-amber-500" />, title: "Build Your Strategy", desc: "Know the topics, marks distribution & cutoffs to create an effective preparation plan" },
              ].map((step, i) => (
                <div key={i} className="text-center p-6 rounded-xl border border-border/40 bg-card/50">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-muted/50 flex items-center justify-center mb-3">
                    {step.icon}
                  </div>
                  <h3 className="font-bold text-sm mb-1">{step.title}</h3>
                  <p className="text-xs text-muted-foreground">{step.desc}</p>
                </div>
              ))}
            </div>

            {/* SEO Content — keyword-rich for Google ranking */}
            <div className="text-xs text-muted-foreground/70 space-y-4 border-t border-border/40 pt-6">
              <h2 className="text-sm font-semibold text-foreground/80">Exam Syllabus & Pattern 2026 — Complete Guide | MedhaHub</h2>

              <div className="space-y-2">
                <h3 className="text-xs font-semibold text-foreground/70">WBCS Syllabus 2026</h3>
                <p>WBCS (West Bengal Civil Service) exam conducted by WBPSC has 3 stages — Prelims (200 MCQ, 200 marks), Mains (6 papers, 1600 marks), and Personality Test (200 marks). WBCS Prelims syllabus covers English, General Science, Current Affairs, Geography, History, Polity, Economy & Reasoning. WBCS Mains includes GS papers, Arithmetic, English Essay, Bengali/Hindi, and an Optional Subject.</p>

                <h3 className="text-xs font-semibold text-foreground/70">SSC CGL Syllabus 2026</h3>
                <p>SSC CGL (Combined Graduate Level) Tier 1 has 100 questions (200 marks, 1 hour) covering Reasoning, General Awareness, Quantitative Aptitude & English. SSC CGL Tier 2 has 690 marks across Math, Reasoning, English (descriptive), and General Studies. Negative marking: 0.50 per wrong answer in Tier 1.</p>

                <h3 className="text-xs font-semibold text-foreground/70">IBPS PO Syllabus 2026</h3>
                <p>IBPS PO Prelims has 3 sections with sectional timing (20 min each) — English, Quantitative Aptitude & Reasoning. IBPS PO Mains covers Reasoning & Computer, Data Analysis, Banking Awareness, English + Descriptive paper. Final selection = Mains + Interview.</p>

                <h3 className="text-xs font-semibold text-foreground/70">UPSC CSE Syllabus 2026</h3>
                <p>UPSC Civil Services Examination has Prelims (2 papers, 400 marks), Mains (9 papers, 1750 marks) and Interview (275 marks). Prelims Paper I covers History, Geography, Polity, Economy, Science, Environment & Current Affairs. CSAT (Paper II) is qualifying.</p>

                <h3 className="text-xs font-semibold text-foreground/70">WB Police SI & Constable Syllabus</h3>
                <p>WB Police SI exam has Preliminary Written Test (100 MCQ), PMT, PET, Final Written Test (200 marks) and Interview (15 marks). WB Police Constable has a written test (80 MCQ, 100 marks), physical test and interview. Both conducted by WBPRB.</p>

                <h3 className="text-xs font-semibold text-foreground/70">Railway Exams — RRB NTPC & Group D Syllabus</h3>
                <p>RRB NTPC CBT Stage 1 has 100 questions covering General Awareness (40), Mathematics (30) & Reasoning (30). Railway Group D has General Science, Math, Reasoning & GK sections. Both have 0.33 negative marking per wrong answer.</p>

                <h3 className="text-xs font-semibold text-foreground/70">Teaching Exams — CTET, WB TET & JTET Syllabus</h3>
                <p>CTET Paper 1 (Class 1–5) covers Child Development, Language I & II, Mathematics & EVS — 150 questions, no negative marking. WB Primary TET follows a similar pattern. JTET (Jharkhand TET) Paper I has 150 questions across Child Development, Hindi/English, Mathematics & EVS.</p>
              </div>

              <div className="space-y-2 pt-2">
                <h3 className="text-xs font-semibold text-foreground/70">All Exams Available on MedhaHub</h3>
                <p>
                  WBCS Prelims & Mains, WB Police SI, WB Police Constable, WBPSC Clerkship,
                  SSC CGL Tier 1 & 2, SSC CHSL, SSC MTS, IBPS PO Prelims & Mains, IBPS Clerk,
                  SBI PO, UPSC CSE Prelims & Mains, NDA, RRB NTPC, Railway Group D, CTET Paper 1 & 2,
                  WB Primary TET, JTET Paper 1 & 2 — complete syllabus, exam pattern, topics, marks distribution,
                  negative marking details, eligibility criteria, age limit, application fee & expert preparation tips.
                </p>
              </div>

              {/* Internal links for SEO */}
              <div className="flex flex-wrap gap-2 pt-3">
                {[
                  { label: "WBCS Mock Test", href: "/wbcs-mock-test" },
                  { label: "WB Police Mock Test", href: "/wbp-police-mock-test" },
                  { label: "SSC MTS Mock Test", href: "/ssc-mts-mock-test" },
                  { label: "IBPS PO Mock Test", href: "/ibps-po-mock-test" },
                  { label: "WB TET Mock Test", href: "/wb-tet-mock-test" },
                  { label: "JTET Mock Test", href: "/jtet-mock-test" },
                  { label: "WBPSC Clerkship Mock Test", href: "/wbpsc-clerkship-mock-test" },
                  { label: "Previous Question Set", href: "/question-hub" },
                  { label: "Company Interview Questions", href: "/interview-questions" },
                ].map((link) => (
                  <a key={link.href} href={link.href} className="text-primary/60 hover:text-primary underline">
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* JSON-LD Structured Data — multiple schemas for rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Previous Question Set", url: "/question-hub" },
              { name: "Exam Syllabus 2026", url: "/exam-syllabus" },
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: faqPageSchema([
              { question: "What is the WBCS exam syllabus 2026?", answer: "WBCS 2026 has 3 stages: Prelims (200 MCQ covering English, Science, Current Affairs, Geography, History, Polity, Economy, Reasoning — 200 marks), Mains (6 papers + optional — 1600 marks), and Personality Test (200 marks). Total selection marks: 2000." },
              { question: "What is the SSC CGL syllabus and pattern?", answer: "SSC CGL has Tier 1 (100 MCQ, 200 marks, 1 hour — Reasoning, GK, Quant, English) and Tier 2 (690 marks — Math, Reasoning, English descriptive, GS). Negative marking is 0.50 per wrong answer in Tier 1." },
              { question: "What is the IBPS PO exam pattern 2026?", answer: "IBPS PO has Prelims (100 MCQ with 20 min sectional timing — English 30, Quant 35, Reasoning 35), Mains (200 marks — Reasoning & Computer, DI, Banking Awareness, English + Descriptive), and Interview (100 marks)." },
              { question: "What is the UPSC CSE prelims syllabus?", answer: "UPSC Prelims has Paper I — General Studies (100 MCQ, 200 marks covering History, Geography, Polity, Economy, Science, Environment, Current Affairs) and Paper II — CSAT (80 questions, qualifying — 33% cutoff)." },
              { question: "What is WB Police SI exam pattern?", answer: "WB Police SI has 5 stages: Preliminary Written Test (100 MCQ), Physical Measurement Test, Physical Efficiency Test (1600m run for males), Final Written Test (200 marks), and Interview (15 marks)." },
              { question: "What is the JTET exam syllabus?", answer: "JTET (Jharkhand TET) Paper I has 150 questions covering Child Development & Pedagogy (30), Language I Hindi (30), Language II English (30), Mathematics (30), and Environmental Studies (30). No negative marking. Passing: 60% for General." },
              { question: "What is RRB NTPC syllabus 2026?", answer: "RRB NTPC has CBT Stage 1 (100 questions — GK 40, Math 30, Reasoning 30) and CBT Stage 2 (120 questions — GK 50, Math 35, Reasoning 35). Negative marking: 0.33 per wrong answer." },
              { question: "Does SSC MTS have negative marking?", answer: "Yes, SSC MTS Session 1 MCQs have 1 mark negative marking per wrong answer. Session 2 is descriptive (essay + letter in English/Hindi) with no negative marking." },
              { question: "What is CTET Paper 1 syllabus?", answer: "CTET Paper 1 (for Class 1–5 teachers) has 150 MCQ: Child Development (30), Language I (30), Language II (30), Mathematics (30), and Environmental Studies (30). No negative marking. Passing: 60% (90/150)." },
              { question: "Is MedhaHub free for exam syllabus?", answer: "Yes, MedhaHub provides free access to complete exam syllabus, pattern, topics, marks distribution, eligibility, and preparation tips for all major government and competitive exams in India." },
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: itemListSchema("Government & Competitive Exam Syllabus 2026", [
              { name: "WBCS Syllabus 2026", url: "/exam-syllabus?q=WBCS" },
              { name: "WB Police SI Syllabus", url: "/exam-syllabus?q=WB+Police+SI" },
              { name: "WB Police Constable Syllabus", url: "/exam-syllabus?q=WB+Police+Constable" },
              { name: "SSC CGL Syllabus 2026", url: "/exam-syllabus?q=SSC+CGL" },
              { name: "SSC CHSL Syllabus", url: "/exam-syllabus?q=SSC+CHSL" },
              { name: "SSC MTS Syllabus", url: "/exam-syllabus?q=SSC+MTS" },
              { name: "IBPS PO Syllabus 2026", url: "/exam-syllabus?q=IBPS+PO" },
              { name: "IBPS Clerk Syllabus", url: "/exam-syllabus?q=IBPS+Clerk" },
              { name: "SBI PO Syllabus", url: "/exam-syllabus?q=SBI+PO" },
              { name: "UPSC CSE Syllabus", url: "/exam-syllabus?q=UPSC" },
              { name: "NDA Syllabus", url: "/exam-syllabus?q=NDA" },
              { name: "RRB NTPC Syllabus", url: "/exam-syllabus?q=RRB+NTPC" },
              { name: "Railway Group D Syllabus", url: "/exam-syllabus?q=Railway+Group+D" },
              { name: "CTET Syllabus 2026", url: "/exam-syllabus?q=CTET" },
              { name: "WB Primary TET Syllabus", url: "/exam-syllabus?q=WB+TET" },
              { name: "JTET Syllabus 2026", url: "/exam-syllabus?q=JTET" },
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: courseSchema({
              name: "Exam Syllabus & Pattern Explorer — All Government & Competitive Exams 2026",
              description: "Free exam syllabus explorer covering 20+ government, banking, railway, teaching and defence exams. View complete exam pattern, paper-wise topics, marks distribution, eligibility and preparation strategy.",
              url: "/exam-syllabus",
              provider: "MedhaHub",
              language: "en",
              isFree: true,
            }),
          }}
        />
      </main>
    </div>
  );
}
