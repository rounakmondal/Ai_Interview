import { useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  TrendingUp,
  Sparkles,
  GraduationCap,
  Shield,
  BookMarked,
} from "lucide-react";
import Footer from "@/components/Footer";
import { applyExamSeoPayload } from "@/lib/exam-seo";

export interface BlogMeta {
  slug: string;
  title: string;
  description: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  featured?: boolean;
  icon?: string;
}

export const BLOG_POSTS: BlogMeta[] = [
  {
    slug: "wbcs-preparation-strategy-2026",
    title: "WBCS 2026 Preparation Strategy (Beginner to Advanced)",
    description:
      "Complete roadmap to crack WBCS 2026. From zero to interview — subject-wise plan, book list, monthly schedule, and free mock tests.",
    date: "2026-03-28",
    readTime: "12 min",
    category: "WBCS",
    tags: ["wbcs preparation", "wbcs strategy", "wbcs 2026"],
    featured: true,
    icon: "🎯",
  },
  {
    slug: "wbcs-prelims-2023-question-paper-analysis",
    title: "WBCS Prelims 2023 Question Paper with Answer & Analysis",
    description:
      "Detailed analysis of WBCS Prelims 2023 — topic-wise breakup, difficulty level, answer key, and key takeaways for 2026 aspirants.",
    date: "2026-03-27",
    readTime: "10 min",
    category: "WBCS",
    tags: ["wbcs prelims 2023", "wbcs previous year paper", "wbcs answer key"],
    featured: true,
    icon: "📊",
  },
  {
    slug: "wbpsc-clerkship-previous-year-papers",
    title: "WBPSC Clerkship Previous Year Question Papers PDF (Download)",
    description:
      "Download WBPSC Clerkship 2019–2024 question papers with solutions. Practice shift-wise papers and understand the exam pattern.",
    date: "2026-03-26",
    readTime: "8 min",
    category: "WBPSC",
    tags: ["wbpsc clerkship paper", "wbpsc previous year", "wbpsc download"],
    icon: "📥",
  },
  {
    slug: "wb-police-si-mock-test-free",
    title: "WB Police SI Mock Test Free – Practice Set with Answers",
    description:
      "Free WB Police SI mock tests with detailed answers. Practice 2018 & 2019 papers in exam-like environment with timer & scoring.",
    date: "2026-03-25",
    readTime: "7 min",
    category: "WB Police",
    tags: ["wb police si mock test", "wb police practice", "wbp si exam"],
    icon: "🛡️",
  },
  {
    slug: "wb-tet-2026-syllabus-exam-pattern",
    title: "WB TET 2026 Syllabus & Exam Pattern (Latest Update)",
    description:
      "Complete WB Primary TET 2026 syllabus, exam pattern, marking scheme, and subject-wise weightage. Updated as per latest notification.",
    date: "2026-03-24",
    readTime: "9 min",
    category: "WB TET",
    tags: ["wb tet syllabus", "wb tet 2026", "wb tet exam pattern"],
    icon: "📋",
  },
  {
    slug: "top-50-gk-questions-wbcs-prelims-2026",
    title: "Top 50 GK Questions for WBCS Prelims 2026",
    description:
      "50 most important General Knowledge questions for WBCS Prelims 2026. Covers history, geography, polity, science & current affairs.",
    date: "2026-03-23",
    readTime: "15 min",
    category: "WBCS",
    tags: ["wbcs gk questions", "wbcs prelims gk", "gk for wbcs"],
    featured: true,
    icon: "💡",
  },
  {
    slug: "wbpsc-preparation-in-bengali",
    title: "WBPSC Preparation in Bengali – Complete Guide",
    description:
      "বাংলায় WBPSC প্রস্তুতির সম্পূর্ণ গাইড। বিষয়ভিত্তিক পরিকল্পনা, বই তালিকা, এবং বিনামূল্যে মক টেস্ট অনুশীলনের টিপস।",
    date: "2026-03-22",
    readTime: "11 min",
    category: "WBPSC",
    tags: ["wbpsc bengali", "wbpsc preparation guide", "wbpsc in bangla"],
    icon: "🇮🇳",
  },
  {
    slug: "wb-police-constable-previous-year-paper",
    title:
      "WB Police Constable Previous Year Question Paper with Solution",
    description:
      "Download WB Police Constable 2013–2021 question papers with solutions. Practice papers online or download for offline preparation.",
    date: "2026-03-21",
    readTime: "8 min",
    category: "WB Police",
    tags: [
      "wb police constable paper",
      "wbp constable previous year",
      "wb police question paper",
    ],
    icon: "📄",
  },
  {
    slug: "how-to-crack-wbcs-first-attempt",
    title: "How to Crack WBCS in First Attempt (Study Plan + Tips)",
    description:
      "Proven strategies from WBCS toppers. 6-month study plan, daily routine, revision technique, and mistakes to avoid for first-attempt success.",
    date: "2026-03-20",
    readTime: "14 min",
    category: "WBCS",
    tags: ["crack wbcs first attempt", "wbcs study plan", "wbcs tips"],
    icon: "🏆",
  },
  {
    slug: "best-books-wbcs-wbpsc-wb-police-2026",
    title: "Best Books for WBCS, WBPSC & WB Police Preparation (2026)",
    description:
      "Subject-wise best books for WBCS, WBPSC Clerkship, and WB Police exams. Recommended by toppers and exam experts.",
    date: "2026-03-19",
    readTime: "10 min",
    category: "General",
    tags: ["wbcs books", "wbpsc books", "wb police books", "best books 2026"],
    icon: "📚",
  },
  {
    slug: "rrb-ntpc-previous-year-question-papers",
    title: "RRB NTPC Previous Year Question Papers PDF (2015–2026) — Free Practice",
    description:
      "Download and practice 19 RRB NTPC previous year question papers (2015–2026) — CBT 1 & CBT 2, all shifts. Includes March 2026 paper. Free timed mock tests with instant scoring.",
    date: "2026-04-05",
    readTime: "11 min",
    category: "RRB NTPC",
    tags: ["rrb ntpc previous year paper", "rrb ntpc question paper pdf", "rrb ntpc mock test free", "railway ntpc paper"],
    featured: true,
    icon: "🚂",
  },
  {
    slug: "rrb-ntpc-2026-syllabus-exam-pattern",
    title: "RRB NTPC 2026 Syllabus, Exam Pattern & Vacancy Details (Official)",
    description:
      "Complete RRB NTPC 2026 syllabus for CBT 1 and CBT 2 — topic-wise, question count, difficulty, and what changed in the March 2026 exam. 11,558 vacancies.",
    date: "2026-04-04",
    readTime: "13 min",
    category: "RRB NTPC",
    tags: ["rrb ntpc 2026 syllabus", "rrb ntpc exam pattern", "rrb ntpc cbt 1 syllabus", "railway ntpc 2026"],
    featured: true,
    icon: "📋",
  },
  {
    slug: "ibps-po-previous-year-question-papers",
    title: "IBPS PO Previous Year Question Papers PDF (2021–2025) — Free Mock Test",
    description:
      "Practice IBPS PO Prelims & Mains previous year papers (2021–2025) free online. Topic-wise breakup, cutoff analysis, and 6-week preparation plan for banking aspirants.",
    date: "2026-04-03",
    readTime: "12 min",
    category: "Banking",
    tags: ["ibps po previous year paper", "ibps po mock test free", "ibps po prelims paper", "ibps po question paper pdf"],
    featured: true,
    icon: "🏦",
  },
  {
    slug: "ssc-mts-previous-year-question-papers",
    title: "SSC MTS Previous Year Question Papers PDF (2019 & 2023 All Shifts) — Free",
    description:
      "Practice SSC MTS 2019 & September 2023 question papers (all 3 shifts) free online. New exam pattern explained, cutoff trend, and 2-month preparation strategy included.",
    date: "2026-04-02",
    readTime: "10 min",
    category: "SSC",
    tags: ["ssc mts previous year paper", "ssc mts question paper pdf", "ssc mts 2023 paper", "ssc mts mock test"],
    icon: "📝",
  },
  {
    slug: "wbpsc-clerkship-2024-question-paper-analysis",
    title: "WBPSC Clerkship 2024 Question Paper All Shifts — Analysis & Free Practice",
    description:
      "Detailed analysis of all 4 shifts of WBPSC Clerkship 2024 exam. Topic-wise breakup, difficulty comparison, West Bengal GK guide, and 3-month preparation plan.",
    date: "2026-04-01",
    readTime: "12 min",
    category: "WBPSC",
    tags: ["wbpsc clerkship 2024 question paper", "wbpsc clerkship 2024 all shifts", "wbpsc clerkship mock test", "wbpsc clerkship analysis"],
    featured: true,
    icon: "🏛️",
  },
];

