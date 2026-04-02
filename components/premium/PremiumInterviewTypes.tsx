import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Building2, Cpu, Briefcase, GraduationCap, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const types = [
  {
    id: "government",
    icon: Building2,
    label: "Government",
    color: "from-orange-500 to-red-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    highlight: "text-orange-600 dark:text-orange-400",
    title: "Government & PSU Interviews",
    description:
      "Prepare for UPSC, IBPS, SSC, State PSC, SBI, RBI, and PSU interviews. Our AI understands the formal tone and depth required for government selection panels.",
    topics: [
      "UPSC Personality Test (IAS/IPS/IFS)",
      "IBPS PO, SO, Clerk Interviews",
      "SSC CGL / CHSL Final Interviews",
      "SBI, RBI, NABARD Officer Interviews",
      "State PSC interviews (MPSC, BPSC, KPSC…)",
      "Defence Services SSB preparation",
    ],
  },
  {
    id: "it",
    icon: Cpu,
    label: "IT / Tech",
    color: "from-orange-500 to-red-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    highlight: "text-orange-600 dark:text-orange-400",
    title: "IT & Tech Interviews",
    description:
      "Ace interviews at top tech companies including TCS, Infosys, Wipro, HCL, startups, and MNCs. Covers both fresher and experienced roles.",
    topics: [
      "Data Structures & Algorithms",
      "System Design (entry to senior level)",
      "Full Stack (React, Node, Python, Java)",
      "Cloud & DevOps (AWS, Docker, Kubernetes)",
      "Data Science, ML & AI roles",
      "HR round & behavioural questions",
    ],
  },
  {
    id: "private",
    icon: Briefcase,
    label: "Private / Non-IT",
    color: "from-orange-500 to-red-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    highlight: "text-orange-600 dark:text-orange-400",
    title: "Private Sector & Non-IT Roles",
    description:
      "Prepare for sales, marketing, finance, HR, operations, and management roles in private companies and MNCs.",
    topics: [
      "Sales & Business Development",
      "Marketing & Brand Management",
      "Finance, Accounting & CA interviews",
      "Human Resources & Talent Acquisition",
      "Operations & Supply Chain",
      "MBA / Management interviews",
    ],
  },
  {
    id: "campus",
    icon: GraduationCap,
    label: "Campus / Fresher",
    color: "from-orange-500 to-red-600",
    bg: "bg-orange-500/10",
    border: "border-orange-500/30",
    highlight: "text-orange-600 dark:text-orange-400",
    title: "Campus & Fresher Interviews",
    description:
      "Tailored for college students and recent graduates going through campus placement drives, aptitude rounds, and HR interviews.",
    topics: [
      "Tell me about yourself (STAR format)",
      "Academic project deep-dives",
      "Campus placement HR rounds",
      "Group discussion preparation",
      "Internship interview questions",
      "Salary & offer negotiation",
    ],
  },
];

const smoothEase = [0.25, 0.1, 0.25, 1] as const;

export default function PremiumInterviewTypes() {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const [activeId, setActiveId] = useState("it");
  const active = types.find((t) => t.id === activeId)!;
  const Icon = active.icon;

  return (
    <section
      ref={sectionRef}
      id="interview-types"
      className="relative py-10 sm:py-14 lg:py-16 overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(249,115,22,0.04) 0%, transparent 60%)",
          }}
        />
        <div
          className="absolute top-0 right-0 w-[600px] h-[500px] opacity-20"
          style={{
            background: "radial-gradient(circle, rgba(249,115,22,0.12) 0%, transparent 70%)",
            filter: "blur(80px)",
          }}
        />
        <div className="absolute inset-0 dark:bg-slate-900/30" />
      </div>

      {/* Top divider - Changed to Orange/Red Gradient */}
      <motion.div
        className="absolute top-0 left-0 right-0 h-px"
        style={{
          background: "linear-gradient(90deg, transparent, #f97316, #ef4444, transparent)",
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={isInView ? { scaleX: 1, opacity: 1 } : { scaleX: 0, opacity: 0 }}
        transition={{ duration: 1.2, ease: smoothEase }}
      />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.7, ease: smoothEase }}
        >
          <motion.span
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-sm font-medium mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Briefcase className="w-4 h-4" />
            Interview Categories
          </motion.span>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground mb-4">
            Prep for every{" "}
            <span className="bg-gradient-to-r from-orange-500 to-red-600 bg-clip-text text-transparent">
              type of interview
            </span>
          </h2>

          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Whether you're targeting a government post, a FAANG company, or your first campus job — we've got you covered.
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          className="flex flex-wrap justify-center gap-3 mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.6, delay: 0.2, ease: smoothEase }}
        >
          {types.map((t) => {
            const TIcon = t.icon;
            const isActive = t.id === activeId;
            return (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all duration-200 ${
                  isActive
                    ? `bg-gradient-to-r ${t.color} text-white border-transparent shadow-md`
                    : "bg-card border-border/50 text-muted-foreground hover:text-foreground hover:border-orange-500/30"
                }`}
              >
                <TIcon className="w-4 h-4" />
                {t.label}
              </button>
            );
          })}
        </motion.div>

        {/* Active panel */}
        <motion.div
          key={activeId}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: smoothEase }}
          className={`bg-card border-2 ${active.border} rounded-2xl p-8 lg:p-10 grid lg:grid-cols-2 gap-10 items-center`}
        >
          {/* Left */}
          <div className="space-y-6">
            <div className={`w-14 h-14 rounded-2xl ${active.bg} flex items-center justify-center`}>
              <Icon className={`w-7 h-7 ${active.highlight}`} />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-3">{active.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{active.description}</p>
            </div>
            <Link to="/setup">
              <Button className={`bg-gradient-to-r ${active.color} text-white border-0 gap-2 font-semibold hover:opacity-90`}>
                Practice {active.label} Interview
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>

          {/* Right — topics list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
            {active.topics.map((topic, idx) => (
              <div key={idx} className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${active.highlight}`} />
                <span className="text-sm text-muted-foreground">{topic}</span>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}