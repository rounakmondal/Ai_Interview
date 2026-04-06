import { useState, useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema } from "@/lib/seo-schemas";
import { applyCompanySeo, companyDetailSchemas } from "@/lib/company-seo";
import {
  ArrowLeft,
  Search,
  Building2,
  Users,
  MapPin,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Filter,
  Loader2,
  CheckCircle2,
  BookOpen,
  Star,
  Tag,
  Sparkles,
  Clock,
  GraduationCap,
} from "lucide-react";
import {
  getCompanyBySlug,
  fetchCompanyQuestions,
  type CompanyInfo,
  type CompanyQuestion,
  type CompanyQuestionsResponse,
} from "@/lib/company-interview-data";
import NotFound from "./NotFound";

const DIFFICULTY_COLOR: Record<string, string> = {
  Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
  Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
  Hard: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
};

type DifficultyFilter = "All" | "Easy" | "Medium" | "Hard";

export default function CompanyInterviewQuestions() {
  const { slug } = useParams<{ slug: string }>();
  const company = slug ? getCompanyBySlug(slug) : undefined;

  const [data, setData] = useState<CompanyQuestionsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [difficulty, setDifficulty] = useState<DifficultyFilter>("All");
  const [expandedIds, setExpandedIds] = useState<Set<number>>(new Set());

  // SEO
  useEffect(() => {
    if (company) applyCompanySeo(company);
  }, [company]);

  // Fetch questions (always returns data — falls back to static questions if API is down)
  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetchCompanyQuestions(slug)
      .then((res) => setData(res))
      .finally(() => setLoading(false));
  }, [slug]);

  const categories = useMemo(() => {
    if (!data) return ["All"];
    return ["All", ...data.categories];
  }, [data]);

  const filtered = useMemo(() => {
    if (!data) return [];
    let list = data.questions;
    if (selectedCategory !== "All") list = list.filter((q) => q.category === selectedCategory);
    if (difficulty !== "All") list = list.filter((q) => q.difficulty === difficulty);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter(
        (q) =>
          q.question.toLowerCase().includes(s) ||
          q.answer.toLowerCase().includes(s) ||
          q.tags.some((t) => t.toLowerCase().includes(s))
      );
    }
    return list;
  }, [data, selectedCategory, difficulty, search]);

  const toggleExpand = (id: number) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const expandAll = () => {
    if (!data) return;
    if (expandedIds.size === filtered.length) {
      setExpandedIds(new Set());
    } else {
      setExpandedIds(new Set(filtered.map((q) => q.id)));
    }
  };

  if (!company) return <NotFound />;

  return (
    <div className="min-h-screen bg-background">
      {/* Ambient */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-30 backdrop-blur-xl bg-background/80 border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link to="/interview-questions">
              <Button variant="ghost" size="icon" className="rounded-full">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${company.color} flex items-center justify-center text-base text-white`}>
                {company.logo}
              </div>
              <div>
                <h1 className="text-sm font-bold">{company.shortName} Interview Questions</h1>
                <p className="text-[11px] text-muted-foreground">{company.name}</p>
              </div>
            </div>
          </div>
          <ProfileButton />
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-6">
        {/* Company Info Card */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`relative overflow-hidden rounded-2xl border border-border/40 p-6`}
        >
          <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${company.color}`} />

          <div className="flex flex-col md:flex-row md:items-start gap-5">
            <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${company.color} flex items-center justify-center text-3xl text-white shadow-md flex-shrink-0`}>
              {company.logo}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-1">{company.shortName} Interview Preparation</h2>
              <p className="text-sm text-muted-foreground mb-3">{company.description}</p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className={`rounded-lg ${company.bgAccent} p-2.5`}>
                  <MapPin className={`w-3.5 h-3.5 mb-1 ${company.accent}`} />
                  <p className="font-medium">{company.headquarters}</p>
                  <p className="text-muted-foreground">Headquarters</p>
                </div>
                <div className={`rounded-lg ${company.bgAccent} p-2.5`}>
                  <Users className={`w-3.5 h-3.5 mb-1 ${company.accent}`} />
                  <p className="font-medium">{company.employees}</p>
                  <p className="text-muted-foreground">Employees</p>
                </div>
                <div className={`rounded-lg ${company.bgAccent} p-2.5`}>
                  <Briefcase className={`w-3.5 h-3.5 mb-1 ${company.accent}`} />
                  <p className="font-medium">{company.avgPackage}</p>
                  <p className="text-muted-foreground">Avg Package</p>
                </div>
                <div className={`rounded-lg ${company.bgAccent} p-2.5`}>
                  <Clock className={`w-3.5 h-3.5 mb-1 ${company.accent}`} />
                  <p className="font-medium">Est. {company.founded}</p>
                  <p className="text-muted-foreground">Founded</p>
                </div>
              </div>

              {/* Interview Rounds */}
              <div className="mt-4">
                <p className="text-xs font-semibold mb-2 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-primary" />
                  Interview Process
                </p>
                <div className="flex flex-wrap items-center gap-1.5">
                  {company.interviewRounds.map((round, i) => (
                    <span key={round} className="flex items-center gap-1">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-medium ${company.bgAccent} ${company.accent}`}>
                        {i + 1}. {round}
                      </span>
                      {i < company.interviewRounds.length - 1 && (
                        <span className="text-muted-foreground text-[10px]">→</span>
                      )}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-primary" />
            <p className="text-sm">Loading {company.shortName} questions...</p>
          </div>
        )}

        {/* Questions Section */}
        {!loading && data && (
          <>
            {/* Stats strip */}
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="flex items-center gap-1.5 font-semibold">
                <BookOpen className="w-4 h-4 text-primary" />
                {data.totalQuestions} Questions
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground">
                <Tag className="w-3.5 h-3.5" />
                {data.categories.length} Categories
              </span>
            </div>

            {/* Search + Filters */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search questions or answers..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </div>
              <div className="flex gap-2">
                {(["All", "Easy", "Medium", "Hard"] as DifficultyFilter[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDifficulty(d)}
                    className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                      difficulty === d
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:border-primary/40"
                    }`}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium border whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? `${company.bgAccent} ${company.accent} border-current`
                      : "bg-background border-border text-muted-foreground hover:border-primary/40"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Expand all button */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> questions
              </p>
              <Button
                variant="outline"
                size="sm"
                onClick={expandAll}
                className="text-xs"
              >
                {expandedIds.size === filtered.length ? "Collapse All" : "Expand All"}
              </Button>
            </div>

            {/* Questions list */}
            <div className="space-y-3">
              {filtered.map((q, i) => (
                <QuestionItem
                  key={q.id}
                  question={q}
                  index={i}
                  expanded={expandedIds.has(q.id)}
                  onToggle={() => toggleExpand(q.id)}
                  accentColor={company.accent}
                  bgAccent={company.bgAccent}
                />
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-medium">No questions match your filters</p>
              </div>
            )}
          </>
        )}

        {/* SEO: JSON-LD Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: breadcrumbSchema([
              { name: "Home", url: "/" },
              { name: "Company Interview Questions", url: "/interview-questions" },
              { name: `${company.shortName} Interview Questions`, url: `/interview-questions/${company.slug}` },
            ]),
          }}
        />

        {/* SEO: WebPage + Organization + FAQPage (ALL questions) + Course */}
        {companyDetailSchemas(company, data?.questions).map((schema, i) => (
          <script
            key={i}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: schema }}
          />
        ))}

        {/* SEO: keyword-rich footer for crawlers + related company links */}
        <footer className="mt-12 border-t border-border/40 pt-8 pb-6">
          <div className="text-xs text-muted-foreground/70 space-y-3">
            <h2 className="text-sm font-semibold text-foreground/80">
              {company.shortName} Interview Questions & Answers 2026
            </h2>
            <p className="company-description">
              Prepare for your {company.name} interview with our comprehensive collection of
              interview questions and expert answers. This guide covers all {company.interviewRounds.length} rounds
              of the {company.shortName} interview process: {company.interviewRounds.join(", ")}.
              {data ? ` Practice ${data.totalQuestions} questions across ${data.categories.length} categories` : ""}
              {" "}— updated for 2026 placements and hiring.
            </p>
            <p>
              Average package at {company.shortName}: {company.avgPackage}.
              {company.shortName} has {company.employees} employees worldwide, headquartered in {company.headquarters}.
              Founded in {company.founded}.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-foreground/60 font-medium">Also prepare for:</span>
              {["tcs", "infosys", "wipro", "google", "amazon", "microsoft", "flipkart", "zoho", "accenture", "deloitte"]
                .filter((s) => s !== company.slug)
                .slice(0, 8)
                .map((s) => (
                  <Link
                    key={s}
                    to={`/interview-questions/${s}`}
                    className="hover:text-primary transition-colors underline-offset-2 hover:underline capitalize"
                  >
                    {s.replace(/-/g, " ")}
                  </Link>
                ))}
              <Link to="/interview-questions" className="hover:text-primary font-medium">
                View all 200+ companies →
              </Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

// ── Question Accordion Item ──────────────────────────────────────────────────
function QuestionItem({
  question,
  index,
  expanded,
  onToggle,
  accentColor,
  bgAccent,
}: {
  question: CompanyQuestion;
  index: number;
  expanded: boolean;
  onToggle: () => void;
  accentColor: string;
  bgAccent: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02, duration: 0.25 }}
      className="border border-border/60 rounded-xl overflow-hidden bg-card hover:border-primary/20 transition-colors"
    >
      <button
        onClick={onToggle}
        className="w-full flex items-start gap-3 p-4 text-left"
      >
        <span className={`flex-shrink-0 w-7 h-7 rounded-lg ${bgAccent} ${accentColor} flex items-center justify-center text-xs font-bold mt-0.5`}>
          {index + 1}
        </span>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-sm leading-relaxed pr-2">{question.question}</p>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${DIFFICULTY_COLOR[question.difficulty]}`}>
              {question.difficulty}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
              {question.category}
            </span>
          </div>
        </div>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
        )}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-0 ml-10">
              <div className="rounded-lg bg-muted/50 p-4 text-sm leading-relaxed whitespace-pre-line border-l-3 border-primary/30">
                <div className="flex items-center gap-1.5 mb-2 text-xs font-semibold text-primary">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Answer
                </div>
                {question.answer}
              </div>
              {question.tags.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {question.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2 py-0.5 rounded-full text-[10px] bg-muted text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
