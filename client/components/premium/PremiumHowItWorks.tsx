import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Link } from "react-router-dom";
import {
  Settings2,
  Mic2,
  BarChart3,
  ArrowRight,
  Globe2,
  FileText,
  Clock4,
  Brain,
  TrendingUp,
  MessageSquare,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const steps = [
  {
    number: "01",
    label: "Setup",
    title: "Personalise Your Session",
    headline: "Tell us what job you're going for — we'll handle the rest.",
    description:
      "Configure every detail of your mock interview in under 60 seconds. Choose your industry, set the difficulty, upload your CV, and specify the job role. Our AI builds a bespoke question set around your exact profile.",
    icon: Settings2,
    color: "from-orange-500 to-red-500",
    glow: "shadow-orange-500/20",
    ring: "ring-orange-500/30",
    bg: "bg-orange-500/10",
    details: [
      { icon: Globe2, text: "4 languages — English, Hindi, Bengali, Telugu" },
      { icon: FileText, text: "Upload your CV for hyper-personalised questions" },
      { icon: Clock4, text: "Choose session length: 10 min to 60 min" },
      { icon: Settings2, text: "Government, IT, Private, Campus interview modes" },
    ],
  },
  {
    number: "02",
    label: "Practice",
    title: "Face a Real AI Interviewer",
    headline: "A professional voice-driven interview — as close to the real thing as it gets.",
    description:
      "Your AI interviewer asks targeted questions via voice, listens to your spoken answers in real-time, and fires intelligent follow-up questions — just like a live panel would. No scripts, no repetition.",
    icon: Mic2,
    color: "from-violet-500 to-purple-600",
    glow: "shadow-orange-500/20",
    ring: "ring-orange-500/30",
    bg: "bg-orange-500/10",
    details: [
      { icon: Mic2, text: "Live voice recognition with 2-minute answer timer" },
      { icon: Brain, text: "Dynamic follow-up questions based on your answers" },
      { icon: MessageSquare, text: "Realistic conversation flow — not a quiz" },
      { icon: Clock4, text: "Auto-paced: interviewer speaks, waits, responds" },
    ],
  },
  {
    number: "03",
    label: "Improve",
    title: "Receive Deep Performance Insights",
    headline: "Know exactly what to fix before your real interview.",
    description:
      "After every session you get a structured evaluation report with scores across four key dimensions, specific weak-area coaching, and actionable improvement steps prioritised by impact.",
    icon: BarChart3,
    color: "from-emerald-500 to-teal-600",
    glow: "shadow-emerald-500/20",
    ring: "ring-emerald-500/30",
    bg: "bg-emerald-500/10",
    details: [
      { icon: BarChart3, text: "Scores: Communication, Technical, Confidence, Clarity" },
      { icon: TrendingUp, text: "Track improvement across multiple sessions" },
      { icon: Sparkles, text: "AI-written strength & weakness breakdown" },
      { icon: CheckCircle2, text: "Prioritised action plan to improve fast" },
    ],
  },
];

// Smooth easing
const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function PremiumHowItWorks() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-10 sm:py-14 lg:py-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 dark:bg-slate-900/60" />
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[400px] opacity-30"
          style={{
            background: "radial-gradient(ellipse, rgba(99,102,241,0.1) 0%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
      </div>

      {/* Top divider */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.25), transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Section header ── */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-12 lg:mb-14"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-5"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            How It Works
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            From zero to{" "}
            <span className="bg-gradient-to-r from-orange-500 via-red-500 to-red-600 bg-clip-text text-transparent">
              interview-ready
            </span>{" "}
            in 3 steps
          </h2>

          <motion.p
            className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            A structured, AI-powered process that mirrors the real interview experience —
            so when the actual day comes, you're already comfortable.
          </motion.p>
        </motion.div>

        {/* ── Steps ── */}
        <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-3 lg:gap-6 xl:gap-8">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 32 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.65, delay: 0.15 + idx * 0.12, ease: smoothEase }}
                className="relative group"
              >
                {/* Arrow between cards — desktop only */}
                {idx < steps.length - 1 && (
                  <motion.div
                    className="hidden lg:flex absolute -right-4 xl:-right-5 top-10 z-20 items-center justify-center w-8 h-8 rounded-full bg-background border border-border/60 shadow-sm"
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ duration: 0.4, delay: 0.5 + idx * 0.15 }}
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground" />
                  </motion.div>
                )}

                {/* Card */}
                <div className="h-full bg-card border border-border/50 rounded-2xl p-6 xl:p-7 flex flex-col gap-5 hover:border-orange-500/30 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group-hover:-translate-y-1">

                  {/* Top row — step pill + icon */}
                  <div className="flex items-center justify-between">
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r ${step.color} shadow-md ${step.glow}`}>
                      <span className="text-white text-xs font-bold tracking-widest">STEP {step.number}</span>
                    </div>
                    <div className={`w-11 h-11 rounded-xl ${step.bg} ring-1 ${step.ring} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-foreground/70" />
                    </div>
                  </div>

                  {/* Label + title + headline + description */}
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground/50 mb-1">{step.label}</p>
                    <h3 className="text-xl font-bold text-foreground leading-snug mb-2">{step.title}</h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${step.color} bg-clip-text text-transparent mb-3 leading-snug`}>
                      {step.headline}
                    </p>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>

                  {/* Divider */}
                  <div className="h-px bg-border/60" />

                  {/* Detail bullets */}
                  <div className="space-y-2.5">
                    {step.details.map((detail, dIdx) => {
                      const DIcon = detail.icon;
                      return (
                        <div key={dIdx} className="flex items-center gap-2.5">
                          <div className={`w-7 h-7 rounded-lg ${step.bg} flex items-center justify-center flex-shrink-0`}>
                            <DIcon className="w-3.5 h-3.5 text-foreground/60" />
                          </div>
                          <span className="text-xs text-muted-foreground">{detail.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Bottom accent line on hover */}
                  <div className={`h-0.5 w-0 group-hover:w-full rounded-full bg-gradient-to-r ${step.color} transition-all duration-500 mt-auto`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* ── Bottom CTA banner ── */}
        <motion.div
          className="mt-10 lg:mt-12"
          initial={{ opacity: 0, y: 24 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.55, ease: smoothEase }}
        >
          <div className="relative overflow-hidden rounded-2xl border border-orange-500/20 bg-gradient-to-br from-slate-900 via-indigo-950/60 to-slate-900 px-6 sm:px-10 py-8 sm:py-10">

            {/* Subtle grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
            {/* Glow orbs */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6">
              {/* Left text */}
              <div className="text-center sm:text-left space-y-1.5">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">Free to start — no card needed</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  Your first mock interview is waiting.
                </h3>
                <p className="text-sm text-slate-400 max-w-md">
                  Set up in 60 seconds. Practice today. Walk into your real interview with confidence.
                </p>
              </div>

              {/* Right CTA */}
              <div className="flex flex-col items-center gap-2.5 flex-shrink-0">
                <Link to="/setup">
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative group px-7 py-3.5 rounded-xl text-sm font-semibold text-white overflow-hidden flex items-center gap-2"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-red-500 to-red-600" />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-400 via-red-400 to-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <span className="relative">Start Your Free Interview</span>
                    <ArrowRight className="relative w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-200" />
                  </motion.button>
                </Link>
                <p className="text-xs text-slate-500">50,000+ interviews completed · Rated 4.9/5</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom divider */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(99,102,241,0.15), transparent)" }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : {}}
        transition={{ duration: 1.2, delay: 0.4, ease: smoothEase }}
      />
    </section>
  );
}
