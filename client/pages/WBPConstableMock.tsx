import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Info,
  Loader2,
  Shield,
  Sparkles,
  Timer,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ProfileButton from "@/components/ProfileButton";
import { applyExamSeoPayload } from "@/lib/exam-seo";

// ── Types ──────────────────────────────────────────────────────────────────

interface ConstablePaper {
  id: string;
  title: string;
  titleBn: string;
  year?: number;
  path: string;
  type?: "Constable" | "Lady Constable";
  questions: number;
  duration: number;
  language: string;
}

interface Manifest {
  category: string;
  categoryBn: string;
  papers: ConstablePaper[];
}

// ── SEO helpers ────────────────────────────────────────────────────────────

const BASE_KEYWORDS = [
  "WBP Constable mock test 2026",
  "WBP Constable mock test free",
  "WBP Constable mock test online",
  "West Bengal Police Constable mock test",
  "WBP Constable previous year question paper",
  "WBP Constable preliminary question paper",
  "WBP Constable 2025 mock test",
  "WBP Constable 2024 question paper",
  "WBP Constable 2021 question paper",
  "WBP Constable practice set Bengali",
  "পশ্চিমবঙ্গ পুলিশ কনস্টেবল মক টেস্ট",
  "পুলিশ কনস্টেবল প্র্যাকটিস সেট",
  "WBP Constable online practice free",
  "WB Police Constable exam preparation",
  "WBP Lady Constable previous year paper",
  "WBP Constable exam pattern 2026",
  "medhahub wbp constable",
].join(", ");

const FAQ_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Is WBP Constable mock test free on MedhaHub?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All WBP Constable mock tests on MedhaHub are completely free. No registration required to attempt the tests.",
      },
    },
    {
      "@type": "Question",
      name: "How many WBP Constable mock tests are available?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "MedhaHub offers 11 full-length WBP Constable mock tests based on the actual exam pattern — 85 questions each covering GK, Arithmetic, Reasoning and Bengali Language.",
      },
    },
    {
      "@type": "Question",
      name: "What is the WBP Constable exam pattern?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "The WBP Constable Preliminary exam has 85 MCQ questions for 85 marks: General Knowledge (40), Arithmetic (20), Reasoning (15), Bengali Language (10). Duration is 85 minutes.",
      },
    },
    {
      "@type": "Question",
      name: "Are the questions in Bengali medium?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All WBP Constable mock tests on MedhaHub are bilingual — questions and options are available in Bengali, matching the actual exam format.",
      },
    },
  ],
};

function applyDefaultSeo() {
  applyExamSeoPayload({
    title: "WBP Constable Mock Test 2026 Free Online | পুলিশ কনস্টেবল মক টেস্ট | MedhaHub",
    description:
      "Free WBP Constable mock test 2026 online. 11 full-length practice sets based on actual WBP exam pattern — 85 MCQs, instant scoring, Bengali medium. পশ্চিমবঙ্গ পুলিশ কনস্টেবল মক টেস্ট।",
    keywords: BASE_KEYWORDS,
    canonicalPath: "/wbp-constable-mock-test",
    ogTitle: "WBP Constable Mock Test 2026 Free | পুলিশ কনস্টেবল প্র্যাকটিস সেট | MedhaHub",
    ogDescription:
      "11 free WBP Constable mock tests online. 85 MCQs · Bengali medium · Instant scoring. Start your WBP Constable preparation today.",
    jsonLd: {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "WebPage",
          "@id": "https://medhahub.in/wbp-constable-mock-test",
          name: "WBP Constable Mock Test 2026 Free Online",
          description:
            "11 free full-length WBP Constable mock tests with instant scoring, timer and Bengali medium — based on actual exam pattern.",
          url: "https://medhahub.in/wbp-constable-mock-test",
          inLanguage: ["en", "bn"],
          isPartOf: { "@type": "WebSite", name: "MedhaHub", url: "https://medhahub.in" },
          breadcrumb: {
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "https://medhahub.in" },
              { "@type": "ListItem", position: 2, name: "Question Hub", item: "https://medhahub.in/question-hub" },
              { "@type": "ListItem", position: 3, name: "WBP Constable Mock Test", item: "https://medhahub.in/wbp-constable-mock-test" },
            ],
          },
        },
        FAQ_SCHEMA,
      ],
    },
  });
}

