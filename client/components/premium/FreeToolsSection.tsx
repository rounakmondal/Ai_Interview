import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Calculator,
  Calendar,
  IndianRupee,
  GraduationCap,
  Keyboard,
  ArrowRight,
  Sparkles,
  TrendingUp,
  Users,
  Wrench,
} from "lucide-react";

const TOOLS = [
  {
    title: "CGPA ↔ Percentage Calculator",
    description: "Convert CGPA to percentage & back. CBSE, VTU, Anna Univ formulas. SGPA calculator included.",
    href: "/cgpa-calculator",
    icon: Calculator,
    gradient: "from-blue-500 to-indigo-600",
    shadowColor: "shadow-blue-500/25",
    bgTint: "bg-blue-500/8",
    borderTint: "border-blue-500/20",
    iconTint: "text-blue-500",
    searches: "500K+/month",
    tags: ["CGPA", "Percentage", "GPA"],
  },
  {
    title: "Age Calculator for Govt Jobs",
    description: "Calculate exact age on exam cut-off date. Includes OBC/SC/ST/PwD relaxation for all major exams.",
    href: "/age-calculator",
    icon: Calendar,
    gradient: "from-emerald-500 to-teal-600",
    shadowColor: "shadow-emerald-500/25",
    bgTint: "bg-emerald-500/8",
    borderTint: "border-emerald-500/20",
    iconTint: "text-emerald-500",
    searches: "200K+/month",
    tags: ["Age Limit", "Eligibility", "DOB"],
  },
  {
    title: "Salary Calculator (7th Pay)",
    description: "In-hand salary after 7th Pay Commission. DA, HRA, TA, NPS breakdown for SSC, WBCS, Railway, Banking.",
    href: "/salary-calculator",
    icon: IndianRupee,
    gradient: "from-green-500 to-emerald-600",
    shadowColor: "shadow-green-500/25",
    bgTint: "bg-green-500/8",
    borderTint: "border-green-500/20",
    iconTint: "text-green-500",
    searches: "150K+/month",
    tags: ["7th CPC", "Salary", "In-Hand"],
  },
  {
    title: "Exam Eligibility Checker",
    description: "Enter age, education & category → see which govt exams you qualify for. 18+ exams covered.",
    href: "/eligibility-checker",
    icon: GraduationCap,
    gradient: "from-orange-500 to-amber-600",
    shadowColor: "shadow-orange-500/25",
    bgTint: "bg-orange-500/8",
    borderTint: "border-orange-500/20",
    iconTint: "text-orange-500",
    searches: "100K+/month",
    tags: ["Eligibility", "Qualification", "Age"],
  },
  {
    title: "Typing Speed Test",
    description: "Practice for SSC CHSL, NTPC & Railway typing tests. Live WPM, accuracy & 35 WPM benchmark tracker.",
    href: "/typing-test",
    icon: Keyboard,
    gradient: "from-violet-500 to-purple-600",
    shadowColor: "shadow-violet-500/25",
    bgTint: "bg-violet-500/8",
    borderTint: "border-violet-500/20",
    iconTint: "text-violet-500",
    searches: "300K+/month",
    tags: ["SSC CHSL", "WPM", "Typing"],
  },
];

export default function FreeToolsSection() {
  return (
    <section className="py-24 relative overflow-hidden" id="free-tools">
      {/* Background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="container px-4 max-w-6xl mx-auto relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14 space-y-4"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-sm font-medium border border-violet-500/20">
            <Wrench className="w-3.5 h-3.5" />
            Free Student Tools — No Login Required
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Calculators Every{" "}
            <span className="bg-gradient-to-r from-violet-500 to-blue-500 bg-clip-text text-transparent">
              Student Needs
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto leading-relaxed">
            From CGPA conversion to salary estimates — 5 free tools used by lakhs of students every month. 100% free, works instantly.
          </p>

          {/* Social proof */}
          <div className="flex items-center justify-center gap-6 pt-2">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Users className="w-3.5 h-3.5 text-violet-500" />
              <span><strong className="text-foreground">10L+</strong> students/month</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span><strong className="text-foreground">5</strong> free tools</span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>No signup needed</span>
            </div>
          </div>
        </motion.div>

        {/* Tool Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((tool, i) => (
            <motion.div
              key={tool.href}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
            >
              <Link to={tool.href} className="block group">
                <div className={`relative h-full rounded-2xl border ${tool.borderTint} bg-background p-5 transition-all duration-300 hover:shadow-xl ${tool.shadowColor} hover:-translate-y-1`}>
                  {/* Search volume badge */}
                  <div className="absolute top-4 right-4">
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600 border border-green-500/20">
                      🔍 {tool.searches}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center text-white shadow-lg ${tool.shadowColor} mb-4`}>
                    <tool.icon className="w-5 h-5" />
                  </div>

                  {/* Content */}
                  <h3 className="font-bold text-base mb-1.5 group-hover:text-primary transition-colors pr-16">
                    {tool.title}
                  </h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-3">
                    {tool.description}
                  </p>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {tool.tags.map(tag => (
                      <span key={tag} className={`text-[10px] font-medium px-2 py-0.5 rounded-md ${tool.bgTint} ${tool.iconTint}`}>
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className={`flex items-center gap-1 text-xs font-semibold ${tool.iconTint} group-hover:gap-2 transition-all`}>
                    Use Free Tool
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}

          {/* "More Coming" card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: TOOLS.length * 0.08 }}
          >
            <Link to="/tools" className="block group h-full">
              <div className="h-full rounded-2xl border border-dashed border-gray-300 dark:border-gray-600 bg-muted/30 p-5 flex flex-col items-center justify-center text-center gap-3 transition-all hover:border-primary/40 hover:bg-primary/5">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center text-white">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-sm">View All Tools</p>
                  <p className="text-xs text-muted-foreground">More calculators & utilities</p>
                </div>
                <div className="flex items-center gap-1 text-xs font-semibold text-primary group-hover:gap-2 transition-all">
                  Explore All <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