const CATEGORY_STYLES: Record<
  string,
  { bg: string; text: string; border: string; gradient: string }
> = {
  WBCS: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/20",
    gradient: "from-orange-500 to-red-500",
  },
  WBPSC: {
    bg: "bg-orange-500/10",
    text: "text-orange-500",
    border: "border-orange-500/20",
    gradient: "from-violet-500 to-purple-600",
  },
  "WB Police": {
    bg: "bg-rose-500/10",
    text: "text-rose-500",
    border: "border-rose-500/20",
    gradient: "from-rose-500 to-red-600",
  },
  "WB TET": {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
    gradient: "from-amber-500 to-orange-600",
  },
  General: {
    bg: "bg-emerald-500/10",
    text: "text-emerald-500",
    border: "border-emerald-500/20",
    gradient: "from-emerald-500 to-teal-600",
  },
  "RRB NTPC": {
    bg: "bg-blue-500/10",
    text: "text-blue-500",
    border: "border-blue-500/20",
    gradient: "from-blue-500 to-indigo-600",
  },
  Banking: {
    bg: "bg-teal-500/10",
    text: "text-teal-500",
    border: "border-teal-500/20",
    gradient: "from-teal-500 to-cyan-600",
  },
  SSC: {
    bg: "bg-violet-500/10",
    text: "text-violet-500",
    border: "border-violet-500/20",
    gradient: "from-violet-500 to-purple-600",
  },
};

