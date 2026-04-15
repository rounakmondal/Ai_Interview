import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Clock,
  BarChart3,
  Brain,
  Trophy,
  Shield,
  History,
  ChevronRight,
  CheckCircle2,
  Star,
  Users,
  Sparkles,
} from "lucide-react";
import PremiumNavbar from "@/components/premium/PremiumNavbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { applyExamSeoPayload } from "@/lib/exam-seo";
import { getExamConfig, type ExamLandingConfig } from "@/lib/exam-landing-data";
import NotFound from "./NotFound";

/* ---------- Icon Resolver ---------- */
const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  FileText,
  Clock,
  BarChart3,
  Brain,
  Trophy,
  Shield,
  History,
  BookOpen,
  Star,
  Users,
  Sparkles,
};

function getIcon(name: string) {
  return ICON_MAP[name] ?? FileText;
}

/* ---------- Animations ---------- */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ---------- Priority Badge ---------- */
function PriorityBadge({ priority }: { priority: "high" | "medium" | "low" }) {
  const colors = {
    high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
    medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    low: "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[priority]}`}>
      {priority === "high" ? "🔴 High" : priority === "medium" ? "🟡 Medium" : "🟢 Low"}
    </span>
  );
}

/* ================================================================
   MAIN COMPONENT
   ================================================================ */
export default function ExamLandingPage() {
  const { examSlug } = useParams<{ examSlug: string }>();
  const config = examSlug ? getExamConfig(examSlug) : undefined;

  useEffect(() => {
    if (!config) return;
    applyExamSeoPayload({
      title: config.seo.title,
      description: config.seo.description,
      keywords: config.seo.keywords,
      canonicalPath: `/exam/${config.slug}`,
      ogTitle: config.seo.title,
      ogDescription: config.seo.description,
      jsonLd: {
        "@context": "https://schema.org",
        "@type": "WebPage",
        name: `${config.name} Preparation — MedhaHub`,
        description: config.seo.description,
        url: `https://medhahub.in/exam/${config.slug}`,
        isPartOf: { "@type": "WebSite", name: "MedhaHub", url: "https://medhahub.in" },
        publisher: { "@type": "Organization", name: "MedhaHub", url: "https://medhahub.in" },
      },
    });
    window.scrollTo(0, 0);
  }, [config]);

  if (!config) return <NotFound />;

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      <PremiumNavbar />

      {/* ——— HERO ——— */}
      <HeroSection config={config} />

      {/* ——— STATS BAR ——— */}
      <StatsBar config={config} />

      {/* ——— FEATURES ——— */}
      <FeaturesSection config={config} />

      {/* ——— EXAM PATTERN ——— */}
      <ExamPatternSection config={config} />

      {/* ——— SUBJECT WEIGHTAGE ——— */}
      <SubjectWeightageSection config={config} />

      {/* ——— BLOG / RESOURCES ——— */}
      {config.blogLinks.length > 0 && <ResourcesSection config={config} />}

      {/* ——— FAQ ——— */}
      <FAQSection config={config} />

      {/* ——— CTA ——— */}
      <CTASection config={config} />

      <Footer />
    </main>
  );
}

/* ================================================================
   SECTIONS
   ================================================================ */

