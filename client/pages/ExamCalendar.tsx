import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqPageSchema, itemListSchema } from "@/lib/seo-schemas";
import {
  ArrowLeft,
  Calendar,
  Clock,
  FileText,
  Bell,
  Search,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  BookOpen,
  AlertCircle,
  CheckCircle2,
  Timer,
  CalendarDays,
  GraduationCap,
  Shield,
  Landmark,
  TrainFront,
  BadgeIndianRupee,
} from "lucide-react";

// ── Types ────────────────────────────────────────────────────────────────────

type ExamCategory = "state-govt" | "central-govt" | "banking" | "railway" | "teaching" | "defence";
type EventStatus = "completed" | "ongoing" | "upcoming" | "tentative";

interface ExamEvent {
  label: string;
  date: string;        // Human-readable e.g. "15 Mar 2026", "Jun 2026"
  sortDate: string;    // ISO e.g. "2026-03-15" for sorting
  status: EventStatus;
}

interface ExamEntry {
  id: string;
  name: string;
  shortName: string;
  conductedBy: string;
  category: ExamCategory;
  officialWebsite?: string;
  events: ExamEvent[];
  vacancies?: string;
  frequency: string;
}

// ── SEO ──────────────────────────────────────────────────────────────────────

function applySeo() {
  document.title = "Exam Calendar 2026 — WBCS, SSC CGL, IBPS PO, UPSC, Railway, WB Police, TET Exam Dates | MedhaHub";

  const desc = "Complete exam calendar 2026 with exam dates, application deadlines, admit card dates & result dates for WBCS, WB Police SI, SSC CGL, SSC CHSL, SSC MTS, IBPS PO, IBPS Clerk, SBI PO, UPSC CSE, NDA, RRB NTPC, Railway Group D, CTET, WB TET, JTET & more. Never miss an exam date.";

  const kw = [
    "exam calendar 2026", "exam date 2026", "government exam calendar 2026",
    "WBCS exam date 2026", "WBCS notification 2026", "WBCS application date",
    "WB Police SI exam date 2026", "WB Police recruitment 2026",
    "SSC CGL exam date 2026", "SSC CGL notification 2026",
    "SSC CHSL exam date 2026", "SSC MTS exam date 2026",
    "IBPS PO exam date 2026", "IBPS PO notification 2026",
    "IBPS Clerk exam date 2026", "SBI PO exam date 2026",
    "UPSC CSE exam date 2026", "UPSC notification 2026",
    "NDA exam date 2026", "RRB NTPC exam date 2026",
    "Railway Group D exam date 2026", "CTET exam date 2026",
    "WB TET exam date 2026", "JTET exam date 2026",
    "WBPSC Clerkship exam date 2026",
    "upcoming government exams 2026", "exam schedule 2026 India",
    "sarkari exam calendar", "competitive exam dates 2026",
    "exam admit card date 2026", "exam result date 2026",
    "application deadline 2026", "exam notification 2026",
  ].join(", ");

  const url = "https://medhahub.in/exam-calendar";

  function upsert(attr: "name" | "property", key: string, content: string) {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (el) el.content = content;
    else { el = document.createElement("meta"); el.setAttribute(attr, key); el.content = content; document.head.appendChild(el); }
  }

  upsert("name", "description", desc);
  upsert("name", "keywords", kw);
  upsert("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large");
  upsert("name", "author", "MedhaHub");

  upsert("property", "og:type", "website");
  upsert("property", "og:url", url);
  upsert("property", "og:site_name", "MedhaHub");
  upsert("property", "og:title", "Exam Calendar 2026 — All Govt & Competitive Exam Dates | MedhaHub");
  upsert("property", "og:description", desc);
  upsert("property", "og:locale", "en_IN");

  upsert("name", "twitter:card", "summary_large_image");
  upsert("name", "twitter:title", "Exam Calendar 2026 — WBCS, SSC, IBPS, UPSC, Railway Dates | MedhaHub");
  upsert("name", "twitter:description", desc);

  let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (canon) canon.href = url;
  else { canon = document.createElement("link"); canon.rel = "canonical"; canon.href = url; document.head.appendChild(canon); }
}

