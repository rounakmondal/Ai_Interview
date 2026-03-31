import { useRef } from "react";
import { motion, easeInOut } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, Brain, BarChart3 } from "lucide-react";

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

const examCards = [
  {
    key: "WBCS",
    img: "/wbcs.avif",
    label: "WBCS",
    sub: "Prepare Now",
    iconBg: "from-violet-100 to-indigo-100 dark:from-violet-900/40 dark:to-indigo-900/40",
    badge: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
    border: "hover:border-violet-400 dark:hover:border-violet-500",
    shadow: "hover:shadow-violet-200/60 dark:hover:shadow-violet-900/40",
    dot: "bg-violet-400",
    type: "govt"
  },
  {
    key: "SSC",
    img: "/ssc.jpeg",
    label: "SSC",
    sub: "Prepare Now",
    iconBg: "from-amber-100 to-yellow-100 dark:from-amber-900/40 dark:to-yellow-900/40",
    badge: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
    border: "hover:border-amber-400 dark:hover:border-amber-500",
    shadow: "hover:shadow-amber-200/60 dark:hover:shadow-amber-900/40",
    dot: "bg-amber-400",
    type: "govt"
  },
  {
    key: "Police",
    img: "/police.png",
    label: "Police",
    sub: "Crack Exams",
    iconBg: "from-emerald-100 to-green-100 dark:from-emerald-900/40 dark:to-green-900/40",
    badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    border: "hover:border-emerald-400 dark:hover:border-emerald-500",
    shadow: "hover:shadow-emerald-200/60 dark:hover:shadow-emerald-900/40",
    dot: "bg-emerald-400",
    type: "govt"
  },
  {
    key: "it",
    img: "/IT.jpeg",
    label: "IT & Campus",
    sub: "Job Ready",
    iconBg: "from-blue-100 to-sky-100 dark:from-blue-900/40 dark:to-sky-900/40",
    badge: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    border: "hover:border-blue-400 dark:hover:border-blue-500",
    shadow: "hover:shadow-blue-200/60 dark:hover:shadow-blue-900/40",
    dot: "bg-blue-400",
    type: "interview"
  },
];

