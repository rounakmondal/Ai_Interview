import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BookOpen,
  Target,
  Zap,
  Trophy,
  ArrowRight,
  Sparkles,
  GraduationCap,
  Shield,
  BarChart3,
} from "lucide-react";

const TOPICS = [
  {
    icon: BookOpen,
    name: "General Studies",
    tags: ["History", "Geography", "Polity", "Economy"],
    color: "from-blue-500 to-cyan-400",
    shadow: "shadow-blue-500/20",
    border: "border-blue-500/20",
  },
  {
    icon: Shield,
    name: "Reasoning & Logic",
    tags: ["Verbal", "Non-Verbal", "Puzzles", "Coding"],
    color: "from-purple-500 to-pink-400",
    shadow: "shadow-purple-500/20",
    border: "border-purple-500/20",
  },
  {
    icon: BarChart3,
    name: "Quantitative Aptitude",
    tags: ["Arithmetic", "Algebra", "Data Interp.", "Geometry"],
    color: "from-orange-500 to-amber-400",
    shadow: "shadow-orange-500/20",
    border: "border-orange-500/20",
  },
  {
    icon: GraduationCap,
    name: "English Language",
    tags: ["Grammar", "Comprehension", "Vocabulary", "Cloze"],
    color: "from-emerald-500 to-green-400",
    shadow: "shadow-emerald-500/20",
    border: "border-emerald-500/20",
  },
];

const EXAMS = ["WBCS", "WBPSC", "WB Police", "WB TET", "SSC MTS", "IBPS PO", "RRB NTPC"];

export default function ExamRoomBanner() {
  return (
    <section className="relative py-20 overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] bg-gradient-to-br from-violet-500/8 via-indigo-500/5 to-cyan-500/8 rounded-full blur-3xl" />
        <div className="absolute top-10 right-10 w-72 h-72 bg-pink-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 left-10 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container px-4 max-w-6xl mx-auto relative">
        {/* ── Top Banner CTA ── */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <Link to="/exam-room" className="block group">
            <div className="relative rounded-3xl overflow-hidden border border-white/[0.08]">
              {/* Gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600" />
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iLjAzIj48cGF0aCBkPSJNMzYgMzRoLTJ2LTRoMnYtNGgydjRoNHYyaC00djRoLTJ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40" />

              <div className="relative px-6 py-8 sm:px-10 sm:py-12 flex flex-col md:flex-row items-center gap-6 md:gap-10">
                {/* Left */}
                <div className="flex-1 text-center md:text-left space-y-4">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-sm border border-white/10">
                    <Sparkles className="w-3.5 h-3.5" />
                    TOPIC-WISE PRACTICE
                  </div>

                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
                    Exam Room
                    <span className="block text-lg sm:text-xl font-medium text-white/70 mt-2">
                      Chapter-wise tests · Difficulty levels · Progress tracking
                    </span>
                  </h2>

                  <p className="text-white/60 text-sm sm:text-base max-w-lg">
                    Pick your exam, select a subject, and practice chapter by chapter. 
                    Easy → Medium → Hard — unlock tests as you improve.
                  </p>

                  {/* Exam pills */}
                  <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                    {EXAMS.map((e) => (
                      <span key={e} className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs font-medium border border-white/10 backdrop-blur-sm">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right CTA */}
                <div className="flex-shrink-0 flex flex-col items-center gap-3">
                  <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-white/20 transition-all duration-300">
                    <Target className="w-10 h-10 text-white" />
                  </div>
                  <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-white text-indigo-700 font-bold text-sm shadow-xl shadow-black/20 group-hover:shadow-2xl group-hover:scale-105 transition-all duration-300">
                    Enter Exam Room
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </motion.div>

        {/* ── Topic Cards ── */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {TOPICS.map((topic, i) => (
            <motion.div
              key={topic.name}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <Link to="/exam-room" className="block group">
                <div
                  className={`relative h-full rounded-2xl border ${topic.border} bg-white/[0.03] dark:bg-white/[0.02] backdrop-blur-sm p-6 overflow-hidden
                    hover:border-white/20 hover:bg-white/[0.06] transition-all duration-300 hover:shadow-xl ${topic.shadow}`}
                >
                  {/* Glow */}
                  <div className={`absolute -top-12 -right-12 w-32 h-32 bg-gradient-to-br ${topic.color} rounded-full opacity-10 group-hover:opacity-20 blur-2xl transition-opacity duration-500`} />

                  {/* Icon */}
                  <div className={`relative w-12 h-12 rounded-xl bg-gradient-to-br ${topic.color} flex items-center justify-center shadow-lg ${topic.shadow} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <topic.icon className="w-6 h-6 text-white" />
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-zinc-900 dark:text-white mb-3 group-hover:text-indigo-500 dark:group-hover:text-indigo-400 transition-colors">
                    {topic.name}
                  </h3>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5">
                    {topic.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-0.5 rounded-md bg-zinc-100 dark:bg-zinc-800 text-[11px] font-medium text-zinc-600 dark:text-zinc-400"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Arrow */}
                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-indigo-500 dark:text-indigo-400 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                    Start practicing <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom stats ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-sm"
        >
          {[
            { icon: Zap, label: "Adaptive Difficulty", desc: "Easy → Hard unlock" },
            { icon: Trophy, label: "Progress Tracking", desc: "Per-chapter analytics" },
            { icon: Target, label: "Negative Marking", desc: "Real exam feel" },
          ].map((stat) => (
            <div key={stat.label} className="flex items-center gap-3 text-zinc-500 dark:text-zinc-400">
              <div className="w-9 h-9 rounded-lg bg-indigo-500/10 flex items-center justify-center">
                <stat.icon className="w-4.5 h-4.5 text-indigo-500" />
              </div>
              <div>
                <div className="font-semibold text-zinc-800 dark:text-zinc-200 text-xs">{stat.label}</div>
                <div className="text-[11px] text-zinc-400">{stat.desc}</div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