function applyPaperSeo(paper: ConstablePaper) {
  applyExamSeoPayload({
    title: `${paper.title} | Free Online Mock Test | MedhaHub`,
    description: `Practice ${paper.title} online. ${paper.questions} MCQs, ${paper.duration} minutes. Free WBP Constable mock test with instant scoring and answer key. ${paper.titleBn}।`,
    keywords: `${paper.title.toLowerCase()}${paper.year ? `, WBP Constable ${paper.year} question paper` : ""}, ${BASE_KEYWORDS}`,
    canonicalPath: "/wbp-constable-mock-test",
    ogTitle: `${paper.title} | Online Mock Test | MedhaHub`,
    ogDescription: `${paper.questions} MCQs · ${paper.duration} min · Instant scoring. Practice ${paper.title} free on MedhaHub.`,
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Quiz",
      name: paper.title,
      description: `${paper.questions} MCQs from the actual ${paper.title}. Practice online with timer and instant answer key.`,
      url: "https://medhahub.in/wbp-constable-mock-test",
      educationalAlignment: {
        "@type": "AlignmentObject",
        alignmentType: "educationalSubject",
        targetName: "West Bengal Police Constable Recruitment",
      },
      provider: { "@type": "Organization", name: "MedhaHub", url: "https://medhahub.in" },
    },
  });
}

// ── Sub-components ─────────────────────────────────────────────────────────