// ── Fallback Data (used when API is unavailable) ─────────────────────────────

const FALLBACK_EXAMS: ExamEntry[] = [
  {
    id: "wbcs",
    name: "West Bengal Civil Service (WBCS)",
    shortName: "WBCS",
    conductedBy: "WBPSC",
    category: "state-govt",
    officialWebsite: "https://wbpsc.gov.in",
    frequency: "Yearly",
    vacancies: "~800",
    events: [
      { label: "Notification", date: "Dec 2025", sortDate: "2025-12-01", status: "completed" },
      { label: "Application Deadline", date: "Jan 2026", sortDate: "2026-01-31", status: "completed" },
      { label: "Admit Card", date: "Feb 2026", sortDate: "2026-02-15", status: "completed" },
      { label: "Prelims Exam", date: "9 Mar 2026", sortDate: "2026-03-09", status: "completed" },
      { label: "Prelims Result", date: "May 2026 (Expected)", sortDate: "2026-05-15", status: "upcoming" },
      { label: "Mains Exam", date: "Aug 2026 (Expected)", sortDate: "2026-08-01", status: "tentative" },
      { label: "Final Result", date: "Dec 2026 (Expected)", sortDate: "2026-12-01", status: "tentative" },
    ],
  },
  {
    id: "wb-police-si",
    name: "WB Police Sub-Inspector (SI)",
    shortName: "WBP SI",
    conductedBy: "WBPRB",
    category: "state-govt",
    officialWebsite: "https://wbpolice.gov.in",
    frequency: "Irregular",
    vacancies: "~1,100",
    events: [
      { label: "Notification", date: "Mar 2026 (Expected)", sortDate: "2026-03-01", status: "tentative" },
      { label: "Application Start", date: "Apr 2026 (Expected)", sortDate: "2026-04-01", status: "tentative" },
      { label: "Prelims Exam", date: "Jul 2026 (Expected)", sortDate: "2026-07-01", status: "tentative" },
      { label: "Final Written Test", date: "Oct 2026 (Expected)", sortDate: "2026-10-01", status: "tentative" },
    ],
  },
  {
    id: "wb-police-constable",
    name: "WB Police Constable",
    shortName: "WBP Constable",
    conductedBy: "WBPRB",
    category: "state-govt",
    officialWebsite: "https://wbpolice.gov.in",
    frequency: "Irregular",
    vacancies: "~8,000+",
    events: [
      { label: "Notification", date: "2026 (Expected)", sortDate: "2026-06-01", status: "tentative" },
      { label: "Written Exam", date: "2026 (Expected)", sortDate: "2026-09-01", status: "tentative" },
    ],
  },
  {
    id: "wbpsc-clerkship",
    name: "WBPSC Clerkship",
    shortName: "Clerkship",
    conductedBy: "WBPSC",
    category: "state-govt",
    officialWebsite: "https://wbpsc.gov.in",
    frequency: "Yearly",
    vacancies: "~1,300",
    events: [
      { label: "Notification", date: "Apr 2026 (Expected)", sortDate: "2026-04-15", status: "tentative" },
      { label: "Application Deadline", date: "May 2026 (Expected)", sortDate: "2026-05-31", status: "tentative" },
      { label: "Exam Date", date: "Aug 2026 (Expected)", sortDate: "2026-08-15", status: "tentative" },
    ],
  },
  {
    id: "ssc-cgl",
    name: "SSC CGL (Combined Graduate Level)",
    shortName: "SSC CGL",
    conductedBy: "SSC",
    category: "central-govt",
    officialWebsite: "https://ssc.gov.in",
    frequency: "Yearly",
    vacancies: "~17,000+",
    events: [
      { label: "Notification", date: "Jun 2026 (Expected)", sortDate: "2026-06-01", status: "tentative" },
      { label: "Application Deadline", date: "Jul 2026 (Expected)", sortDate: "2026-07-15", status: "tentative" },
      { label: "Tier 1 Exam", date: "Sep–Oct 2026 (Expected)", sortDate: "2026-09-15", status: "tentative" },
      { label: "Tier 2 Exam", date: "Jan 2027 (Expected)", sortDate: "2027-01-15", status: "tentative" },
    ],
  },
  {
    id: "ssc-chsl",
    name: "SSC CHSL (Combined Higher Secondary Level)",
    shortName: "SSC CHSL",
    conductedBy: "SSC",
    category: "central-govt",
    officialWebsite: "https://ssc.gov.in",
    frequency: "Yearly",
    vacancies: "~4,500",
    events: [
      { label: "Notification", date: "Aug 2026 (Expected)", sortDate: "2026-08-01", status: "tentative" },
      { label: "Tier 1 Exam", date: "Nov 2026 (Expected)", sortDate: "2026-11-01", status: "tentative" },
    ],
  },
  {
    id: "ssc-mts",
    name: "SSC MTS (Multi Tasking Staff)",
    shortName: "SSC MTS",
    conductedBy: "SSC",
    category: "central-govt",
    officialWebsite: "https://ssc.gov.in",
    frequency: "Yearly",
    vacancies: "~10,000+",
    events: [
      { label: "Notification", date: "Jan 2026", sortDate: "2026-01-15", status: "completed" },
      { label: "Application Deadline", date: "Feb 2026", sortDate: "2026-02-28", status: "completed" },
      { label: "Session 1 Exam", date: "Apr–May 2026", sortDate: "2026-04-15", status: "upcoming" },
      { label: "Session 2 Exam", date: "Jul 2026 (Expected)", sortDate: "2026-07-01", status: "tentative" },
    ],
  },
  {
    id: "ibps-po",
    name: "IBPS PO (Probationary Officer)",
    shortName: "IBPS PO",
    conductedBy: "IBPS",
    category: "banking",
    officialWebsite: "https://ibps.in",
    frequency: "Yearly",
    vacancies: "~4,500",
    events: [
      { label: "Notification", date: "Aug 2026 (Expected)", sortDate: "2026-08-01", status: "tentative" },
      { label: "Application Deadline", date: "Sep 2026 (Expected)", sortDate: "2026-09-15", status: "tentative" },
      { label: "Prelims Exam", date: "Oct 2026 (Expected)", sortDate: "2026-10-15", status: "tentative" },
      { label: "Mains Exam", date: "Nov 2026 (Expected)", sortDate: "2026-11-20", status: "tentative" },
      { label: "Interview", date: "Jan 2027 (Expected)", sortDate: "2027-01-15", status: "tentative" },
    ],
  },
  {
    id: "ibps-clerk",
    name: "IBPS Clerk",
    shortName: "IBPS Clerk",
    conductedBy: "IBPS",
    category: "banking",
    officialWebsite: "https://ibps.in",
    frequency: "Yearly",
    vacancies: "~6,000",
    events: [
      { label: "Notification", date: "Jul 2026 (Expected)", sortDate: "2026-07-01", status: "tentative" },
      { label: "Prelims Exam", date: "Aug 2026 (Expected)", sortDate: "2026-08-20", status: "tentative" },
      { label: "Mains Exam", date: "Oct 2026 (Expected)", sortDate: "2026-10-01", status: "tentative" },
    ],
  },
  {
    id: "sbi-po",
    name: "SBI PO (Probationary Officer)",
    shortName: "SBI PO",
    conductedBy: "SBI",
    category: "banking",
    officialWebsite: "https://sbi.co.in",
    frequency: "Yearly",
    vacancies: "~2,000",
    events: [
      { label: "Notification", date: "Sep 2026 (Expected)", sortDate: "2026-09-01", status: "tentative" },
      { label: "Prelims Exam", date: "Nov 2026 (Expected)", sortDate: "2026-11-01", status: "tentative" },
      { label: "Mains Exam", date: "Jan 2027 (Expected)", sortDate: "2027-01-10", status: "tentative" },
    ],
  },
  {
    id: "upsc-cse",
    name: "UPSC Civil Services Examination",
    shortName: "UPSC CSE",
    conductedBy: "UPSC",
    category: "central-govt",
    officialWebsite: "https://upsc.gov.in",
    frequency: "Yearly",
    vacancies: "~1,000",
    events: [
      { label: "Notification", date: "14 Feb 2026", sortDate: "2026-02-14", status: "completed" },
      { label: "Application Deadline", date: "7 Mar 2026", sortDate: "2026-03-07", status: "completed" },
      { label: "Prelims Exam", date: "24 May 2026", sortDate: "2026-05-24", status: "upcoming" },
      { label: "Mains Exam", date: "Sep 2026 (Expected)", sortDate: "2026-09-15", status: "tentative" },
      { label: "Interview", date: "Mar 2027 (Expected)", sortDate: "2027-03-01", status: "tentative" },
    ],
  },
  {
    id: "nda",
    name: "NDA (National Defence Academy)",
    shortName: "NDA",
    conductedBy: "UPSC",
    category: "defence",
    officialWebsite: "https://upsc.gov.in",
    frequency: "Twice a year",
    events: [
      { label: "NDA I Notification", date: "Jan 2026", sortDate: "2026-01-01", status: "completed" },
      { label: "NDA I Exam", date: "13 Apr 2026", sortDate: "2026-04-13", status: "upcoming" },
      { label: "NDA II Notification", date: "Jun 2026 (Expected)", sortDate: "2026-06-01", status: "tentative" },
      { label: "NDA II Exam", date: "14 Sep 2026 (Expected)", sortDate: "2026-09-14", status: "tentative" },
    ],
  },
  {
    id: "rrb-ntpc",
    name: "RRB NTPC (Non-Technical Popular Categories)",
    shortName: "RRB NTPC",
    conductedBy: "RRB",
    category: "railway",
    officialWebsite: "https://indianrailways.gov.in",
    frequency: "Irregular",
    vacancies: "~10,000+",
    events: [
      { label: "Notification", date: "2026 (Expected)", sortDate: "2026-06-01", status: "tentative" },
      { label: "CBT Stage 1", date: "2026 (Expected)", sortDate: "2026-10-01", status: "tentative" },
    ],
  },
  {
    id: "railway-group-d",
    name: "Railway Group D",
    shortName: "Group D",
    conductedBy: "RRB",
    category: "railway",
    officialWebsite: "https://indianrailways.gov.in",
    frequency: "Irregular",
    vacancies: "~33,000+",
    events: [
      { label: "Notification", date: "2026 (Expected)", sortDate: "2026-05-01", status: "tentative" },
      { label: "CBT Exam", date: "2026 (Expected)", sortDate: "2026-09-01", status: "tentative" },
    ],
  },
  {
    id: "ctet",
    name: "CTET (Central Teacher Eligibility Test)",
    shortName: "CTET",
    conductedBy: "CBSE",
    category: "teaching",
    officialWebsite: "https://ctet.nic.in",
    frequency: "Twice a year",
    events: [
      { label: "CTET Jul 2026 Notification", date: "Mar 2026 (Expected)", sortDate: "2026-03-15", status: "tentative" },
      { label: "CTET Jul 2026 Exam", date: "Jul 2026 (Expected)", sortDate: "2026-07-15", status: "tentative" },
      { label: "CTET Dec 2026 Notification", date: "Sep 2026 (Expected)", sortDate: "2026-09-01", status: "tentative" },
      { label: "CTET Dec 2026 Exam", date: "Dec 2026 (Expected)", sortDate: "2026-12-15", status: "tentative" },
    ],
  },
  {
    id: "wb-tet",
    name: "WB Primary TET",
    shortName: "WB TET",
    conductedBy: "WBBPE",
    category: "teaching",
    officialWebsite: "https://wbbpe.org",
    frequency: "Yearly",
    events: [
      { label: "Notification", date: "2026 (Expected)", sortDate: "2026-05-01", status: "tentative" },
      { label: "Exam Date", date: "2026 (Expected)", sortDate: "2026-08-01", status: "tentative" },
    ],
  },
  {
    id: "jtet",
    name: "JTET (Jharkhand Teacher Eligibility Test)",
    shortName: "JTET",
    conductedBy: "JAC",
    category: "teaching",
    officialWebsite: "https://jac.jharkhand.gov.in",
    frequency: "Irregular",
    events: [
      { label: "Notification", date: "2026 (Expected)", sortDate: "2026-04-01", status: "tentative" },
      { label: "Exam Date", date: "2026 (Expected)", sortDate: "2026-07-01", status: "tentative" },
    ],
  },
];

