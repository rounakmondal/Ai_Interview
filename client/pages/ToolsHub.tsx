import { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProfileButton from "@/components/ProfileButton";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema, faqPageSchema, itemListSchema } from "@/lib/seo-schemas";
import {
  ArrowLeft,
  Calculator,
  Calendar,
  IndianRupee,
  GraduationCap,
  Keyboard,
  ArrowRight,
  Sparkles,
  BookOpen,
  FileText,
  Camera,
  BarChart3,
  Trophy,
  Newspaper,
  Bell,
  Brain,
  Timer,
} from "lucide-react";

// ── SEO ──────────────────────────────────────────────────────────────────────

function applySeo() {
  document.title = "Free Online Tools for Students 2026 — CGPA Calculator, Age Calculator, Salary Calculator & More | MedhaHub";

  const desc = "Free online tools for students and government job aspirants. CGPA to percentage calculator, age calculator for govt jobs, 7th pay commission salary calculator, exam eligibility checker, typing speed test & more. Used by 10 lakh+ students every month.";

  const kw = [
    "free online tools for students", "student calculator tools",
    "cgpa to percentage calculator", "age calculator for government jobs",
    "salary calculator 7th pay commission", "exam eligibility checker",
    "typing speed test online", "government exam tools",
    "ssc tools", "wbcs tools", "student tools online free",
    "gpa calculator india", "govt job tools", "sarkari exam tools",
    "free calculator for students", "online tools for competitive exams",
    "medhahub tools", "study tools free",
  ].join(", ");

  const url = "https://medhahub.in/tools";

  function upsert(attr: "name" | "property", key: string, content: string) {
    let el = document.querySelector(`meta[${attr}="${key}"]`) as HTMLMetaElement | null;
    if (el) el.content = content;
    else { el = document.createElement("meta"); el.setAttribute(attr, key); el.content = content; document.head.appendChild(el); }
  }

  upsert("name", "description", desc);
  upsert("name", "keywords", kw);
  upsert("name", "robots", "index, follow, max-snippet:-1, max-image-preview:large");
  upsert("property", "og:type", "website");
  upsert("property", "og:url", url);
  upsert("property", "og:site_name", "MedhaHub");
  upsert("property", "og:title", "Free Student Tools — CGPA, Age, Salary Calculator & More | MedhaHub");
  upsert("property", "og:description", desc);
  upsert("property", "og:image", "https://medhahub.in/og-tools.png");
  upsert("name", "twitter:card", "summary_large_image");
  upsert("name", "twitter:title", "Free Student Tools 2026 | MedhaHub");
  upsert("name", "twitter:description", desc);

  let canon = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (canon) canon.href = url;
  else { canon = document.createElement("link"); canon.rel = "canonical"; canon.href = url; document.head.appendChild(canon); }
}

// ── Tool Data ────────────────────────────────────────────────────────────────

interface ToolCard {
  title: string;
  description: string;
  longDescription: string;
  href: string;
  icon: typeof Calculator;
  gradient: string;
  shadow: string;
  searches: string;
  tags: string[];
  featured?: boolean;
}

const PRIMARY_TOOLS: ToolCard[] = [
  {
    title: "CGPA to Percentage Calculator",
    description: "Convert CGPA ↔ Percentage ↔ SGPA for any university",
    longDescription: "Supports CBSE (×9.5), VTU, Anna University, JNTU, Mumbai University formulas. Also includes an SGPA calculator with grade-point entry for all subjects.",
    href: "/cgpa-calculator",
    icon: Calculator,
    gradient: "from-blue-500 to-indigo-600",
    shadow: "shadow-blue-500/20",
    searches: "500K+/month",
    tags: ["CGPA", "Percentage", "SGPA", "GPA"],
    featured: true,
  },
  {
    title: "Typing Speed Test",
    description: "Practice for SSC CHSL, NTPC & Railway typing exams",
    longDescription: "5 exam-level passages covering SSC, Railway, Banking & General English. Real-time WPM, accuracy & error tracking. Includes 35 WPM SSC benchmark line. Choose 1, 2, 5 or 10-minute tests.",
    href: "/typing-test",
    icon: Keyboard,
    gradient: "from-violet-500 to-purple-600",
    shadow: "shadow-violet-500/20",
    searches: "300K+/month",
    tags: ["WPM", "SSC CHSL", "NTPC", "Typing"],
    featured: true,
  },
  {
    title: "Age Calculator for Govt Jobs",
    description: "Check \"Am I eligible?\" — DOB to age on exam cut-off date",
    longDescription: "Enter date of birth → see your exact age on any exam date. Auto-checks age limits for 16+ major exams (WBCS, SSC, IBPS, Railway…) with OBC/SC/ST/PwD relaxation built in.",
    href: "/age-calculator",
    icon: Calendar,
    gradient: "from-emerald-500 to-teal-600",
    shadow: "shadow-emerald-500/20",
    searches: "200K+/month",
    tags: ["Age Limit", "Eligibility", "DOB", "Relaxation"],
    featured: true,
  },
  {
    title: "Salary Calculator (7th Pay Commission)",
    description: "In-hand salary for SSC, WBCS, IBPS, Railway & more",
    longDescription: "Select any government post → get full salary breakdown: Basic Pay, DA, HRA (by city class), Transport Allowance, NPS deduction. Covers 25+ posts across Central, WB State & Banking sectors.",
    href: "/salary-calculator",
    icon: IndianRupee,
    gradient: "from-green-500 to-emerald-600",
    shadow: "shadow-green-500/20",
    searches: "150K+/month",
    tags: ["7th CPC", "DA", "HRA", "Net Salary"],
  },
  {
    title: "Exam Eligibility Checker",
    description: "Enter age + qualification → see which exams you qualify for",
    longDescription: "Checks your eligibility against 18+ government exams simultaneously. Factors in age limits, educational qualification, and reservation category. Shows eligible, borderline, and ineligible exams with reasons.",
    href: "/eligibility-checker",
    icon: GraduationCap,
    gradient: "from-orange-500 to-amber-600",
    shadow: "shadow-orange-500/20",
    searches: "100K+/month",
    tags: ["Eligibility", "Qualification", "Category"],
  },
];

