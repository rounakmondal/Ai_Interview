import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  Trophy,
  BookOpen,
  Camera,
  Newspaper,
  BarChart3,
  ArrowRight,
  Medal,
  CheckCircle,
} from "lucide-react";

const features = [
  { icon: BookOpen, title: "Mock Tests", desc: "WBCS, SSC, Railway, Banking, Police" },
  { icon: BookOpen, title: "Prev Year Papers", desc: "Filtered by exam, year & subject" },
  { icon: Camera, title: "Photo Solver", desc: "Upload question image, get solution" },
  { icon: Newspaper, title: "Current Affairs", desc: "Daily news + weekly quizzes" },
  { icon: BarChart3, title: "Dashboard", desc: "Track progress, weak areas & trends" },
  { icon: Medal, title: "Leaderboard", desc: "Compete with WB aspirants" },
];

export default function GovtPracticeSection() {
  return (
    <section id="govt-practice" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 max-w-6xl mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium border border-amber-500/20">
            <Trophy className="w-4 h-4" />
            New — Government Exam Preparation
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Crack Your Government Exam
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            A complete preparation platform for West Bengal government exam aspirants — practice MCQs, solve previous year papers, stay updated with current affairs, and track your progress.
          </p>
        </motion.div>

        {/* Main card + feature grid */}
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left — hero card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Card className="p-8 border-amber-500/20 bg-gradient-to-br from-amber-500/10 via-background to-background space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white">
                  <Trophy className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold">Government Exam Practice</h3>
                  <p className="text-sm text-muted-foreground">WBCS · SSC · Railway · Banking · Police</p>
                </div>
              </div>

              <ul className="space-y-2.5">
                {[
                  "50+ topic-wise MCQs with Bengali explanations",
                  "Full-length timed mock tests with auto-submit",
                  "Previous year questions with answer reveal",
                  "Photo question solver with step-by-step solutions",
                  "Daily current affairs & weekly quiz",
                  "Leaderboard ranking among WB aspirants",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-2.5 text-sm">
                    <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>

              <Link to="/govt-practice">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 transition-shadow"
                >
                  Start Preparing
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </Card>
          </motion.div>

          {/* Right — feature grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-3"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Card className="p-4 hover:border-amber-500/30 hover:bg-amber-500/5 transition-colors cursor-default space-y-2 border-border/40">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center">
                    <f.icon className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold">{f.title}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