const getCategoryIcon = (cat: string) => {
  switch (cat) {
    case "WBCS":
      return <GraduationCap className="w-4 h-4" />;
    case "WBPSC":
      return <BookMarked className="w-4 h-4" />;
    case "WB Police":
      return <Shield className="w-4 h-4" />;
    default:
      return <BookOpen className="w-4 h-4" />;
  }
};

export default function BlogIndex() {
  const featured = BLOG_POSTS.filter((p) => p.featured);
  const rest = BLOG_POSTS.filter((p) => !p.featured);

  useEffect(() => {
    applyExamSeoPayload({
      title: "Exam Preparation Blog – WBCS, WBPSC, WB Police, TET Tips & Strategy | MedhaHub",
      description:
        "Expert articles on WBCS preparation strategy, previous year paper analysis, WB Police SI mock tests, TET syllabus & more. Updated for 2026 exams.",
      keywords:
        "WBCS preparation blog, WBPSC exam tips, WB Police SI strategy, WB TET syllabus 2026, govt exam blog, previous year paper analysis, exam preparation tips Bengal",
      canonicalPath: "/blog",
      ogTitle: "MedhaHub Blog – WB Govt Exam Preparation Tips & Strategy",
      ogDescription:
        "Read expert articles on WBCS, WBPSC, WB Police & TET exam preparation. Strategy guides, paper analysis & study tips for 2026.",
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "MedhaHub Exam Preparation Blog",
        description: "Expert articles and guides for West Bengal government exam preparation.",
        url: "https://medhahub.in/blog",
        publisher: { "@type": "Organization", name: "MedhaHub", url: "https://medhahub.in" },
      },
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* ══ HERO ══ */}
      <section className="relative py-20 sm:py-28 overflow-hidden">
        {/* Animated gradient mesh */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-[120px] animate-pulse [animation-delay:1s]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-[150px]" />
        </div>

        {/* Grid pattern overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(99,102,241,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.3) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />

        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/15 to-red-500/15 border border-orange-500/20 rounded-full text-sm font-medium text-orange-500 mb-8 backdrop-blur-sm">
              <Sparkles className="w-4 h-4" />
              Exam Preparation Blog
            </div>
            <h1 className="text-4xl sm:text-6xl font-extrabold text-foreground tracking-tight mb-5 leading-[1.1]">
              Master WB Govt Exams
              <br />
              <span className="bg-gradient-to-r from-orange-500 via-red-500 to-rose-500 bg-clip-text text-transparent">
                with Expert Guides
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Preparation strategies, previous year analysis, mock tests &
              syllabus updates for WBCS, WBPSC, WB Police & TET.
            </p>
          </motion.div>

          {/* Stats strip */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 mt-10"
          >
            {[
              { label: "Articles", value: `${BLOG_POSTS.length}+` },
              { label: "Exams Covered", value: "5" },
              { label: "Practice Papers", value: "20+" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  {stat.label}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ══ FEATURED POSTS (Hero Cards) ══ */}
      <section className="max-w-6xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <TrendingUp className="w-5 h-5 text-amber-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">
            Featured Articles
          </h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-4" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {featured.map((post, idx) => {
            const styles =
              CATEGORY_STYLES[post.category] || CATEGORY_STYLES.General;
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 + idx * 0.1 }}
              >
                <Link to={`/blog/${post.slug}`} className="block group h-full">
                  <div
                    className={`h-full rounded-2xl border ${styles.border} bg-card overflow-hidden 
                    hover:shadow-xl hover:shadow-orange-500/5 hover:-translate-y-1 transition-all duration-300`}
                  >
                    {/* Gradient top strip */}
                    <div
                      className={`h-1.5 bg-gradient-to-r ${styles.gradient}`}
                    />

                    <div className="p-6">
                      {/* Icon + Category row */}
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-3xl">{post.icon}</span>
                        <span
                          className={`text-xs px-3 py-1.5 rounded-full font-semibold ${styles.bg} ${styles.text} flex items-center gap-1.5`}
                        >
                          {getCategoryIcon(post.category)}
                          {post.category}
                        </span>
                      </div>

                      <h3 className="text-lg font-bold text-foreground mb-3 line-clamp-2 group-hover:text-orange-500 transition-colors leading-snug">
                        {post.title}
                      </h3>

                      <p className="text-sm text-muted-foreground mb-5 line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            {new Date(post.date).toLocaleDateString("en-IN", {
                              day: "numeric",
                              month: "short",
                            })}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {post.readTime}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-orange-500 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          Read
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ══ ALL POSTS ══ */}
      <section className="max-w-6xl mx-auto px-4 pb-24">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-orange-500/10 rounded-lg">
            <BookOpen className="w-5 h-5 text-orange-500" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">All Articles</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent ml-4" />
        </div>

        <div className="space-y-4">
          {rest.map((post, idx) => {
            const styles =
              CATEGORY_STYLES[post.category] || CATEGORY_STYLES.General;
            return (
              <motion.div
                key={post.slug}
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.06 }}
              >
                <Link to={`/blog/${post.slug}`} className="block group">
                  <div
                    className={`rounded-xl border border-border/50 bg-card p-5 sm:p-6 flex items-start gap-5
                    hover:border-border hover:shadow-lg hover:shadow-orange-500/5 transition-all duration-200`}
                  >
                    {/* Icon */}
                    <div
                      className={`hidden sm:flex items-center justify-center w-14 h-14 rounded-xl ${styles.bg} shrink-0 text-2xl`}
                    >
                      {post.icon}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-2">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-medium ${styles.bg} ${styles.text}`}
                        >
                          {post.category}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h3 className="font-bold text-foreground group-hover:text-orange-500 transition-colors mb-1.5 leading-snug">
                        {post.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {post.description}
                      </p>
                    </div>

                    {/* Arrow */}
                    <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-full bg-muted/50 group-hover:bg-orange-500/10 transition-colors shrink-0 self-center">
                      <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-orange-500 transition-colors" />
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      <Footer />
    </div>
  );
}