function PaperDropdown({
  papers,
  selected,
  onSelect,
}: {
  papers: ConstablePaper[];
  selected: ConstablePaper | null;
  onSelect: (p: ConstablePaper) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handle = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  return (
    <div ref={ref} className="relative w-full max-w-lg">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between px-4 py-3.5 rounded-xl border border-orange-700/30 bg-card/90 hover:border-orange-600/50 transition-all text-left shadow-sm"
      >
        <div className="flex items-center gap-3 min-w-0">
          <FileText className="w-4 h-4 text-orange-600 shrink-0" />
          <span className={`text-sm font-medium truncate ${selected ? "text-foreground" : "text-muted-foreground"}`}>
            {selected ? selected.title : "— Select a paper to practice —"}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-orange-600 shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4, scaleY: 0.95 }}
            animate={{ opacity: 1, y: 0, scaleY: 1 }}
            exit={{ opacity: 0, y: -4, scaleY: 0.95 }}
            transition={{ duration: 0.15 }}
            style={{ transformOrigin: "top" }}
            className="absolute z-50 mt-2 w-full bg-card border border-orange-700/20 rounded-xl shadow-2xl overflow-hidden"
          >
            {papers.map((p) => (
              <button
                key={p.id}
                onClick={() => { onSelect(p); setOpen(false); }}
                className={`w-full text-left px-4 py-3 flex items-start gap-3 hover:bg-orange-500/8 transition-colors border-b border-border/40 last:border-0 ${
                  selected?.id === p.id ? "bg-orange-500/10" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {p.type === "Lady Constable" ? (
                    <span className="text-base">👩‍✈️</span>
                  ) : (
                    <Shield className="w-4 h-4 text-orange-600" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {p.titleBn} · {p.questions} MCQs · {p.duration} min · {p.language}
                  </p>
                </div>
                {p.year && (
                <span className="ml-auto shrink-0 text-xs px-2 py-0.5 rounded-full bg-orange-700/15 text-orange-800 dark:text-orange-300 font-medium">
                  {p.year}
                </span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main page ──────────────────────────────────────────────────────────────

export default function WBPConstableMock() {
  const navigate = useNavigate();
  const [papers, setPapers] = useState<ConstablePaper[]>([]);
  const [loadingManifest, setLoadingManifest] = useState(true);
  const [selected, setSelected] = useState<ConstablePaper | null>(null);
  const [navigating, setNavigating] = useState(false);

  // Load manifest once on mount
  useEffect(() => {
    applyDefaultSeo();
    fetch("/mock_test/wbp_constable/manifest.json")
      .then((r) => r.json())
      .then((data: Manifest) => setPapers(data.papers))
      .catch(() => setPapers([]))
      .finally(() => setLoadingManifest(false));
  }, []);

  // Update SEO whenever user picks a paper
  const handleSelect = (paper: ConstablePaper) => {
    setSelected(paper);
    applyPaperSeo(paper);
  };

  const handleStartTest = () => {
    if (!selected) return;
    setNavigating(true);
    navigate("/pdf-mock-test", {
      state: {
        pdfPath: selected.path,
        pdfFileName: selected.title,
        testType: "pdf",
        folder: "police",
      },
    });
  };

  const handleDownload = () => {
    if (!selected) return;
    const href = `/${selected.path}`;
    const a = document.createElement("a");
    a.href = href;
    a.download = selected.title;
    a.click();
  };

  const EXAM_INFO = [
    { icon: <FileText className="w-5 h-5" />, label: "Total Questions", value: selected ? `${selected.questions} MCQs` : "85 MCQs" },
    { icon: <Timer className="w-5 h-5" />, label: "Duration", value: selected ? `${selected.duration} min` : "60 minutes" },
    { icon: <Shield className="w-5 h-5" />, label: "Language", value: selected ? selected.language : "Bengali" },
    { icon: <Clock className="w-5 h-5" />, label: "Sets Available", value: "12 Mock Sets" },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient glow */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] opacity-12"
          style={{ background: "radial-gradient(ellipse, rgba(194,65,12,0.2) 0%, transparent 70%)", filter: "blur(60px)" }}
        />
        <div
          className="absolute bottom-0 right-0 w-[500px] h-[300px] opacity-8"
          style={{ background: "radial-gradient(ellipse, rgba(5,46,22,0.18) 0%, transparent 70%)", filter: "blur(70px)" }}
        />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-orange-900/10 bg-background/95 backdrop-blur">
        <div className="container px-4 h-14 flex items-center gap-3">
          <Link
            to="/question-hub"
            className="flex items-center gap-1.5 text-sm text-orange-700 dark:text-orange-400 hover:text-orange-900 dark:hover:text-orange-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Question Hub
          </Link>
          <span className="text-border/60">/</span>
          <span className="text-sm font-medium text-foreground truncate">WB Police Constable</span>
          <div className="ml-auto flex items-center gap-2">
            <Link
              to="/mock-test?exam=Police"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-orange-500/30 bg-orange-500/10 text-orange-600 dark:text-orange-400 hover:bg-orange-500/20 text-xs font-medium transition-all"
            >
              <Zap className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">AI Mock Test</span>
            </Link>
            <ProfileButton />
          </div>
        </div>
      </header>

      <main className="container px-4 py-10 max-w-4xl mx-auto">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-start gap-4 mb-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-600/20 to-red-700/15 flex items-center justify-center shrink-0 border border-orange-600/20">
              <Shield className="w-7 h-7 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold text-foreground leading-tight">
                WB Police Constable<br className="sm:hidden" /> Mock Test
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                পশ্চিমবঙ্গ পুলিশ কনস্টেবল • Previous year question papers with online practice
              </p>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 flex-wrap mt-5 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-orange-500" />
              12 mock test sets
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-orange-500" />
              85 questions each
            </span>
            <span className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-orange-500" />
              Timer + instant scoring
            </span>
          </div>
        </motion.div>

        {/* Paper Selector card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-orange-700/20 bg-card/80 p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-foreground mb-1">Select Paper</h2>
          <p className="text-sm text-muted-foreground mb-5">
            Choose a year to load that paper's questions and start the mock test.
          </p>

          {loadingManifest ? (
            <div className="flex items-center gap-3 py-6 text-orange-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading papers…</span>
            </div>
          ) : (
            <PaperDropdown papers={papers} selected={selected} onSelect={handleSelect} />
          )}

          {/* Selected paper info */}
          <AnimatePresence>
            {selected && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-6 pt-5 border-t border-border/40">
                  {/* Paper detail chips */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                    {EXAM_INFO.map(({ icon, label, value }) => (
                      <div
                        key={label}
                        className="rounded-xl border border-orange-700/15 bg-orange-500/5 p-3 flex flex-col gap-1"
                      >
                        <span className="text-orange-600">{icon}</span>
                        <span className="text-[11px] text-muted-foreground uppercase tracking-wide">{label}</span>
                        <span className="text-sm font-semibold text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col sm:flex-row gap-3">
                    <Button
                      size="lg"
                      className="flex-1 gap-2 bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={handleStartTest}
                      disabled={navigating}
                    >
                      {navigating ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Loading…
                        </>
                      ) : (
                        <>
                          <BookOpen className="w-4 h-4" />
                          Start Mock Test — {selected.year}
                        </>
                      )}
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="gap-2 border-orange-700/25 hover:bg-orange-500/8"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4" />
                      Download PDF
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* All papers quick list */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
            <div className="w-1 h-6 rounded-full bg-orange-600" />
            All Constable Papers
          </h2>

          {loadingManifest ? (
            <div className="flex items-center gap-3 py-8 justify-center text-orange-600">
              <Loader2 className="w-5 h-5 animate-spin" />
              <span className="text-sm">Loading…</span>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {papers.map((paper, idx) => (
                <motion.div
                  key={paper.id}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.04 }}
                  onClick={() => handleSelect(paper)}
                  className={`cursor-pointer rounded-xl border p-4 transition-all hover:shadow-md group ${
                    selected?.id === paper.id
                      ? "border-orange-600/50 bg-orange-500/8 shadow-md"
                      : "border-orange-700/15 bg-card/80 hover:border-orange-600/30"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg shrink-0 ${
                      paper.type === "Lady Constable"
                        ? "bg-pink-500/15"
                        : "bg-orange-600/12"
                    }`}>
                      {paper.type === "Lady Constable" ? (
                        <span className="text-lg">👩‍✈️</span>
                      ) : (
                        <Shield className="w-5 h-5 text-orange-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-2 leading-snug group-hover:text-orange-700 dark:group-hover:text-orange-400 transition-colors">
                        {paper.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mt-1">{paper.titleBn}</p>
                      <div className="flex items-center gap-2 mt-2 flex-wrap">
                        {paper.year && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-amber-700/15 text-amber-800 dark:text-amber-300 font-medium">
                            {paper.year}
                          </span>
                        )}
                        <span className="text-xs text-muted-foreground">
                          {paper.questions} Qs · {paper.duration} min
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/30 flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 gap-1 text-xs bg-orange-600 hover:bg-orange-700 text-white"
                      onClick={(e) => { e.stopPropagation(); handleSelect(paper); setTimeout(handleStartTest, 50); }}
                      disabled={navigating}
                    >
                      <BookOpen className="w-3 h-3" />
                      Take Test
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="gap-1 text-xs border-orange-700/20 hover:bg-orange-500/8"
                      onClick={(e) => {
                        e.stopPropagation();
                        const a = document.createElement("a");
                        a.href = `/${paper.path}`;
                        a.download = paper.title;
                        a.click();
                      }}
                    >
                      <Download className="w-3 h-3" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Exam info section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="rounded-2xl border border-border/50 bg-card/60 p-6 mb-8"
        >
          <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <Info className="w-5 h-5 text-orange-600" />
            WBP Constable Exam Pattern
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Total Questions</span>
                <span className="font-semibold text-foreground">100 MCQs</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Total Marks</span>
                <span className="font-semibold text-foreground">100</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border/40">
                <span className="text-muted-foreground">Duration</span>
                <span className="font-semibold text-foreground">60 minutes</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Negative Marking</span>
                <span className="font-semibold text-foreground">0.25 per wrong</span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-muted-foreground text-xs font-medium uppercase tracking-wide mb-2">Subjects</p>
              {[
                "General Knowledge & Current Affairs",
                "Arithmetic & Numerical Ability",
                "English / Bengali Language",
                "Reasoning & Mental Ability",
              ].map((sub) => (
                <div key={sub} className="flex items-center gap-2 py-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-foreground text-sm">{sub}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* AI Mock Test CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl border border-orange-500/25 bg-gradient-to-r from-orange-500/6 via-amber-500/5 to-yellow-500/4 p-6 text-center"
        >
          <h3 className="text-xl font-bold text-foreground mb-2">Try AI-Powered Mock Test</h3>
          <p className="text-sm text-muted-foreground mb-5 max-w-md mx-auto">
            Get an AI-generated question paper with subject-wise analysis, instant scoring and performance tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/mock-test?exam=Police">
              <Button size="lg" className="gap-2 bg-orange-600 hover:bg-orange-700 text-white">
                <Sparkles className="w-5 h-5" />
                Start AI Mock Test
              </Button>
            </Link>
            <Link to="/question-hub?tab=police">
              <Button size="lg" variant="outline" className="gap-2 border-orange-600/30 hover:bg-orange-500/8">
                <X className="w-4 h-4" />
                View SI Papers Too
              </Button>
            </Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
