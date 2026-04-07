import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Bot,
  Timer,
  Brain,
  ArrowRight,
  CheckCircle2,
  ImagePlus,
  MessageSquare,
  Zap,
  Users,
  Star,
  ChevronRight,
} from "lucide-react";

export default function StudyToolsSection() {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-[600px] h-[600px] bg-orange-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -translate-y-1/2 right-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 max-w-6xl mx-auto relative">

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 text-sm font-medium border border-orange-500/20">
            <Brain className="w-3.5 h-3.5" />
            Smart Study Tools — Free for All Aspirants
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Everything You Need to{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Study Smarter</span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto leading-relaxed">
            Two purpose-built tools designed specifically for WBCS, SSC, Railway &amp; Banking aspirants. No login required.
          </p>
        </motion.div>

        {/* ─── Card 1 — AI Chatbot ─── */}
        <div className="space-y-5">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-orange-500/20 shadow-xl shadow-orange-500/5"
          >
            {/* Left — content */}
            <div className="bg-gradient-to-br from-violet-500/8 via-background to-background p-8 sm:p-10 flex flex-col justify-between gap-8">
              <div className="space-y-5">
                {/* Tag + icon */}
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white shadow-lg shadow-orange-500/25">
                    <Bot className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20">
                    AI Powered · Free
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">AI Study Assistant</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Ask any exam question by typing or uploading an image. Get instant, detailed answers with Bengali explanations — covering all subjects tested in competitive exams.
                  </p>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: MessageSquare, label: "Text Q&A" },
                    { icon: ImagePlus, label: "Image Upload" },
                    { icon: Zap, label: "Bengali Support" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-500/8 border border-orange-500/15 rounded-lg text-xs font-medium">
                      <f.icon className="w-3 h-3 text-orange-500" />
                      {f.label}
                    </div>
                  ))}
                </div>

                {/* Checklist */}
                <ul className="space-y-2">
                  {[
                    "History, Polity, Geography, Math, Reasoning & Current Affairs",
                    "Upload photo of a printed question — get step-by-step solution",
                    "Explanations in both English and Bengali (বাংলা)",
                    "Available 24/7, no signup required",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-orange-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/chatbot">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-semibold text-sm shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 transition-shadow cursor-pointer"
                >
                  Open AI Chat
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>

            {/* Right — visual preview */}
            <div className="bg-gradient-to-br from-orange-500/90 to-red-600 p-8 flex flex-col justify-center gap-4 relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-white/5 rounded-full" />

              {/* Mock chat bubbles */}
              <div className="space-y-3 relative z-10">
                {/* User message */}
                <div className="flex justify-end">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[75%]">
                    <p className="text-white text-xs font-medium">Explain Battle of Plassey</p>
                  </div>
                </div>
                {/* AI response */}
                <div className="flex gap-2 items-start">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3 h-3 text-white" />
                  </div>
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl rounded-tl-sm px-4 py-2.5 flex-1">
                    <p className="text-white/90 text-xs leading-relaxed"><strong className="text-white">Battle of Plassey (1757)</strong><br />Fought between Robert Clive &amp; Siraj ud-Daulah. British won via Mir Jafar's betrayal.</p>
                  </div>
                </div>
                {/* Image upload hint */}
                <div className="flex justify-end">
                  <div className="bg-white/20 backdrop-blur-sm rounded-2xl rounded-tr-sm px-4 py-2.5 flex items-center gap-2">
                    <ImagePlus className="w-3.5 h-3.5 text-white/80" />
                    <p className="text-white/80 text-xs">question.jpg uploaded</p>
                  </div>
                </div>
              </div>

              {/* Stats pill */}
              <div className="flex items-center gap-3 mt-2 relative z-10">
                <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                  <Star className="w-3 h-3 text-amber-300 fill-amber-300" />
                  <span className="text-white text-xs font-medium">4.9 / 5</span>
                </div>
                <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1">
                  <Users className="w-3 h-3 text-white/80" />
                  <span className="text-white text-xs font-medium">10k+ chats</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ─── Card 2 — Study With Me ─── */}
          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="grid lg:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-emerald-500/20 shadow-xl shadow-emerald-500/5"
          >
            {/* Left — visual */}
            <div className="bg-gradient-to-br from-emerald-600/90 to-teal-700 p-8 flex flex-col justify-center gap-5 relative overflow-hidden order-last lg:order-first">
              <div className="absolute -top-12 -left-12 w-48 h-48 bg-white/5 rounded-full" />
              <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white/5 rounded-full" />

              {/* Mock timer UI */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Circular timer visual */}
                <div className="relative">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 100 100">
                    <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="5" />
                    <circle cx="50" cy="50" r="44" fill="none" stroke="white" strokeWidth="5" strokeLinecap="round"
                      strokeDasharray={`${2 * Math.PI * 44}`}
                      strokeDashoffset={`${2 * Math.PI * 44 * 0.35}`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-white text-2xl font-bold font-mono">16:15</span>
                    <span className="text-white/70 text-[10px]">Focus Time</span>
                  </div>
                </div>

                {/* Phase dots */}
                <div className="flex gap-2">
                  {[true, true, false, false].map((done, i) => (
                    <div key={i} className={`w-3 h-3 rounded-full ${done ? "bg-white" : "bg-white/25"}`} />
                  ))}
                </div>

                {/* Stats row */}
                <div className="flex gap-4">
                  <div className="text-center">
                    <p className="text-white text-sm font-bold">2</p>
                    <p className="text-white/60 text-[10px]">Pomodoros</p>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <p className="text-white text-sm font-bold">50m</p>
                    <p className="text-white/60 text-[10px]">Focus Time</p>
                  </div>
                  <div className="w-px bg-white/20" />
                  <div className="text-center">
                    <p className="text-white text-sm font-bold">3</p>
                    <p className="text-white/60 text-[10px]">Tasks Done</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right — content */}
            <div className="bg-gradient-to-bl from-emerald-500/8 via-background to-background p-8 sm:p-10 flex flex-col justify-between gap-8">
              <div className="space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/25">
                    <Timer className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                    Pomodoro Technique · With Sounds
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold">Study With Me</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    A full Pomodoro focus timer with Web Audio alerts, session tasks, and progress tracking. Scientifically proven to double study efficiency.
                  </p>
                </div>

                {/* Feature pills */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { icon: Timer, label: "25+5 min cycles" },
                    { icon: Zap, label: "Audio alerts" },
                    { icon: CheckCircle2, label: "Task list" },
                  ].map((f) => (
                    <div key={f.label} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/8 border border-emerald-500/15 rounded-lg text-xs font-medium">
                      <f.icon className="w-3 h-3 text-emerald-500" />
                      {f.label}
                    </div>
                  ))}
                </div>

                <ul className="space-y-2">
                  {[
                    "Circular SVG ring timer with real-time progress",
                    "Sound alerts at session end (Web Audio API — no files)",
                    "Auto long-break every 4 Pomodoros",
                    "Daily stats: sessions, focus hours, tasks completed",
                  ].map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <Link to="/study-with-me">
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-semibold text-sm shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-shadow cursor-pointer"
                >
                  Start a Focus Session
                  <ArrowRight className="w-4 h-4" />
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