const MORE_TOOLS: { title: string; href: string; icon: typeof Calculator; description: string }[] = [
  { title: "AI Study Assistant", href: "/chatbot", icon: Brain, description: "Ask exam questions, upload photos — get solutions in English & Bengali" },
  { title: "Photo Solver", href: "/photo-solver", icon: Camera, description: "Snap a photo of any question — get step-by-step answer" },
  { title: "Study With Me (Pomodoro)", href: "/study-with-me", icon: Timer, description: "Focus timer with ambient sounds for productive study sessions" },
  { title: "Exam Syllabus Explorer", href: "/exam-syllabus", icon: FileText, description: "Complete syllabus for WBCS, SSC, Banking & all major exams" },
  { title: "Exam Calendar 2026", href: "/exam-calendar", icon: Calendar, description: "Upcoming exam dates, application deadlines & admit cards" },
  { title: "Current Affairs Daily", href: "/current-affairs", icon: Newspaper, description: "Daily current affairs digest for competitive exams" },
  { title: "Daily Quiz", href: "/daily-quiz", icon: BookOpen, description: "10 fresh MCQs every day — GK, Math, Reasoning, English" },
  { title: "Vacancy Alerts", href: "/vacancies", icon: Bell, description: "Latest government job vacancies & recruitment notifications" },
  { title: "Leaderboard", href: "/leaderboard", icon: Trophy, description: "Compare your score with lakhs of students across India" },
  { title: "Skill Matrix", href: "/skill-matrix", icon: BarChart3, description: "Track your preparation strength across all subjects" },
];

// ── Component ────────────────────────────────────────────────────────────────