function HeroSection({ config }: { config: ExamLandingConfig }) {
  return (
    <section className="relative pt-28 pb-20 sm:pt-36 sm:pb-28 overflow-hidden">
      {/* Background gradient blob */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-[0.07] dark:opacity-[0.15]`}
        aria-hidden
      />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl pointer-events-none" />

      <div className="relative container mx-auto px-4 text-center max-w-4xl">
        <motion.div initial="hidden" animate="visible" variants={stagger}>
          <motion.div variants={fadeUp} custom={0}>
            <Badge className="mb-6 text-sm px-4 py-1.5 bg-primary/10 text-primary border-primary/20 hover:bg-primary/15">
              Free Mock Test 2026
            </Badge>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            custom={1}
            className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight"
          >
            <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
              {config.name}
            </span>{" "}
            Exam Preparation
          </motion.h1>

          <motion.p
            variants={fadeUp}
            custom={2}
            className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            {config.heroDescription}
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className={`bg-gradient-to-r ${config.gradient} text-white shadow-lg hover:shadow-xl transition-shadow text-base px-8`}>
              <Link to={config.mockTestLink}>
                Start Free Mock Test <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            {config.syllabusLink && (
              <Button asChild variant="outline" size="lg" className="text-base px-8">
                <Link to={config.syllabusLink}>
                  View Syllabus <BookOpen className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function StatsBar({ config }: { config: ExamLandingConfig }) {
  return (
    <section className="border-y bg-card/50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {config.stats.map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
            >
              <div className={`text-3xl sm:text-4xl font-extrabold bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>
                {stat.value}
              </div>
              <div className="mt-1 text-sm text-muted-foreground font-medium">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FeaturesSection({ config }: { config: ExamLandingConfig }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">
            Why Prepare {config.name} on{" "}
            <span className={`bg-gradient-to-r ${config.gradient} bg-clip-text text-transparent`}>MedhaHub</span>?
          </h2>
          <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
            Everything you need to crack {config.fullName} — all in one place, completely free.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {config.features.map((feature, i) => {
            const Icon = getIcon(feature.icon);
            return (
              <motion.div
                key={feature.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group relative rounded-2xl border bg-card p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${config.gradient} flex items-center justify-center mb-4 shadow-md`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

function ExamPatternSection({ config }: { config: ExamLandingConfig }) {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">{config.name} Exam Pattern</h2>
          <p className="mt-4 text-muted-foreground">Know the exam structure before you start preparing</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl border overflow-hidden bg-card shadow-sm"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`bg-gradient-to-r ${config.gradient} text-white`}>
                  <th className="text-left px-6 py-4 font-semibold">Stage</th>
                  <th className="text-left px-6 py-4 font-semibold">Type</th>
                  <th className="text-center px-6 py-4 font-semibold">Marks</th>
                  <th className="text-center px-6 py-4 font-semibold">Duration</th>
                </tr>
              </thead>
              <tbody>
                {config.examPattern.map((row, i) => (
                  <tr key={row.stage} className={i % 2 === 0 ? "bg-card" : "bg-muted/30"}>
                    <td className="px-6 py-4 font-medium">{row.stage}</td>
                    <td className="px-6 py-4 text-muted-foreground">{row.type}</td>
                    <td className="px-6 py-4 text-center font-semibold">{row.marks}</td>
                    <td className="px-6 py-4 text-center">{row.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function SubjectWeightageSection({ config }: { config: ExamLandingConfig }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Subject-Wise Weightage</h2>
          <p className="mt-4 text-muted-foreground">Focus on high-priority subjects to maximize your score</p>
        </motion.div>

        <div className="grid gap-4">
          {config.subjects.map((subject, i) => (
            <motion.div
              key={subject.name}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex items-center justify-between rounded-xl border bg-card px-6 py-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center gap-4">
                <div className={`w-2 h-2 rounded-full ${subject.priority === "high" ? "bg-red-500" : subject.priority === "medium" ? "bg-amber-500" : "bg-green-500"}`} />
                <span className="font-medium">{subject.name}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground">{subject.questions} Qs</span>
                <PriorityBadge priority={subject.priority} />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ResourcesSection({ config }: { config: ExamLandingConfig }) {
  return (
    <section className="py-20 sm:py-28 bg-muted/30">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Study Resources</h2>
          <p className="mt-4 text-muted-foreground">Expert guides and preparation strategies for {config.name}</p>
        </motion.div>

        <div className="grid gap-4">
          {config.blogLinks.map((link, i) => (
            <motion.div
              key={link.href}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <Link
                to={link.href}
                className="flex items-center justify-between rounded-xl border bg-card px-6 py-5 hover:shadow-md transition-all hover:-translate-y-0.5 group"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${config.gradient} flex items-center justify-center flex-shrink-0`}>
                    <BookOpen className="h-5 w-5 text-white" />
                  </div>
                  <span className="font-medium group-hover:text-primary transition-colors">{link.label}</span>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ config }: { config: ExamLandingConfig }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold">Frequently Asked Questions</h2>
        </motion.div>

        <div className="space-y-4">
          {config.faqs.map((faq, i) => (
            <motion.details
              key={i}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="group rounded-xl border bg-card overflow-hidden"
            >
              <summary className="cursor-pointer px-6 py-5 font-medium flex items-center justify-between hover:bg-muted/30 transition-colors">
                <span>{faq.question}</span>
                <ChevronRight className="h-5 w-5 text-muted-foreground transition-transform group-open:rotate-90" />
              </summary>
              <div className="px-6 pb-5 text-muted-foreground leading-relaxed">
                {faq.answer}
              </div>
            </motion.details>
          ))}
        </div>
      </div>
    </section>
  );
}

function CTASection({ config }: { config: ExamLandingConfig }) {
  return (
    <section className="py-20 sm:py-28">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className={`relative rounded-3xl p-10 sm:p-14 text-center bg-gradient-to-br ${config.gradient} text-white overflow-hidden`}
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold">Ready to Crack {config.name}?</h2>
            <p className="mt-4 text-white/80 max-w-lg mx-auto text-lg">
              Join thousands of aspirants. Start your free mock test now — no signup needed.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-gray-900 hover:bg-gray-100 shadow-lg text-base px-8 font-semibold">
                <Link to={config.mockTestLink}>
                  Start Free Mock Test <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white/40 text-white hover:bg-white/10 text-base px-8">
                <Link to="/exam-room">
                  Enter Exam Room <CheckCircle2 className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
