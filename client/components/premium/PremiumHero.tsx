import { useRef } from "react";
import { motion, easeInOut } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Mic, Brain, BarChart3, CheckCircle2 } from "lucide-react";

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
  { from: "user", text: "In my last role, I led a cross-functional team during a critical product launch�", delay: 1.8 },
  { from: "ai", text: "Interesting! Can you elaborate on how you managed conflicting priorities?", delay: 3.4 },
];

function MockInterviewCard() {
  return (
   <div className="relative w-full  max-w-6xl mx-auto transform scale-105 transition-all duration-500">
      <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-blue-500/20 rounded-3xl blur-2xl" />
      <div className="relative bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border/40 bg-muted/30">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold shadow">AI</div>
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
            Listening�
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

      {/* <motion.div
        animate={{ y: [0, 6, 0] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: easeInOut, delay: 0.5 }}
        className="absolute -right-12 bottom-24 bg-card border border-border/60 rounded-xl px-3 py-2 shadow-lg items-center gap-2 hidden xl:flex"
      >
        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
        <span className="text-xs font-semibold text-foreground whitespace-nowrap">Instant Score</span>
      </motion.div> */}

<motion.div
  animate={{ y: [0, 8, 0] }}
  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
  className="absolute -right-16 bottom-10 w-52 bg-[#1a1a1a] border border-white/10 rounded-[2rem] p-5 shadow-[0_20px_50px_rgba(0,0,0,0.5)] z-20 hidden xl:block"
>
  {/* Header Text */}
  <p className="text-white text-[10px] font-bold mb-4 opacity-70 uppercase tracking-widest text-center">
    Instant Score and Analysis
  </p>
  
  <div className="relative flex flex-col items-center">
    {/* Semi-Circle Progress Bar */}
    <div className="relative w-32 h-16 overflow-hidden">
      {/* Gray Background Path */}
      <div className="absolute top-0 w-32 h-32 border-[10px] border-white/5 rounded-full"></div>
      {/* Gradient Progress Path */}
      <div className="absolute top-0 w-32 h-32 border-[10px] border-indigo-500 rounded-full border-b-transparent border-r-transparent -rotate-45"></div>
      
      {/* Score Number */}
      <div className="absolute bottom-1 w-full text-center">
        <span className="text-3xl font-black text-white tracking-tighter">88</span>
      </div>
    </div>
    
    <p className="text-slate-500 text-[10px] font-bold mt-2">Score: 88/100</p>
  </div>

  {/* Footer Buttons */}
  <div className="mt-5 flex justify-center gap-3 border-t border-white/5 pt-4">
    <button className="text-[9px] text-slate-400 hover:text-white flex items-center gap-1 transition">
      <span className="text-xs">💬</span> Feedback
    </button>
    <div className="w-px h-3 bg-white/10 self-center"></div>
    <button className="text-[9px] text-slate-400 hover:text-white flex items-center gap-1 transition">
      <span className="text-xs">💡</span> Tips
    </button>
  </div>
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
                Ace Your Next Interview —{" "}
              <span className="relative inline-block">
                  <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">Practice Until You Succeed</span>
                  <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 8" fill="none">
                    <path d="M2 6 C60 2, 120 8, 180 4 S260 2, 298 6" stroke="url(#heroUL)" strokeWidth="2.5" strokeLinecap="round" fill="none" />
                    <defs>
                      {/* <linearGradient id="heroUL" x1="0" y1="0" x2="300" y2="0">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#a855f7" />
                      </linearGradient> */}
                    </defs>
                  </svg>
                </span>
              </h1>
            </motion.div>

            {/* Subtext */}
            <motion.div variants={item}>
              <p className="text-base sm:text-lg text-muted-foreground max-w-xl leading-relaxed">
                Voice-based mock interviews with instant AI feedback, resume analysis, and detailed scoring for{" "}
                <span className="text-foreground font-medium">WBCS, SSC, Police</span>,{" "}
                <span className="text-foreground font-medium">IT</span> &{" "}
                <span className="text-foreground font-medium">Campus</span> roles — in
                English or <span className="text-indigo-600 dark:text-indigo-400 font-semibold">বাংলা</span>.
              </p>
            </motion.div>

            {/* Exam Categories Section */}
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
  {/* WBCS Card */}
  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center hover:border-purple-500 transition-all cursor-pointer">
    <div className="w-12 h-12 mb-2 flex items-center justify-center bg-white/10 rounded-full">
     
<img src="\wbcs.avif" alt="WBCS Logo" className="w-full h-full rounded-full object-cover" />
    </div>
    <p className="text-white font-semibold text-sm">WBCS</p>
    <p className="text-slate-500 text-xs">Prepare Now</p>
  </div>
  {/* ssc card */}
  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center hover:border-purple-500 transition-all cursor-pointer">
    <div className="w-12 h-12 mb-2 flex items-center justify-center bg-white/10 rounded-full">
     
<img src="\ssc.jpeg" alt="WBCS Logo" className="w-full h-full rounded-full object-cover" />
    </div>
    <p className="text-white font-semibold text-sm">SSC</p>
    <p className="text-slate-500 text-xs">Prepare Now</p>
  </div>

  {/* Police Card */}
  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center hover:border-purple-500 transition-all cursor-pointer">
    <div className="w-12 h-12 mb-2 flex items-center justify-center bg-white/10 rounded-full">
      <img src="\police.png" alt="Police" className="w-full h-full rounded-full object-cover" />
    </div>
    <p className="text-white font-semibold text-sm">Police</p>
    <p className="text-slate-500 text-xs">Crack Exams</p>
  </div>

  {/* IT & Campus Card */}
  <div className="bg-slate-900/50 border border-slate-800 p-4 rounded-2xl flex flex-col items-center hover:border-purple-500 transition-all cursor-pointer">
    <div className="w-12 h-12 mb-2 flex items-center justify-center bg-white/10 rounded-full">
      <img src="\IT.jpeg" alt="IT" className="w-full h-full rounded-full object-cover" />
    </div>
    <p className="text-white font-semibold text-sm">IT & Campus</p>
    <p className="text-slate-500 text-xs">Job Ready</p>
  </div>
</div>




{/* Trust signals */}

<div className="space-y-4 mt-6">
  {/* First Point */}
  <div className="flex items-start gap-3">
    <span className="text-xl">✅</span>
    <p className="text-slate-300">
      <span className="text-white font-bold">500+ students</span> improved confidence in 2 weeks
    </p>
  </div>

  {/* Second Point */}
  <div className="flex items-start gap-3">
    <span className="text-xl">📚</span>
    <p className="text-slate-300">
      <span className="text-white font-bold">Real questions</span> from WBCS, SSC, Police & IT interviews
    </p>
  </div>

  {/* Third Point */}
  <div className="flex items-start gap-3">
    <span className="text-xl">🤝</span>
    <p className="text-slate-300">
      <span className="text-white font-bold">Built for WB students</span> — supports বাংলা + English
    </p>
  </div>
</div>


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
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-full text-base font-semibold border border-border/60 hover:border-indigo-500/40 text-foreground hover:text-indigo-600 dark:hover:text-indigo-400 bg-card/80 transition-colors duration-200"
                >
                  Try 1 Question — No Login
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust signals */}
            {/* <motion.div variants={item} className="space-y-3 pt-2">
              {[
                { emoji: "✅", text: <><strong>500+ students</strong> improved confidence in 2 weeks</> },
                { emoji: "✅", text: <><strong>Real questions</strong> from WBCS, SSC, Police &amp; IT interviews</> },
                { emoji: "✅", text: <><strong>Built for WB students</strong> — supports বাংলা + English</> },
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                  <span className="flex-shrink-0">{t.emoji}</span>
                  <span className="leading-snug">{t.text}</span>
                </div>
              ))}
            </motion.div> */}

            {/* Stats */}
            <motion.div variants={item} className="grid grid-cols-3 gap-4 pt-5 border-t border-border/40">
              {[
                { value: "Free", label: "To Get Started" },
                { value: "AI", label: "Powered Feedback" },
                { value: "বাংলা", label: "+ English" },
              ].map((s, i) => (
                <div key={i}>
                  <div className="text-2xl font-extrabold bg-gradient-to-r from-indigo-500 to-violet-600 bg-clip-text text-transparent">{s.value}</div>
                  <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right � Live mock interview card */}
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