// ── Helpers ──────────────────────────────────────────────────────────────────

const CATEGORY_INFO: Record<ExamCategory, { label: string; icon: React.ReactNode; color: string }> = {
  "state-govt": { label: "State Government", icon: <Landmark className="w-4 h-4" />, color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
  "central-govt": { label: "Central Government", icon: <Shield className="w-4 h-4" />, color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" },
  banking: { label: "Banking", icon: <BadgeIndianRupee className="w-4 h-4" />, color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
  railway: { label: "Railway", icon: <TrainFront className="w-4 h-4" />, color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400" },
  teaching: { label: "Teaching", icon: <GraduationCap className="w-4 h-4" />, color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  defence: { label: "Defence", icon: <Shield className="w-4 h-4" />, color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" },
};

const STATUS_STYLE: Record<EventStatus, { dot: string; text: string; label: string }> = {
  completed: { dot: "bg-gray-400", text: "text-muted-foreground line-through", label: "Done" },
  ongoing: { dot: "bg-green-500 animate-pulse", text: "text-green-700 dark:text-green-400 font-semibold", label: "Ongoing" },
  upcoming: { dot: "bg-blue-500", text: "text-blue-700 dark:text-blue-400 font-medium", label: "Upcoming" },
  tentative: { dot: "bg-amber-400", text: "text-amber-700 dark:text-amber-400", label: "Expected" },
};

// ── Component ────────────────────────────────────────────────────────────────

export default function ExamCalendar() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<ExamCategory | "all">("all");
  const [expandedExams, setExpandedExams] = useState<Set<string>>(new Set());
  const [exams, setExams] = useState<ExamEntry[]>(FALLBACK_EXAMS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    applySeo();
    (async () => {
      try {
        const res = await fetch("/api/exam-calendar");
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.exams) && data.exams.length > 0) {
            setExams(data.exams);
          }
        }
      } catch {
        // silently use fallback data
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = exams.filter((exam) => {
    if (category !== "all" && exam.category !== category) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      return exam.name.toLowerCase().includes(q) || exam.shortName.toLowerCase().includes(q) || exam.conductedBy.toLowerCase().includes(q);
    }
    return true;
  });

  const toggleExam = (id: string) => {
    setExpandedExams((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  // Find next upcoming event across all exams
  const today = new Date().toISOString().slice(0, 10);
  const nextEvent = exams.flatMap((e) => e.events.map((ev) => ({ ...ev, examName: e.shortName })))
    .filter((ev) => ev.sortDate >= today && ev.status !== "completed")
    .sort((a, b) => a.sortDate.localeCompare(b.sortDate))[0];

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div>
              <h1 className="text-lg font-bold flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-primary" />
                Exam Calendar 2026
              </h1>
              <p className="text-xs text-muted-foreground">
                All government & competitive exam dates in one place
              </p>
            </div>
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Next Upcoming Alert */}
        {nextEvent && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 border border-blue-200/50 dark:border-blue-800/30 px-4 py-3"
          >
            <Bell className="w-5 h-5 text-blue-600 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                Next Up: {nextEvent.examName} — {nextEvent.label}
              </p>
              <p className="text-xs text-blue-600/80 dark:text-blue-400/70">{nextEvent.date}</p>
            </div>
            <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300">
              {nextEvent.status === "upcoming" ? "Confirmed" : "Expected"}
            </span>
          </motion.div>
        )}

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search exam... (WBCS, SSC CGL, IBPS PO)"
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory("all")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${category === "all" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
            >
              All
            </button>
            {(Object.keys(CATEGORY_INFO) as ExamCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${category === cat ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
              >
                {CATEGORY_INFO[cat].icon}
                {CATEGORY_INFO[cat].label}
              </button>
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="rounded-xl bg-card border border-border/40 p-3 text-center">
            <p className="text-2xl font-bold text-foreground">{exams.length}</p>
            <p className="text-[11px] text-muted-foreground">Total Exams</p>
          </div>
          <div className="rounded-xl bg-card border border-border/40 p-3 text-center">
            <p className="text-2xl font-bold text-blue-600">{exams.flatMap((e) => e.events).filter((ev) => ev.status === "upcoming").length}</p>
            <p className="text-[11px] text-muted-foreground">Upcoming Events</p>
          </div>
          <div className="rounded-xl bg-card border border-border/40 p-3 text-center">
            <p className="text-2xl font-bold text-green-600">{exams.flatMap((e) => e.events).filter((ev) => ev.status === "completed").length}</p>
            <p className="text-[11px] text-muted-foreground">Completed</p>
          </div>
          <div className="rounded-xl bg-card border border-border/40 p-3 text-center">
            <p className="text-2xl font-bold text-amber-600">{exams.reduce((sum, e) => sum + (parseInt(e.vacancies?.replace(/[^\d]/g, "") || "0") || 0), 0).toLocaleString()}+</p>
            <p className="text-[11px] text-muted-foreground">Total Vacancies</p>
          </div>
        </div>

        {/* Exam Cards */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-muted-foreground">
            <AlertCircle className="w-10 h-10 mb-3 opacity-30" />
            <p className="font-medium text-foreground">No exams found for "{search}"</p>
            <p className="text-sm mt-1">Try "WBCS", "Police", "SSC", "Banking"</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((exam) => {
              const isExpanded = expandedExams.has(exam.id);
              const catInfo = CATEGORY_INFO[exam.category];
              const nextEvt = exam.events.find((ev) => ev.status === "upcoming" || ev.status === "ongoing");
              const nextTentative = !nextEvt ? exam.events.find((ev) => ev.status === "tentative") : null;
              const highlight = nextEvt || nextTentative;

              return (
                <motion.div
                  key={exam.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="border border-border/60 rounded-xl bg-card overflow-hidden"
                >
                  {/* Header */}
                  <button
                    onClick={() => toggleExam(exam.id)}
                    className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <h3 className="text-base font-bold">{exam.shortName}</h3>
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${catInfo.color}`}>
                            {catInfo.label}
                          </span>
                          {exam.vacancies && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                              {exam.vacancies} vacancies
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{exam.name} • {exam.conductedBy}</p>
                        {highlight && (
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`w-2 h-2 rounded-full ${STATUS_STYLE[highlight.status].dot}`} />
                            <span className={`text-xs ${STATUS_STYLE[highlight.status].text}`}>
                              {highlight.label}: {highlight.date}
                            </span>
                          </div>
                        )}
                      </div>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-muted-foreground mt-1" /> : <ChevronDown className="w-4 h-4 text-muted-foreground mt-1" />}
                    </div>
                  </button>

                  {/* Timeline */}
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.25 }}
                      className="border-t border-border/40"
                    >
                      <div className="px-4 pb-4 pt-3 space-y-4">
                        {/* Event Timeline */}
                        <div className="relative pl-6">
                          {/* Vertical line */}
                          <div className="absolute left-[9px] top-1 bottom-1 w-px bg-border" />

                          <div className="space-y-3">
                            {exam.events.map((ev, i) => {
                              const style = STATUS_STYLE[ev.status];
                              return (
                                <div key={i} className="relative flex items-start gap-3">
                                  {/* Dot */}
                                  <div className={`absolute -left-6 top-1.5 w-[10px] h-[10px] rounded-full border-2 border-background ${style.dot}`} />
                                  <div className="flex-1">
                                    <p className={`text-sm ${style.text}`}>{ev.label}</p>
                                    <p className="text-xs text-muted-foreground">{ev.date}</p>
                                  </div>
                                  <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                                    ev.status === "completed" ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                                    : ev.status === "ongoing" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                    : ev.status === "upcoming" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                  }`}>
                                    {style.label}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* Quick Links */}
                        <div className="flex flex-wrap gap-2 pt-2 border-t border-border/30">
                          <Link to={`/exam-syllabus?q=${encodeURIComponent(exam.shortName)}`}>
                            <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
                              <BookOpen className="w-3.5 h-3.5" />
                              View Syllabus
                            </Button>
                          </Link>
                          {exam.officialWebsite && (
                            <a href={exam.officialWebsite} target="_blank" rel="noopener noreferrer">
                              <Button variant="outline" size="sm" className="text-xs gap-1.5 h-8">
                                <ExternalLink className="w-3.5 h-3.5" />
                                Official Website
                              </Button>
                            </a>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground pt-2">
          <span className="font-medium">Status:</span>
          {(["completed", "ongoing", "upcoming", "tentative"] as EventStatus[]).map((s) => (
            <span key={s} className="flex items-center gap-1.5">
              <span className={`w-2 h-2 rounded-full ${STATUS_STYLE[s].dot}`} />
              {STATUS_STYLE[s].label}
            </span>
          ))}
        </div>

        {/* SEO Content Footer */}
        <div className="text-xs text-muted-foreground/70 space-y-3 border-t border-border/40 pt-6">
          <h2 className="text-sm font-semibold text-foreground/80">Exam Calendar 2026 — All Dates & Schedule | MedhaHub</h2>
          <p>
            Complete exam calendar for 2026 covering all major government, banking, railway, teaching and defence examinations in India.
            Track notification dates, application deadlines, admit card release dates, exam dates and result dates for WBCS, WB Police SI,
            WB Police Constable, WBPSC Clerkship, SSC CGL, SSC CHSL, SSC MTS, IBPS PO, IBPS Clerk, SBI PO, UPSC Civil Services,
            NDA, RRB NTPC, Railway Group D, CTET, WB Primary TET, and JTET. Bookmark this page to never miss an important exam date.
          </p>
          <p>
            All dates marked as "Expected" are based on previous year patterns and official announcements. Confirmed dates are updated
            as soon as official notifications are released. Visit the official websites for the most accurate information.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {[
              { label: "Exam Syllabus Explorer", href: "/exam-syllabus" },
              { label: "Previous Question Set", href: "/question-hub" },
              { label: "WBCS Mock Test", href: "/wbcs-mock-test" },
              { label: "WB Police Mock Test", href: "/wbp-police-mock-test" },
              { label: "SSC MTS Mock Test", href: "/ssc-mts-mock-test" },
              { label: "IBPS PO Mock Test", href: "/ibps-po-mock-test" },
              { label: "Company Interview Questions", href: "/interview-questions" },
            ].map((link) => (
              <a key={link.href} href={link.href} className="text-primary/60 hover:text-primary underline">
                {link.label}
              </a>
            ))}
          </div>
        </div>

        {/* JSON-LD */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Exam Calendar 2026", url: "/exam-calendar" },
            ]),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: itemListSchema("Government & Competitive Exam Calendar 2026", exams.map((e) => ({
              name: `${e.shortName} Exam Date 2026`,
              url: `/exam-calendar#${e.id}`,
            }))),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: faqPageSchema([
              { question: "When is the WBCS Prelims 2026 exam date?", answer: "WBCS Prelims 2026 was held on 9th March 2026. The Mains exam is expected in August 2026." },
              { question: "When is SSC CGL 2026 notification expected?", answer: "SSC CGL 2026 notification is expected in June 2026, with Tier 1 exam likely in September-October 2026." },
              { question: "What is the IBPS PO 2026 exam date?", answer: "IBPS PO 2026 Prelims is expected in October 2026. Notification is likely in August 2026." },
              { question: "When is UPSC CSE 2026 Prelims?", answer: "UPSC CSE Prelims 2026 is scheduled for 24th May 2026." },
              { question: "When is the next CTET exam in 2026?", answer: "CTET July 2026 exam is expected in July 2026, with notification around March 2026. CTET December 2026 is expected in December." },
              { question: "Is the exam calendar on MedhaHub free?", answer: "Yes, MedhaHub provides a completely free exam calendar with dates for all major government, banking, railway, teaching and defence exams in India." },
            ]),
          }}
        />
      </main>
    </div>
  );
}