function MockInterviewCard() {
  return (
    <div className="relative w-full max-w-6xl mx-auto transform scale-105 transition-all duration-500">
      <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-blue-500/20 rounded-3xl blur-2xl" />
      <div className="relative bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30">
          <div className="flex items-center gap-2.5">
           <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-xs font-bold shadow">
             AI
              </div>
            <div>
              <p className="text-xs font-semibold text-foreground">InterviewPro</p>
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <p className="text-[10px] text-muted-foreground">AI Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            REC
          </div>
        </div>

        {/* Avatar — increased height from h-44 to h-72 */}
        <div className="relative h-72 bg-gradient-to-br from-indigo-950/80 via-violet-900/40 to-slate-900/80 flex items-center justify-center overflow-hidden">
          <img
            src="/Gemini_Generated_Image_9cu79a9cu79a9cu7.png"
            alt="AI Interviewer"
            className="h-full w-full object-cover object-top opacity-90"
          />
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
              <div
                className={`max-w-[80%] text-[11px] leading-relaxed px-3 py-2 rounded-xl ${b.from === "ai"
                  ? "bg-indigo-500/10 border border-indigo-500/20 text-foreground rounded-tl-none"
                  : "bg-muted text-muted-foreground rounded-tr-none"
                  }`}
              >
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
          <BarChart3 className="w-3.5 h-3.5 text-orange-500" />

<span className="text-[10px] font-semibold bg-gradient-to-l from-orange-500 to-red-500 bg-clip-text text-transparent">
  Scoring live
</span>
          </div>
        </div>
      </div>

      {/* Floating badge */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute -left-12 top-16 bg-card border border-orange-400/40 rounded-xl px-3 py-2 shadow-lg items-center gap-2 hidden xl:flex"
        >
        <Brain className="w-4 h-4 text-orange-500" />
          <span className="text-xs font-semibold text-foreground whitespace-nowrap">
          AI Follow-ups
          </span>
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
          style={{
            backgroundImage: "radial-gradient(circle, #6366f1 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />
      </div>

      {/* Main content */}
      <div className="max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-16 items-center">

          {/* Left */}
          <motion.div variants={container} initial="hidden" animate="visible" className="space-y-7">
            {/* Headline */}
            <motion.div variants={item} className="space-y-3">
              <h1 className="text-4xl sm:text-5xl lg:text-[3.4rem] font-extrabold leading-[1.1] tracking-tight text-foreground">
                Ace Your Next Interview —{" "}
                <span className="relative inline-block">
                  <span className="bg-gradient-to-l from-orange-500 to-red-500 bg-clip-text text-transparent">
                       Practice Until You Succeed
                  </span>

                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.div variants={item}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Voice-based mock interviews with instant AI feedback, resume analysis, and detailed scoring for{" "}
                <span className="text-foreground font-medium">WBCS, SSC, Police</span>,{" "}
                <span className="text-foreground font-medium">IT</span> &{" "}
                <span className="text-foreground font-medium">Campus</span> roles — in {" "}

                <span className="bg-gradient-to-l from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold">
                       English
                    </span> or{" "}
                <span className="bg-gradient-to-l from-orange-500 to-red-500 bg-clip-text text-transparent font-semibold">
                    বাংলা
                  </span>
              </p>
            </motion.div>

            {/* Exam Category Cards — fixed for day mode */}
            <motion.div variants={item} className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8">
              {examCards.map((cat) => (
                <Link
                  key={cat.key}
                  to={cat.type === "govt" ? "/govt-practice" : "/setup"}
                  state={cat.type === "govt" ? { exam: cat.key } : undefined}
                  className={`relative bg-white dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex flex-col items-center gap-2 ${cat.border} hover:shadow-lg ${cat.shadow} transition-all duration-300 cursor-pointer hover:-translate-y-1`}
                >
                  {/* Dot accent */}
            <span className={`absolute top-2.5 right-2.5 w-2 h-2 rounded-full opacity-60 ${cat.dot}`} />

                  {/* Icon */}
                  <div
                    className={`w-12 h-12 mb-1 flex items-center justify-center bg-gradient-to-br ${cat.iconBg} rounded-full`}
                  >
                    <img
                      src={cat.img}
                      alt={cat.label}
                      className="w-full h-full rounded-full object-cover"
                    />
                  </div>

                  <p className="text-slate-800 dark:text-white font-bold text-sm">{cat.label}</p>
                  <span className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${cat.badge}`}>
                    {cat.sub}
                  </span>
                </Link>
              ))}
            </motion.div>
              
                
            {/* CTA Buttons */}
              <motion.div variants={item} className="flex flex-col sm:flex-row gap-3">
              <Link to="/setup">
               <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold text-white overflow-hidden shadow-lg shadow-indigo-500/30"


                >
                  <div className="absolute inset-0 bg-gradient-to-l from-orange-500 to-red-500" />
                    <div className="absolute inset-0 bg-gradient-to-l from-orange-400 to-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                 <span className="relative flex items-center gap-2">
                    <Mic className="w-4 h-4" />
                    Start Free Mock Interview
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                  </span>
                </motion.button>
                </Link>



              <Link to="/setup">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold border border-border/60 hover:border-orange-400/40 text-foreground hover:text-orange-500 dark:hover:text-orange-400 bg-card/80 transition-colors duration-200"
                >
                  Try 1 Question — No Login
                </motion.button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-3 gap-4 pt-5 border-t border-border/40">
          {[
            { value: "Free", label: "To Get Started" },
            { value: "AI", label: "Powered Feedback" },
            { value: "বাংলা", label: "+ English" },
              ].map((s, i) => (
              <div key={i}>
          <div className="text-2xl font-extrabold bg-gradient-to-l from-orange-500 to-red-500 bg-clip-text text-transparent">
            {s.value}
          </div>
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
          <p className="text-xs font-semibold text-muted-foreground whitespace-nowrap uppercase tracking-wider">
            Used by candidates targeting
          </p>
          <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-6 gap-y-2">
            {trustedBy.map((co, i) => (
              <span key={i} className={`text-sm font-bold ${co.color} tracking-wide`}>
                {co.name}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}