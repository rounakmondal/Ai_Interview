import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import {
  GraduationCap,
  ArrowRight,
  BookOpen,
  Layers,
  Target,
  Shield,
  Train,
  Landmark,
  CheckCircle,
} from "lucide-react";

const examCategories = [
  { icon: Shield, title: "Police Exams", desc: "WB Police SI, Constable", query: "WB Police" },
  { icon: Landmark, title: "Civil Services", desc: "WBCS, UPSC CSE, NDA", query: "WBCS" },
  { icon: BookOpen, title: "SSC Exams", desc: "SSC CGL, CHSL, MTS", query: "SSC CGL" },
  { icon: GraduationCap, title: "Banking", desc: "IBPS PO, Clerk, SBI PO", query: "IBPS PO" },
  { icon: Train, title: "Railway", desc: "RRB NTPC, Group D", query: "Railway" },
  { icon: GraduationCap, title: "Teaching", desc: "CTET, WB TET, JTET", query: "TET" },
];

const highlights = [
  "Complete exam pattern — rounds, papers & duration",
  "Subject-wise topics & marks distribution",
  "Eligibility, age limit & application fee",
  "Preparation tips & strategy",
];

export default function ExamSyllabusSection() {
  return (
    <section id="exam-syllabus" className="py-20 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-emerald-500/5 rounded-full blur-3xl" />
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
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-sm font-medium border border-emerald-500/20">
            <Layers className="w-4 h-4" />
            Know Your Exam Syllabus
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold">
            Exam Syllabus & Pattern
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Search any government, banking, defence, or teaching exam — see the complete syllabus and exam pattern
            with rounds, subjects, marks breakdown, eligibility & preparation tips.
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
            <Card className="p-6 border-emerald-500/20 bg-gradient-to-br from-emerald-500/5 to-green-500/5">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6 text-emerald-600" />
                </div>
                <div>
                  <h3 className="font-bold text-lg">Exam Syllabus Explorer</h3>
                  <p className="text-xs text-muted-foreground">All exam info in one place</p>
                </div>
              </div>

              <ul className="space-y-3 mb-6">
                {highlights.map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Link to="/exam-syllabus">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
                >
                  <Target className="w-4 h-4" />
                  Explore Syllabus
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </Card>
          </motion.div>

          {/* Right — exam category grid */}
          <div className="grid grid-cols-2 gap-3">
            {examCategories.map((cat, i) => (
              <motion.div
                key={cat.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
              >
                <Link to={`/exam-syllabus?q=${encodeURIComponent(cat.query)}`}>
                  <Card className="p-4 hover:border-emerald-500/30 hover:shadow-md transition-all group cursor-pointer h-full">
                    <cat.icon className="w-5 h-5 text-emerald-600 mb-2 group-hover:scale-110 transition-transform" />
                    <h4 className="font-semibold text-sm">{cat.title}</h4>
                    <p className="text-xs text-muted-foreground mt-0.5">{cat.desc}</p>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom SEO links */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex flex-wrap justify-center gap-2 mt-10"
        >
          {["WBCS", "WB Police SI", "SSC CGL", "IBPS PO", "UPSC", "CTET", "JTET", "Railway", "NDA"].map((exam) => (
            <Link
              key={exam}
              to={`/exam-syllabus?q=${encodeURIComponent(exam)}`}
              className="px-3 py-1 text-xs rounded-full border border-emerald-500/20 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-500/10 transition-colors"
            >
              {exam} Syllabus
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
