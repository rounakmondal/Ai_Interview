import { useRef } from "react";
import { motion, easeInOut } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, Brain, BarChart3, CheckCircle2, Star, Sparkles } from "lucide-react";

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

const trustedBy = [
  { name: "TCS", color: "text-blue-600 dark:text-blue-400" },
  { name: "Infosys", color: "text-indigo-600 dark:text-indigo-400" },
  { name: "Wipro", color: "text-violet-600 dark:text-violet-400" },
  { name: "UPSC", color: "text-amber-600 dark:text-amber-400" },
  { name: "IBPS", color: "text-emerald-600 dark:text-emerald-400" },
  { name: "HCL", color: "text-cyan-600 dark:text-cyan-400" },
];

const chatBubbles = [
  { from: "ai", text: "Tell me about a time you handled a difficult situation at work.", delay: 0.4 },
  { from: "user", text: "In my last role, I led a cross-functional team during a critical product launch…", delay: 1.8 },
  { from: "ai", text: "Interesting! Can you elaborate on how you managed conflicting priorities?", delay: 3.4 },
];

function MockInterviewCard() {
  return (
    <div className="relative w-full max-w-sm mx-auto">
      <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-blue-500/20 rounded-3xl blur-2xl" />
      <div className="relative bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow">AI</div>
            <div>
              <p className="text-xs font-semibold text-foreground">InterviewAI</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-muted-foreground">Live session</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            REC
          </div>
        </div>

        {/* Avatar */}
        <div className="relative h-44 bg-gradient-to-br from-indigo-950/80 via-violet-900/40 to-slate-900/80 flex items-center justify-center overflow-hidden">
          <img src="/Gemini_Generated_Image_9cu79a9cu79a9cu7.png" alt="AI Interviewer" className="h-full w-full object-cover object-top opacity-90" />
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-end gap-[3px]">
            {[3, 6, 9, 14, 9, 6, 3, 6, 10, 6, 3].map((h, i) => (
              <motion.div
                key={i}
                animate={{ scaleY: [1, 1.8, 1] }}
                transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.07, ease: easeInOut }}
                className="w-[3px] bg-white/80 rounded-full origin-bottom"
                style={{ height: h }}
              />
            ))}
          </div>
        </div>

        {/* Chat bubbles */}
        <div className="px-4 py-3 space-y-2 min-h-[140px]">
          {chatBubbles.map((b, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: b.delay, duration: 0.5, ease: smoothEase }}
              className={`flex ${b.from === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`max-w-[80%] text-[11px] leading-relaxed px-3 py-2 rounded-xl ${b.from === "ai" ? "bg-indigo-500/10 border border-indigo-500/20 text-foreground rounded-tl-none" : "bg-muted text-muted-foreground rounded-tr-none"}`}>
                {b.text}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="px-4 py-3 border-t border-border/40 bg-muted/20 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Mic className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            Listening…
          </div>
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-500" />
            <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400">Scoring live</span>
          </div>
        </div>
      </div>

      {/* Floating badges */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: easeInOut }}
        className="absolute -left-12 top-16 bg-card border border-border/60 rounded-xl px-3 py-2 shadow-lg items-center gap-2 hidden xl:flex"
      >
        <Brain className="w-4 h-4 text-violet-500" />
        <span className="text-xs font-semibold text-foreground whitespace-nowrap">AI Follow-ups</span>
      </motion.div>

      <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: easeInOut, delay: 0.5 }}
        className="absolute -right-12 bottom-24 bg-card border border-border/60 rounded-xl px-3 py-2 shadow-lg items-center gap-2 hidden xl:flex"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-semibold text-foreground whitespace-nowrap">Instant Score</span>
      </motion.div>
    </div>
  );
}

export default function PremiumHero() {
  const containerRef = useRef(null);

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
  };
  const item = {
    hidden: { opacity: 0, y: 22 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: smoothEase } },
  };

  return (
    <div ref={containerRef} className="relative min-h-[85vh] overflow-hidden flex flex-col justify-center">
      {/* Background */}
      <div className="absolute inset-0 -z-20 dark:bg-slate-950 bg-white">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-[0.04] dark:opacity-[0.07]"
          style={{ backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)", backgroundSize: "28px 28px" }}
        />
      </div>

      {/* Announcement banner */}
      {/* Main content */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">

          {/* Left */}
          <motion.div variants={container} initial="hidden" animate="visible" className="space-y-7">
            {/* Badge */}
           

            {/* Headline */}
            <motion.div variants={item} className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight text-foreground">
                Practice with an{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">AI Interviewer</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                    <path d="M2 6 C60 2, 120 8, 180 4 S260 2, 298 6" stroke="url(#heroUL)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <defs>
                      <linearGradient id="heroUL" x1="0" y1="0" x2="300" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient>
                    </defs>
                  </svg>
                </span>
                {" "}&amp; land your dream job
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.div variants={item}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Realistic voice-driven mock interviews with instant AI feedback, resume analysis, and detailed scoring — for{" "}
                <span className="text-foreground font-medium">Government</span>,{" "}
                <span className="text-foreground font-medium">IT</span>,{" "}
                <span className="text-foreground font-medium">Private</span> and{" "}
                <span className="text-foreground font-medium">Campus</span> roles.
              </p>
            </motion.div>

            {/* CTAs */}
            <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
              <Link to="/setup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white overflow-hidden shadow-lg shadow-indigo-500/30"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-violet-600" />
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <span className="relative flex items-center gap-2">
                    Start Free Interview
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </motion.button>
              </Link>
              <a href="#features">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold border border-border/60 hover:border-indigo-500/40 text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 bg-card/80 transition-colors duration-200"
                >
                  See how it works
                </motion.button>
              </a>
            </motion.div>

            {/* Social proof */}
            <motion.div variants={item} className="flex items-center gap-3 flex-wrap">
              <div className="flex -space-x-2">
                {[
                  ["PS", "linear-gradient(135deg,#6366f1,#8b5cf6)"],
                  ["RV", "linear-gradient(135deg,#8b5cf6,#a855f7)"],
                  ["AN", "linear-gradient(135deg,#06b6d4,#6366f1)"],
                  ["AP", "linear-gradient(135deg,#f59e0b,#ef4444)"],
                  ["VS", "linear-gradient(135deg,#10b981,#06b6d4)"],
                ].map(([initials, bg], i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white"
                    style={{ background: bg }}
                  >
                    {initials}
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-xs text-muted-foreground">Loved by early users</p>
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-3 gap-4 pt-5 border-t border-border/40">
              {[
                { value: "Free", label: "To Get Started" },
                { value: "AI", label: "Powered Feedback" },
                { value: "4", label: "Languages" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">{s.value}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — Live mock interview card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: smoothEase }}
            className="hidden lg:flex items-center justify-center relative"
          >
            <MockInterviewCard />
          </motion.div>
        </div>
      </div>

      {/* Trusted-by bar */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8, ease: smoothEase }}
        className="w-full border-t border-border/40 bg-muted/20 py-4 px-4"
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
          <p className="text-xs font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-wider">Used by candidates targeting</p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2">
            {trustedBy.map((co, i) => (
              <span key={i} className={`text-sm font-bold ${co.color} tracking-wide`}>{co.name}</span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