export default function ToolsHub() {
  useEffect(() => { applySeo(); }, []);

  const faqs = [
    { question: "Are these tools completely free?", answer: "Yes! All tools on MedhaHub are 100% free with no login required. You can use the CGPA calculator, age calculator, salary calculator, eligibility checker, and typing test without creating an account." },
    { question: "How accurate is the salary calculator?", answer: "Our salary calculator uses the latest 7th Pay Commission pay matrix and current DA rates (~53% for central, ~42% for WB state). The actual in-hand salary may vary slightly based on individual deductions and allowances." },
    { question: "Which CGPA formula should I use?", answer: "Use CBSE formula (×9.5) for CBSE board results. For university grades, check your university's specific multiplier. Most engineering colleges use ×10. VTU uses ×10, Anna University uses ×10, and JNTU uses ×8.8." },
    { question: "Is the typing test similar to the actual SSC exam?", answer: "Yes, our typing test simulates real SSC CHSL/NTPC typing test conditions. The passages are exam-level, the WPM calculation follows the standard formula, and we show the 35 WPM benchmark that SSC requires." },
    { question: "How is age calculated for government exams?", answer: "Age is calculated as on the cut-off date specified by the exam conducting body. Our tool automatically uses the latest cut-off dates and applies category-wise relaxation (OBC: +3 years, SC/ST: +5 years, PwD: +10 years)." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-violet-50 dark:from-background dark:to-background">
      {/* JSON-LD */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: breadcrumbSchema([
          { name: "Home", url: "/" },
          { name: "Free Tools", url: "/tools" },
        ])
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{
        __html: itemListSchema("Free Student Tools", PRIMARY_TOOLS.map(t => ({ name: t.title, url: t.href })))
      }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqPageSchema(faqs) }} />

      <div className="container mx-auto px-4 py-6 max-w-6xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Link to="/">
              <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
            </Link>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold">
                Free Tools for{" "}
                <span className="bg-gradient-to-r from-violet-600 to-blue-600 bg-clip-text text-transparent">Students</span>
              </h1>
              <p className="text-muted-foreground text-sm">Calculators, checkers & practice tools — used by 10L+ students</p>
            </div>
          </div>
          <ProfileButton />
        </div>

        {/* Featured Tools (Big Cards) */}
        <div className="space-y-4 mb-10">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-violet-500" />
            Most Popular Tools
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PRIMARY_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06 }}
              >
                <Link to={tool.href} className="block group h-full">
                  <div className={`relative h-full rounded-2xl border bg-white dark:bg-card p-5 transition-all duration-300 hover:shadow-xl ${tool.shadow} hover:-translate-y-1`}>
                    {/* Search badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                        🔍 {tool.searches}
                      </span>
                    </div>

                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-lg ${tool.shadow} mb-4`}>
                      <tool.icon className="w-6 h-6" />
                    </div>

                    {/* Content */}
                    <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors pr-14">
                      {tool.title}
                    </h3>
                    <p className="text-muted-foreground text-xs leading-relaxed mb-2">
                      {tool.description}
                    </p>
                    <p className="text-muted-foreground/70 text-[11px] leading-relaxed mb-3">
                      {tool.longDescription}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {tool.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-primary/5 text-primary/70">
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* CTA */}
                    <div className="flex items-center gap-1.5 text-sm font-semibold text-primary group-hover:gap-2.5 transition-all">
                      Open Tool <ArrowRight className="w-4 h-4" />
                    </div>

                    {tool.featured && (
                      <div className="absolute -top-2 -left-2 bg-gradient-to-r from-amber-400 to-orange-500 text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-sm">
                        ⭐ POPULAR
                      </div>
                    )}
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* More Tools (Grid) */}
        <div className="space-y-4 mb-10">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-orange-500" />
            More Study Tools
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {MORE_TOOLS.map((tool, i) => (
              <motion.div
                key={tool.href}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.04 }}
              >
                <Link to={tool.href} className="block group">
                  <div className="h-full rounded-xl border bg-white dark:bg-card p-3.5 text-center transition-all hover:shadow-md hover:-translate-y-0.5 hover:border-primary/30">
                    <div className="w-9 h-9 mx-auto rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-2.5">
                      <tool.icon className="w-4 h-4" />
                    </div>
                    <p className="font-semibold text-xs mb-0.5">{tool.title}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight">{tool.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-3 mb-10">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-violet-500" />
            Frequently Asked Questions
          </h2>
          {faqs.map((faq, i) => (
            <details key={i} className="bg-white dark:bg-card border rounded-xl p-4 group">
              <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center">
                {faq.question}
                <span className="text-muted-foreground group-open:rotate-180 transition-transform text-xs">▼</span>
              </summary>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{faq.answer}</p>
            </details>
          ))}
        </div>

        {/* SEO Content Block */}
        <div className="bg-white dark:bg-card border rounded-2xl p-6 space-y-4 text-sm text-muted-foreground mb-6">
          <h2 className="font-bold text-foreground text-base">Free Online Tools for Students & Government Job Aspirants</h2>
          <p>
            MedhaHub provides India's most comprehensive collection of free tools designed specifically for competitive exam aspirants.
            Whether you're preparing for <strong>WBCS, SSC CGL, SSC CHSL, IBPS PO, Railway NTPC</strong>, or any other government examination,
            our calculators and practice tools help you make informed decisions about your career.
          </p>
          <p>
            The <strong>CGPA to Percentage Calculator</strong> is used by over 5 lakh students every month to convert their university grades
            for job applications and higher education. Our <strong>Age Calculator</strong> helps you instantly check if you meet the age
            eligibility for any government exam, with OBC/SC/ST/PwD relaxation rules built in.
          </p>
          <p>
            Planning your career? The <strong>7th Pay Commission Salary Calculator</strong> shows you the exact in-hand salary for
            25+ government posts. The <strong>Exam Eligibility Checker</strong> tells you which exams you can apply for based on
            your age, qualification, and category. And our <strong>Typing Speed Test</strong> lets you practice for SSC CHSL and Railway
            typing tests with real exam-level passages.
          </p>
          <p>
            All tools are <strong>100% free, require no login</strong>, and work instantly on mobile and desktop. Join 10 lakh+
            students who use MedhaHub's tools every month to prepare smarter.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
